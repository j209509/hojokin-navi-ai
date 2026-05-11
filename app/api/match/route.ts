import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MOCK_GRANTS } from "@/lib/mockData";

export const dynamic = "force-dynamic";

type GrantInput = {
  id: string;
  name: string;
  ministry: string;
  category: string;
  description: string;
  maxAmount: number;
  adoptionRate?: number | null;
  deadline?: string | null;
  tags: readonly string[] | string[];
};

type MatchResult = {
  grantId: string;
  name: string;
  ministry: string;
  category: string;
  description: string;
  maxAmount: number;
  adoptionRate: number;
  deadline: string;
  tags: string[];
  matchScore: number;
  matchReason: string;
  requirements: string[];
};

// POST /api/match — Claude AIによる補助金マッチング
export async function POST(request: Request) {
  try {
    const { businessDesc, industry, employeeCount, region, grants: inputGrants } =
      await request.json() as {
        businessDesc: string;
        industry: string;
        employeeCount?: string;
        region?: string;
        grants?: GrantInput[];
      };

    if (!businessDesc || !industry) {
      return NextResponse.json(
        { error: "事業内容と業種は必須です" },
        { status: 400 }
      );
    }

    // 補助金データ（APIから渡されるか、DBから取得）
    let grants: GrantInput[];
    if (inputGrants && inputGrants.length > 0) {
      grants = inputGrants;
    } else {
      // DBから受付中の補助金を取得（地域フィルター付き）
      try {
        const { default: prisma } = await import("@/lib/prisma");

        // 全国補助金 + 選択地域の補助金のみ取得
        const NATIONAL_KEYWORDS = ["経産省","中小企業庁","中企庁","厚労省","農水省","環境省","国交省","総務省","デジタル庁","観光庁","内閣府","文科省","財務省","中小機構","NEDO","JST","JETRO","全国","国"];
        const isNational = (ministry: string) =>
          NATIONAL_KEYWORDS.some((k) => ministry.includes(k));

        const allGrants = await prisma.grant.findMany({
          where: { isActive: true },
          select: {
            id: true, name: true, ministry: true, category: true,
            description: true, maxAmount: true, adoptionRate: true,
            deadline: true, tags: true,
          },
          take: 500,
          orderBy: { updatedAt: "desc" },
        });

        // 地域フィルタリング: 全国補助金 + ユーザー選択都道府県の補助金
        grants = allGrants.filter((g) => {
          if (isNational(g.ministry)) return true;
          if (!region || region === "指定なし") return false; // 地域未選択時は全国のみ
          return g.ministry.includes(region) ||
                 g.description.includes(region) ||
                 (Array.isArray(g.tags) && g.tags.some((t) => t.includes(region)));
        }).slice(0, 200);
      } catch {
        // DB未接続時はモックデータにフォールバック
        grants = MOCK_GRANTS as unknown as GrantInput[];
      }
    }

    // ANTHROPIC_API_KEY が未設定 or デモキーの場合はモックレスポンスを返す
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.includes("your-anthropic")) {
      return NextResponse.json({
        results: generateSmartMockResults(grants, businessDesc, industry, employeeCount),
        source: "mock",
        message: "ANTHROPIC_API_KEY未設定のため、キーワードマッチングによる推奨を返しています",
      });
    }

    // Anthropic SDK 初期化
    const client = new Anthropic({ apiKey });

    const systemPrompt = `あなたは日本の中小企業向け補助金マッチングの専門家AIです。
企業の事業内容・業種・規模・課題を深く分析し、最適な補助金をJSON形式で推奨してください。

【分析の観点】
1. 業種との親和性：その補助金がその業種を明示的に対象としているか
2. 課題との合致：企業の課題（DX、設備、人材、環境等）と補助金の目的が一致するか
3. 規模の適合：従業員規模が対象要件を満たすか
4. 採択率：高いほど申請成功の可能性が高い
5. 補助金額：企業のニーズに対して適切な規模か

【回答形式】必ず以下のJSONのみを返してください（説明文は不要）：
{
  "results": [
    {
      "grantId": "補助金のID文字列",
      "matchScore": 整数(0-100),
      "matchReason": "この補助金が貴社に適している理由（業種・課題・規模の観点から60-120字で具体的に）",
      "requirements": ["申請に必要な主要条件1", "条件2", "条件3"]
    }
  ]
}

上位5件をmatchScore降順で返してください。matchScoreは現実的に評価してください（最高でも97程度）。`;

    const userPrompt = `以下の企業情報を分析し、最適な補助金トップ5をJSONで返してください。

【企業情報】
- 事業内容・課題: ${businessDesc}
- 業種: ${industry}
- 従業員数: ${employeeCount ?? "未設定"}

【補助金候補リスト（${grants.length}件）】
${grants
  .map(
    (g) =>
      `[ID:${g.id}] ${g.name}（${g.ministry}・${g.category}）
概要: ${g.description}
上限: ${g.maxAmount}万円 / 採択率: ${g.adoptionRate ?? "不明"}% / 締切: ${g.deadline ?? "要確認"}
キーワード: ${Array.isArray(g.tags) ? g.tags.join("、") : ""}`
  )
  .join("\n\n")}`;

    // Claude API呼び出し（システムプロンプトをキャッシュ）
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // JSON部分を抽出（マークダウンコードブロックも対応）
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON not found in Claude response");
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      results: Array<{
        grantId: string;
        matchScore: number;
        matchReason: string;
        requirements: string[];
      }>;
    };

    // 補助金の詳細情報とマッチ結果をマージ
    const results: MatchResult[] = parsed.results
      .map((r) => {
        const grant = grants.find((g) => g.id === r.grantId);
        if (!grant) return null;
        return {
          grantId: r.grantId,
          name: grant.name,
          ministry: grant.ministry,
          category: grant.category,
          description: grant.description,
          maxAmount: grant.maxAmount,
          adoptionRate: grant.adoptionRate ?? 50,
          deadline: grant.deadline ?? "要確認",
          tags: Array.isArray(grant.tags) ? [...grant.tags] : [],
          matchScore: Math.min(Math.max(r.matchScore, 1), 99),
          matchReason: r.matchReason,
          requirements: r.requirements ?? [],
        };
      })
      .filter((r): r is MatchResult => r !== null)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    return NextResponse.json({
      results,
      source: "claude",
      usage: response.usage,
    });
  } catch (error) {
    console.error("[/api/match] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "マッチングに失敗しました" },
      { status: 500 }
    );
  }
}

// ─── スマートモックマッチング ────────────────────────────────────────
// 業種・キーワードを多角的に分析して現実的なスコアを返す

const INDUSTRY_CATEGORY_MAP: Record<string, string[]> = {
  "IT・通信業":   ["デジタル化", "技術開発"],
  "製造業":       ["設備投資", "技術開発", "デジタル化"],
  "建設業":       ["設備投資", "デジタル化"],
  "小売業":       ["販路開拓", "デジタル化"],
  "飲食業":       ["販路開拓", "省エネ"],
  "サービス業":   ["人材育成", "デジタル化"],
  "医療・福祉":   ["設備投資", "人材育成"],
  "農業・林業":   ["農業", "設備投資"],
  "運輸業":       ["省エネ", "デジタル化"],
  "不動産業":     ["省エネ", "デジタル化"],
};

const KEYWORD_CATEGORY_MAP: Record<string, string[]> = {
  "DX":           ["デジタル化"],
  "デジタル":     ["デジタル化"],
  "IT":           ["デジタル化"],
  "AI":           ["デジタル化", "技術開発"],
  "クラウド":     ["デジタル化"],
  "省力化":       ["デジタル化", "設備投資"],
  "自動化":       ["デジタル化", "設備投資"],
  "設備":         ["設備投資"],
  "機械":         ["設備投資"],
  "省エネ":       ["省エネ"],
  "環境":         ["省エネ"],
  "脱炭素":       ["省エネ"],
  "人材":         ["人材育成"],
  "採用":         ["雇用", "人材育成"],
  "研修":         ["人材育成"],
  "賃上げ":       ["人材育成"],
  "販路":         ["販路開拓"],
  "HP":           ["販路開拓"],
  "EC":           ["販路開拓"],
  "海外":         ["海外展開"],
  "輸出":         ["海外展開"],
  "農業":         ["農業"],
  "観光":         ["観光"],
  "起業":         ["創業"],
  "創業":         ["創業"],
  "事業転換":     ["事業転換"],
  "新事業":       ["事業転換"],
  "承継":         ["事業承継"],
};

const REQUIREMENTS_MAP: Record<string, string[]> = {
  "デジタル化":   ["中小企業・小規模事業者", "IT導入支援事業者との連携", "GビズIDの取得"],
  "設備投資":     ["中小企業・小規模事業者", "事業計画書の提出", "認定支援機関との連携"],
  "販路開拓":     ["小規模事業者（従業員20名以下）", "商工会議所・商工会への相談", "事業計画書の提出"],
  "人材育成":     ["雇用保険適用事業所", "訓練計画の事前届出", "賃金台帳等の提出"],
  "省エネ":       ["中小企業・中堅企業", "省エネ診断の実施", "エネルギー管理の取組"],
  "事業転換":     ["中小企業・小規模事業者", "認定支援機関との連携", "売上減少要件の満足"],
  "雇用":         ["雇用保険適用事業所", "ハローワークへの求人登録", "雇用契約書の締結"],
  "農業":         ["農業者・農業法人", "農業経営計画書の作成", "JAまたは農業委員会への相談"],
  "観光":         ["観光関連事業者", "観光地域づくり法人（DMO）との連携", "事業計画書の提出"],
  "創業":         ["創業予定者または創業後間もない事業者", "事業計画書の提出", "自己資金の確保"],
};

function generateSmartMockResults(
  grants: GrantInput[],
  businessDesc: string,
  industry: string,
  employeeCount?: string | null
): MatchResult[] {
  const desc = businessDesc.toLowerCase();

  // 業種に対応するカテゴリ
  const industryCategories = INDUSTRY_CATEGORY_MAP[industry] ?? [];

  // 説明文からキーワードを抽出してカテゴリを特定
  const descCategories: string[] = [];
  for (const [keyword, cats] of Object.entries(KEYWORD_CATEGORY_MAP)) {
    if (desc.includes(keyword.toLowerCase())) {
      descCategories.push(...cats);
    }
  }

  // スコアリング
  const scored = grants.map((g) => {
    let score = 40 + Math.floor(Math.random() * 15); // ベーススコア 40-54

    // カテゴリ一致による加点
    if (industryCategories.includes(g.category)) score += 25;
    if (descCategories.includes(g.category)) score += 20;

    // 採択率による加点
    if (g.adoptionRate && g.adoptionRate >= 70) score += 8;
    else if (g.adoptionRate && g.adoptionRate >= 55) score += 5;

    // 従業員規模との相性
    if (employeeCount) {
      const isSmall = employeeCount.includes("1〜") || employeeCount.includes("6〜") || employeeCount.includes("11〜");
      if (isSmall && g.category === "販路開拓") score += 10; // 小規模持続化
      if (isSmall && g.maxAmount <= 200) score += 5;
    }

    // 上限金額による調整（大きすぎる補助金は中小には縁が薄い）
    if (g.maxAmount > 5000 && !desc.includes("大規模")) score -= 8;

    // キャップ
    score = Math.min(Math.max(score, 30), 97);

    // マッチ理由の生成
    const matchReason = buildMatchReason(g, industry, industryCategories, descCategories);
    const requirements = REQUIREMENTS_MAP[g.category] ?? ["中小企業・小規模事業者", "事業計画書の提出", "認定支援機関との連携"];

    return {
      grantId: g.id,
      name: g.name,
      ministry: g.ministry,
      category: g.category,
      description: g.description,
      maxAmount: g.maxAmount,
      adoptionRate: g.adoptionRate ?? 50,
      deadline: g.deadline ?? "要確認",
      tags: Array.isArray(g.tags) ? [...g.tags] : [],
      matchScore: score,
      matchReason,
      requirements,
    };
  });

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

function buildMatchReason(
  g: GrantInput,
  industry: string,
  industryCategories: string[],
  descCategories: string[]
): string {
  const reasons: string[] = [];

  if (industryCategories.includes(g.category)) {
    reasons.push(`${industry}における${g.category}分野の代表的な補助金`);
  }
  if (descCategories.includes(g.category)) {
    reasons.push("記載された課題・取り組み内容と目的が合致");
  }
  if (g.adoptionRate && g.adoptionRate >= 70) {
    reasons.push(`採択率${g.adoptionRate}%と比較的高く申請しやすい`);
  }
  if (g.maxAmount >= 1000) {
    reasons.push(`最大${g.maxAmount.toLocaleString()}万円と補助規模が大きい`);
  }

  if (reasons.length === 0) {
    reasons.push(`${g.ministry}所管の${g.category}支援策として活用可能`);
  }

  return reasons.slice(0, 2).join("。") + "。";
}
