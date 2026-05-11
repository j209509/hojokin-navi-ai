/**
 * lib/jgrants.ts
 * jGrants（デジタル庁補助金ポータル）公開API クライアント
 *
 * 【API概要】
 * デジタル庁が運営する jGrants ポータルの公開REST API。
 * ベースURL: https://api.jgrants-portal.go.jp/exp/v1/public
 * 認証: 不要（公開API）
 * ※ keyword パラメータが必須（2文字以上）
 *
 * 【取得戦略】
 * keyword は必須のため、複数の広義キーワードで検索して ID でデデュプ。
 * 「補助金」「助成金」「支援」「IT」「DX」「省エネ」「人材」など幅広く収集する。
 */

const JGRANTS_BASE = "https://api.jgrants-portal.go.jp/exp/v1/public";

// ─── 型定義 ─────────────────────────────────────────────────────────

/** jGrants リスト API が返す1件（概要のみ） */
export interface JGrantsSubsidySummary {
  /** Salesforce ID（例: "a0WJ200000ABCDEMAX"） */
  id: string;
  /** 管理番号（例: "S-00009061"） */
  name: string;
  /** 補助金名 */
  title: string;
  /** 対象地域（"全国" または都道府県名） */
  target_area_search: string;
  /** 補助金上限額（円。万円ではない） */
  subsidy_max_limit: number | null;
  /** 公募開始日時（ISO 8601） */
  acceptance_start_datetime: string | null;
  /** 公募終了日時（ISO 8601、null=通年） */
  acceptance_end_datetime: string | null;
  /** 対象従業員規模 */
  target_number_of_employees: string | null;
  /** 実施機関名（リストでは null のケース多い） */
  institution_name: string | null;
}

/** jGrants 詳細 API が返す完全データ */
export interface JGrantsSubsidyDetail extends JGrantsSubsidySummary {
  /** 補助金概要（HTML形式） */
  detail: string | null;
  /** 利用目的 */
  use_purpose: string | null;
  /** 対象業種（スラッシュ区切り） */
  industry: string | null;
  /** 対象地域詳細 */
  target_area_detail: string | null;
  /** 補助率 */
  subsidy_rate: string | null;
  /** 事業完了期限 */
  project_end_deadline: string | null;
  /** jGrantsポータル詳細URL */
  front_subsidy_detail_page_url: string | null;
  /** キャッチフレーズ */
  subsidy_catch_phrase: string | null;
}

/** リスト API のレスポンス */
export interface JGrantsListResponse {
  metadata: {
    type: string;
    resultset: { count: number };
  };
  result: JGrantsSubsidySummary[];
}

/** 詳細 API のレスポンス */
export interface JGrantsDetailResponse {
  metadata: {
    type: string;
    resultset: { count: number };
  };
  result: JGrantsSubsidyDetail[];
}

/** 検索パラメータ */
export interface JGrantsSearchParams {
  /** 検索キーワード（必須・2文字以上） */
  keyword: string;
  /** 並び順フィールド */
  sort?: "created_date" | "acceptance_start_datetime" | "acceptance_end_datetime";
  /** 昇順/降順 */
  order?: "ASC" | "DESC";
  /** 1=受付中のみ、0=全件 */
  acceptance?: 0 | 1;
  /** 業種フィルタ */
  industry?: string;
  /** 地域フィルタ */
  target_area_search?: string;
  /** 従業員数フィルタ */
  target_number_of_employees?: string;
}

// ─── APIクライアント ───────────────────────────────────────────────

/**
 * jGrants API から補助金リストを取得
 * keyword は必須（2文字以上）
 */
export async function fetchJGrantsSubsidies(
  params: JGrantsSearchParams
): Promise<JGrantsListResponse> {
  const {
    keyword,
    sort = "created_date",
    order = "DESC",
    acceptance,
    industry,
    target_area_search,
    target_number_of_employees,
  } = params;

  const query = new URLSearchParams({
    keyword,
    sort,
    order,
  });

  if (acceptance !== undefined) query.set("acceptance", String(acceptance));
  if (industry)                  query.set("industry", industry);
  if (target_area_search)        query.set("target_area_search", target_area_search);
  if (target_number_of_employees) query.set("target_number_of_employees", target_number_of_employees);

  const url = `${JGRANTS_BASE}/subsidies?${query.toString()}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "HojokinNaviAI/1.0 (https://hojokin-navi-ai.vercel.app)",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `jGrants API error: ${res.status} ${res.statusText} (keyword: ${keyword})`
    );
  }

  return res.json() as Promise<JGrantsListResponse>;
}

/**
 * jGrants API から補助金詳細を取得（idベース）
 */
export async function fetchJGrantsDetail(
  id: string
): Promise<JGrantsSubsidyDetail | null> {
  const url = `${JGRANTS_BASE}/subsidies/id/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = (await res.json()) as JGrantsDetailResponse;
  return json.result?.[0] ?? null;
}

/**
 * 複数キーワードで広範囲に補助金を収集
 * @param includeAll true なら締切済み含む全件（約2,000件超）
 *                   false なら受付中のみ（約250件）
 */
export async function fetchAllActiveSubsidies(
  includeAll = false
): Promise<JGrantsSubsidySummary[]> {
  // 幅広いキーワードで網羅的に取得
  // includeAll=true のとき「補助金」だけで2,000件以上ヒットするが、
  // 「助成金」「支援事業」など別語でしか引っかからないものもあるので複数使用
  const BROAD_KEYWORDS = includeAll
    ? [
        "補助金",   // 最多（全体の大部分をカバー）
        "助成金",   // 雇用・厚労系
        "支援事業", // 〇〇支援事業（地方系が多い）
        "給付金",   // 給付型
        "交付金",   // 交付型
      ]
    : [
        "補助金", "助成金", "支援事業", "IT", "DX",
        "省エネ", "人材", "農業", "観光", "創業",
        "設備", "海外展開", "事業再構築",
      ];

  const seen = new Set<string>();
  const all: JGrantsSubsidySummary[] = [];

  for (const keyword of BROAD_KEYWORDS) {
    try {
      const res = await fetchJGrantsSubsidies({
        keyword,
        sort: "acceptance_end_datetime",
        order: "ASC",
        acceptance: includeAll ? 0 : 1,
      });

      for (const s of res.result) {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          all.push(s);
        }
      }

      // Rate limit 対策
      await new Promise((r) => setTimeout(r, 200));
    } catch (e) {
      console.warn(`fetchAllActiveSubsidies: keyword "${keyword}" failed:`, e);
    }
  }

  return all;
}

// ─── jGrants → DBスキーマ 変換 ───────────────────────────────────

/** jGrantsのリストデータをPrisma Grant モデル形式に変換 */
export function convertJGrantsToGrant(s: JGrantsSubsidySummary) {
  // 補助金上限を万円単位に変換（APIは円単位）
  const maxAmount = s.subsidy_max_limit
    ? Math.round(s.subsidy_max_limit / 10000)
    : 0;

  // 締切日フォーマット（ISO → YYYY/MM/DD、null → "通年"）
  const deadline = s.acceptance_end_datetime
    ? new Date(s.acceptance_end_datetime)
        .toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Tokyo",
        })
        .replace(/\//g, "/")
    : "通年";

  // 受付中かどうかを締切日から判定
  const isActive = s.acceptance_end_datetime
    ? new Date(s.acceptance_end_datetime) > new Date()
    : true; // 通年は常にアクティブ

  // 省庁名の正規化
  const ministry = normalizeMinistry(s.institution_name ?? "", s.title);

  // カテゴリの推定
  const category = inferCategory(s.title, s.target_area_search ?? "");

  // タグ生成
  const tags = generateTags(s.title, s.target_number_of_employees ?? "", category);

  // 詳細ページURL（リストAPIではURLがないのでパターンから生成）
  const url = `https://www.jgrants-portal.go.jp/subsidy/${s.id}`;

  return {
    name: s.title,
    ministry,
    category,
    description: `jGrantsポータルでご確認ください。対象地域: ${s.target_area_search ?? "全国"}。従業員規模: ${s.target_number_of_employees ?? "制限なし"}`,
    maxAmount,
    adoptionRate: null,
    deadline,
    tags,
    isActive,
    jgrantsId: s.id,
    url,
  };
}

/** 詳細データで description / institution_name を補完する */
export function enrichGrantWithDetail(
  base: ReturnType<typeof convertJGrantsToGrant>,
  detail: JGrantsSubsidyDetail
) {
  // HTML タグ除去
  const rawDesc = detail.detail
    ? detail.detail.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    : base.description;

  const ministry =
    detail.institution_name
      ? normalizeMinistry(detail.institution_name, base.name)
      : base.ministry;

  const url = detail.front_subsidy_detail_page_url ?? base.url;

  return {
    ...base,
    ministry,
    description: rawDesc.slice(0, 500),
    url,
  };
}

// ─── ヘルパー ────────────────────────────────────────────────────

export function normalizeMinistry(name: string, title = ""): string {
  const text = `${name} ${title}`;
  if (text.includes("経済産業")) return "経産省";
  if (text.includes("中小企業庁")) return "中小企業庁";
  if (text.includes("厚生労働") || text.includes("厚労")) return "厚労省";
  if (text.includes("農林水産") || text.includes("農水")) return "農水省";
  if (text.includes("環境省") || text.includes("環境")) return "環境省";
  if (text.includes("国土交通") || text.includes("国交")) return "国交省";
  if (text.includes("総務省")) return "総務省";
  if (text.includes("文部科学") || text.includes("文科")) return "文科省";
  if (text.includes("デジタル庁")) return "デジタル庁";
  if (text.includes("内閣府")) return "内閣府";
  if (text.includes("観光庁")) return "観光庁";
  if (text.includes("復興庁")) return "復興庁";
  if (text.includes("NEDO")) return "NEDO";
  if (text.includes("JST")) return "JST";
  // 都道府県・政令市
  for (const [keyword, normalized] of REGION_MAP) {
    if (text.includes(keyword)) return normalized;
  }
  // fallback: institution_name の先頭20文字
  return name ? name.slice(0, 20) : "その他";
}

const REGION_MAP: [string, string][] = [
  ["北海道", "北海道"], ["青森", "青森県"], ["岩手", "岩手県"], ["宮城", "宮城県"],
  ["秋田", "秋田県"], ["山形", "山形県"], ["福島", "福島県"], ["茨城", "茨城県"],
  ["栃木", "栃木県"], ["群馬", "群馬県"], ["埼玉", "埼玉県"], ["千葉", "千葉県"],
  ["東京都", "東京都"], ["神奈川", "神奈川県"], ["新潟", "新潟県"], ["富山", "富山県"],
  ["石川", "石川県"], ["福井", "福井県"], ["山梨", "山梨県"], ["長野", "長野県"],
  ["岐阜", "岐阜県"], ["静岡", "静岡県"], ["愛知", "愛知県"], ["三重", "三重県"],
  ["滋賀", "滋賀県"], ["京都", "京都府"], ["大阪", "大阪府"], ["兵庫", "兵庫県"],
  ["奈良", "奈良県"], ["和歌山", "和歌山県"], ["鳥取", "鳥取県"], ["島根", "島根県"],
  ["岡山", "岡山県"], ["広島", "広島県"], ["山口", "山口県"], ["徳島", "徳島県"],
  ["香川", "香川県"], ["愛媛", "愛媛県"], ["高知", "高知県"], ["福岡", "福岡県"],
  ["佐賀", "佐賀県"], ["長崎", "長崎県"], ["熊本", "熊本県"], ["大分", "大分県"],
  ["宮崎", "宮崎県"], ["鹿児島", "鹿児島県"], ["沖縄", "沖縄県"],
];

export function inferCategory(title: string, area = ""): string {
  const text = `${title} ${area}`.toLowerCase();
  if (text.includes("デジタル") || text.includes("it") || text.includes("dx") || text.includes("ict") || text.includes("システム") || text.includes("クラウド")) return "デジタル化";
  if (text.includes("省エネ") || text.includes("脱炭素") || text.includes("再エネ") || text.includes("グリーン") || text.includes("ゼロカーボン") || text.includes("環境")) return "省エネ";
  if (text.includes("設備") || text.includes("機械") || text.includes("装置") || text.includes("ものづくり") || text.includes("生産性")) return "設備投資";
  if (text.includes("人材") || text.includes("訓練") || text.includes("研修") || text.includes("スキル") || text.includes("リスキリング") || text.includes("キャリア")) return "人材育成";
  if (text.includes("販路") || text.includes("マーケット") || text.includes("広告") || text.includes("持続化") || text.includes("小規模")) return "販路開拓";
  if (text.includes("雇用") || text.includes("採用") || text.includes("就職") || text.includes("障害者") || text.includes("労働")) return "雇用";
  if (text.includes("農業") || text.includes("農林") || text.includes("漁業") || text.includes("畜産") || text.includes("水産")) return "農業";
  if (text.includes("観光") || text.includes("宿泊") || text.includes("インバウンド") || text.includes("旅行")) return "観光";
  if (text.includes("創業") || text.includes("起業") || text.includes("スタートアップ") || text.includes("開業")) return "創業";
  if (text.includes("事業承継") || text.includes("引継") || text.includes("後継")) return "事業承継";
  if (text.includes("事業再構築") || text.includes("業態転換") || text.includes("新分野") || text.includes("多角化")) return "事業転換";
  if (text.includes("研究") || text.includes("開発") || text.includes("技術") || text.includes("イノベーション")) return "技術開発";
  if (text.includes("地域") || text.includes("まちづくり") || text.includes("商店街") || text.includes("地方")) return "地域活性化";
  if (text.includes("海外") || text.includes("輸出") || text.includes("グローバル") || text.includes("国際")) return "海外展開";
  if (text.includes("医療") || text.includes("介護") || text.includes("福祉") || text.includes("保健")) return "医療・福祉";
  if (text.includes("建設") || text.includes("住宅") || text.includes("不動産")) return "建設・住宅";
  return "その他";
}

export function generateTags(
  title: string,
  employeeRange: string,
  category: string
): string[] {
  const tags = new Set<string>();

  // カテゴリ別キーワード
  const categoryKeywords: Record<string, string[]> = {
    "デジタル化": ["DX推進", "IT活用", "デジタル化"],
    "省エネ": ["省エネ", "脱炭素", "グリーン経営"],
    "設備投資": ["設備投資", "生産性向上"],
    "人材育成": ["人材育成", "スキルアップ"],
    "販路開拓": ["販路拡大", "小規模事業者"],
    "雇用": ["雇用促進", "採用支援"],
    "農業": ["農業", "スマート農業"],
    "観光": ["観光", "インバウンド"],
    "創業": ["創業支援", "起業"],
    "事業転換": ["事業再構築", "新事業"],
    "技術開発": ["研究開発", "技術革新"],
    "海外展開": ["海外展開", "輸出支援"],
    "医療・福祉": ["医療", "介護"],
    "建設・住宅": ["建設", "住宅"],
  };

  const kws = categoryKeywords[category] ?? [];
  if (kws.length > 0) tags.add(kws[0]);

  // タイトルから業種キーワード抽出
  const industryKws = ["製造業", "建設業", "飲食", "医療", "介護", "物流", "IT", "小売", "農業", "観光", "金融"];
  for (const kw of industryKws) {
    if (title.includes(kw)) tags.add(kw);
  }

  // 従業員規模タグ
  if (employeeRange.includes("20名以下") || employeeRange.includes("5名以下")) {
    tags.add("小規模事業者");
  } else if (employeeRange.includes("300名以下") || employeeRange.includes("中小")) {
    tags.add("中小企業");
  }

  return [...tags].slice(0, 5);
}

// ─── 都道府県コード一覧 ────────────────────────────────────────────

export const PREFECTURE_CODES: Record<string, string> = {
  "01": "北海道", "02": "青森県", "03": "岩手県", "04": "宮城県",
  "05": "秋田県", "06": "山形県", "07": "福島県", "08": "茨城県",
  "09": "栃木県", "10": "群馬県", "11": "埼玉県", "12": "千葉県",
  "13": "東京都", "14": "神奈川県", "15": "新潟県", "16": "富山県",
  "17": "石川県", "18": "福井県", "19": "山梨県", "20": "長野県",
  "21": "岐阜県", "22": "静岡県", "23": "愛知県", "24": "三重県",
  "25": "滋賀県", "26": "京都府", "27": "大阪府", "28": "兵庫県",
  "29": "奈良県", "30": "和歌山県", "31": "鳥取県", "32": "島根県",
  "33": "岡山県", "34": "広島県", "35": "山口県", "36": "徳島県",
  "37": "香川県", "38": "愛媛県", "39": "高知県", "40": "福岡県",
  "41": "佐賀県", "42": "長崎県", "43": "熊本県", "44": "大分県",
  "45": "宮崎県", "46": "鹿児島県", "47": "沖縄県",
};
