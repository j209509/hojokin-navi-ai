/**
 * lib/mhlw.ts
 * 厚生労働省 雇用関係助成金スクレイパー
 *
 * 対象: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/
 * ライセンス: 政府標準利用規約（第2.0版）に基づき利用可
 *   https://www.mhlw.go.jp/chosakuken/
 *
 * 取得できる主な助成金（約30件）:
 * - キャリアアップ助成金
 * - 人材開発支援助成金
 * - 雇用調整助成金
 * - 両立支援等助成金
 * - 特定求職者雇用開発助成金
 * - トライアル雇用助成金
 * - 地域雇用開発助成金
 * - 障害者雇用系各種助成金 など
 */

const MHLW_BASE = "https://www.mhlw.go.jp";
const MHLW_KYUFUKIN_URL = `${MHLW_BASE}/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/index.html`;

export interface MhlwGrant {
  name: string;
  description: string;
  url: string;
  category: string;
  maxAmount: number;
  deadline: string;
  tags: string[];
}

/**
 * 厚労省の雇用関係助成金一覧を取得
 * HTMLを解析してGrantデータを生成する
 */
export async function fetchMhlwGrants(): Promise<MhlwGrant[]> {
  const res = await fetch(MHLW_KYUFUKIN_URL, {
    headers: {
      "User-Agent": "HojokinNaviAI/1.0 (https://hojokin-navi-ai.vercel.app; contact: admin)",
      "Accept": "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`MHLW fetch error: ${res.status}`);
  }

  const html = await res.text();
  return parseMhlwGrants(html);
}

/**
 * 厚労省HTMLから助成金データを抽出
 */
function parseMhlwGrants(html: string): MhlwGrant[] {
  const grants: MhlwGrant[] = [];

  // リンクと周辺テキストを抽出
  // パターン: href に kyufukin を含むリンク
  const linkPattern = /href="([^"]*kyufukin[^"]*)"[^>]*>([^<]+)</g;
  let match;
  const seen = new Set<string>();

  while ((match = linkPattern.exec(html)) !== null) {
    const [, href, text] = match;
    const name = text.trim();

    // ノイズフィルタ（ナビ・パンくずを除外）
    if (name.length < 5 || name.includes("ページ") || name.includes("トップ") ||
        name.includes("一覧") || name.includes("index") || seen.has(name)) continue;

    seen.add(name);

    const url = href.startsWith("http") ? href : `${MHLW_BASE}${href}`;
    const category = inferMhlwCategory(name);

    grants.push({
      name,
      description: `厚生労働省の${category}に関する助成金・給付金です。詳細は厚労省ページをご確認ください。`,
      url,
      category,
      maxAmount: guessMhlwAmount(name),
      deadline: "通年",  // 厚労省の雇用系助成金はほぼ通年受付
      tags: generateMhlwTags(name, category),
    });
  }

  // 静的データで補完（スクレイピングで取れない主要助成金）
  for (const grant of MHLW_STATIC_GRANTS) {
    if (!seen.has(grant.name)) {
      grants.push(grant);
    }
  }

  return grants;
}

function inferMhlwCategory(name: string): string {
  if (name.includes("キャリアアップ") || name.includes("正規雇用")) return "雇用";
  if (name.includes("人材開発") || name.includes("訓練") || name.includes("スキル")) return "人材育成";
  if (name.includes("雇用調整") || name.includes("休業")) return "雇用";
  if (name.includes("障害") || name.includes("障碍")) return "雇用";
  if (name.includes("両立") || name.includes("育児") || name.includes("介護")) return "人材育成";
  if (name.includes("トライアル") || name.includes("試行")) return "雇用";
  if (name.includes("特定求職") || name.includes("就職困難")) return "雇用";
  if (name.includes("地域")) return "地域活性化";
  return "雇用";
}

function guessMhlwAmount(name: string): number {
  if (name.includes("キャリアアップ")) return 96;      // 正規転換1人あたり最大96万円
  if (name.includes("人材開発")) return 200;            // 訓練経費等
  if (name.includes("雇用調整")) return 900;            // 雇用調整助成金（大口）
  if (name.includes("両立支援")) return 100;
  if (name.includes("障害者")) return 240;
  if (name.includes("特定求職")) return 240;
  return 50;
}

function generateMhlwTags(name: string, category: string): string[] {
  const tags: string[] = [category];
  if (name.includes("キャリアアップ")) tags.push("正社員化");
  if (name.includes("障害")) tags.push("障害者雇用");
  if (name.includes("育児") || name.includes("両立")) tags.push("育児支援");
  if (name.includes("人材開発") || name.includes("訓練")) tags.push("職業訓練");
  if (name.includes("高齢") || name.includes("定年")) tags.push("高齢者雇用");
  tags.push("厚労省");
  return [...new Set(tags)].slice(0, 5);
}

/** スクレイピングで取りにくい主要助成金の静的データ */
const MHLW_STATIC_GRANTS: MhlwGrant[] = [
  {
    name: "キャリアアップ助成金",
    description: "非正規雇用労働者の正規雇用転換、処遇改善、社会保険適用促進等の取組を行う事業主を支援します。正規雇用転換で1人あたり最大96万円（大企業72万円）。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html",
    category: "雇用",
    maxAmount: 96,
    deadline: "通年",
    tags: ["正社員化", "非正規雇用", "処遇改善", "雇用", "厚労省"],
  },
  {
    name: "人材開発支援助成金",
    description: "労働者のキャリア形成を効果的に促進するため、職務に関連した専門的な知識・技能を習得させるための職業訓練等を計画的に実施する事業主を支援します。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html",
    category: "人材育成",
    maxAmount: 200,
    deadline: "通年",
    tags: ["職業訓練", "人材育成", "スキルアップ", "雇用", "厚労省"],
  },
  {
    name: "両立支援等助成金",
    description: "仕事と家庭の両立に取り組む事業主を支援します。育児休業・介護休業の取得促進、産後パパ育休取得などで助成。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/ryouritsu.html",
    category: "人材育成",
    maxAmount: 100,
    deadline: "通年",
    tags: ["育児支援", "両立支援", "介護", "育休", "厚労省"],
  },
  {
    name: "雇用調整助成金",
    description: "経済上の理由により事業活動の縮小を余儀なくされた事業主が、雇用の維持を図るため休業等を実施した場合に、休業手当等の一部を助成します。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/pageL07.html",
    category: "雇用",
    maxAmount: 900,
    deadline: "通年",
    tags: ["雇用維持", "休業手当", "雇用調整", "雇用", "厚労省"],
  },
  {
    name: "特定求職者雇用開発助成金",
    description: "高齢者・障害者・母子家庭の母などの就職困難者を継続して雇用する労働者として雇い入れた事業主に対して助成します。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/tokutei_02.html",
    category: "雇用",
    maxAmount: 240,
    deadline: "通年",
    tags: ["就職困難者", "高齢者雇用", "障害者雇用", "雇用", "厚労省"],
  },
  {
    name: "トライアル雇用助成金",
    description: "就職困難者等を一定期間試行雇用（トライアル雇用）し、常用雇用への移行を促進する事業主を助成します。1人あたり月最大4万円（3ヶ月）。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/newpage_16286.html",
    category: "雇用",
    maxAmount: 12,
    deadline: "通年",
    tags: ["試行雇用", "就職困難者", "常用雇用", "雇用", "厚労省"],
  },
  {
    name: "障害者雇用安定助成金",
    description: "障害者が職場に適応し、安定して働けるよう職場適応援助者（ジョブコーチ）等による支援を行う事業主を助成します。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/shogaishakoyouantei.html",
    category: "雇用",
    maxAmount: 240,
    deadline: "通年",
    tags: ["障害者雇用", "ジョブコーチ", "職場適応", "雇用", "厚労省"],
  },
  {
    name: "地域雇用開発助成金",
    description: "雇用機会が特に不足している地域で、その地域に居住する求職者を雇用した事業主を支援します。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/chiki_koyoukaihatu.html",
    category: "雇用",
    maxAmount: 480,
    deadline: "通年",
    tags: ["地域雇用", "地方創生", "雇用創出", "雇用", "厚労省"],
  },
  {
    name: "産業雇用安定助成金",
    description: "新型コロナや経済変動等で事業活動の一時的な縮小を余儀なくされた企業が、他企業への労働者の出向により雇用を維持する場合に助成します。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/sangyo_koyou_antei.html",
    category: "雇用",
    maxAmount: 600,
    deadline: "通年",
    tags: ["出向", "雇用維持", "雇用安定", "雇用", "厚労省"],
  },
  {
    name: "65歳超雇用推進助成金",
    description: "65歳以上の高齢者が働きやすい職場環境の整備や、定年廃止・定年延長、高齢者の雇用管理制度の整備等を実施する事業主を助成します。",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/koureisha/topics/tp120903-1_00010.html",
    category: "雇用",
    maxAmount: 160,
    deadline: "通年",
    tags: ["高齢者雇用", "定年延長", "シニア活用", "雇用", "厚労省"],
  },
];

/** MhlwGrantをPrisma Grantスキーマ形式に変換 */
export function convertMhlwToGrant(g: MhlwGrant) {
  return {
    name: g.name,
    ministry: "厚労省",
    category: g.category,
    description: g.description.slice(0, 500),
    maxAmount: g.maxAmount,
    adoptionRate: null,
    deadline: g.deadline,
    tags: g.tags,
    isActive: true,
    jgrantsId: null,
    url: g.url,
  };
}
