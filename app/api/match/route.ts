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
    const { businessDesc, industry, employeeCount, grants: inputGrants } =
      await request.json();

    if (!businessDesc || !industry) {
      return NextResponse.json(
        { error: "事業内容と業種は必須です" },
        { status: 400 }
      );
    }

    // 補助金データ（APIから渡されるか、モックデータを使用）
    const grants: GrantInput[] = inputGrants ?? MOCK_GRANTS;

    // ANTHROPIC_API_KEY が未設定の場合はモックレスポンスを返す
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        results: generateMockMatchResults(grants, industry),
        source: "mock",
        message: "ANTHROPIC_API_KEY未設定のためモックデータを返しています",
      });
    }

    // Anthropic SDK 初期化
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Claude へのプロンプト
    const systemPrompt = `あなたは日本の中小企業向け補助金マッチングの専門家AIです。
企業の事業内容・業種・規模を分析し、最適な補助金を推奨してください。

必ずJSON形式で回答してください。以下の形式を厳守してください：
{
  "results": [
    {
      "grantId": "補助金のID",
      "matchScore": 0-100の整数,
      "matchReason": "なぜこの補助金がマッチするか（50-100字）",
      "requirements": ["申請に必要な条件1", "条件2", "条件3"]
    }
  ]
}

上位5件をmatchScore降順で返してください。`;

    const userPrompt = `以下の企業情報と補助金リストを分析してください。

【企業情報】
- 事業内容・課題: ${businessDesc}
- 業種: ${industry}
- 従業員数: ${employeeCount ?? "未設定"}

【補助金リスト（全${grants.length}件）】
${grants
  .map(
    (g) =>
      `ID: ${g.id}
名前: ${g.name}（${g.ministry}）
カテゴリ: ${g.category}
概要: ${g.description}
上限金額: ${g.maxAmount}万円
採択率: ${g.adoptionRate ?? "不明"}%
キーワード: ${Array.isArray(g.tags) ? g.tags.join(", ") : ""}`
  )
  .join("\n\n")}

この企業に最適な補助金トップ5をJSONで返してください。`;

    // Claude API呼び出し（プロンプトキャッシング適用）
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" }, // システムプロンプトをキャッシュ
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    // レスポンスをパース
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // JSON部分を抽出
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
          matchScore: r.matchScore,
          matchReason: r.matchReason,
          requirements: r.requirements,
        };
      })
      .filter((r): r is MatchResult => r !== null)
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      results,
      source: "claude",
      usage: response.usage,
    });
  } catch (error) {
    console.error("[/api/match] Error:", error);

    // エラー時はモックデータにフォールバック
    const grants: GrantInput[] = MOCK_GRANTS as unknown as GrantInput[];
    return NextResponse.json({
      results: generateMockMatchResults(grants, ""),
      source: "mock",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// フォールバック用モックマッチング（スコア計算）
function generateMockMatchResults(
  grants: GrantInput[],
  industry: string
): MatchResult[] {
  const scored = grants.map((g) => {
    let score = Math.floor(Math.random() * 30) + 50; // 50-80のランダムベース

    // 業種に応じてスコア調整
    if (industry.includes("IT") && g.category === "デジタル化") score += 20;
    if (industry.includes("製造") && g.category === "設備投資") score += 15;
    if (industry.includes("飲食") && g.category === "販路開拓") score += 15;
    if (g.adoptionRate && g.adoptionRate > 60) score += 5;

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
      matchScore: Math.min(score, 99),
      matchReason: `${g.category}分野の補助金として、貴社の事業内容と高い親和性があります。`,
      requirements: ["中小企業・小規模事業者", "事業計画書の提出", "認定支援機関との連携"],
    };
  });

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}
