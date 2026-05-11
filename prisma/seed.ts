import prisma from "../lib/prisma";

const grantData = [
  {
    name: "IT導入補助金2024",
    ministry: "経産省",
    category: "デジタル化",
    description: "中小企業・小規模事業者のITツール導入を支援。業務効率化・売上向上を実現するソフトウェア、クラウドサービス等の経費を補助します。",
    maxAmount: 450,
    adoptionRate: 68,
    deadline: "2024/05/31",
    tags: ["IT", "業務効率化", "クラウド"],
  },
  {
    name: "小規模事業者持続化補助金",
    ministry: "中小企業庁",
    category: "販路開拓",
    description: "小規模事業者の販路開拓・業務効率化を支援。チラシ作成、HP制作、展示会出展、設備導入等の経費の2/3を補助します。",
    maxAmount: 200,
    adoptionRate: 54,
    deadline: "2024/06/12",
    tags: ["販路拡大", "HP制作", "広告"],
  },
  {
    name: "ものづくり補助金",
    ministry: "中小企業庁",
    category: "設備投資",
    description: "革新的な製品・サービス開発や生産プロセス改善のための設備投資を支援。機械装置、システム構築費等の経費を補助します。",
    maxAmount: 1000,
    adoptionRate: 48,
    deadline: "2024/06/07",
    tags: ["設備", "製造", "革新"],
  },
  {
    name: "事業再構築補助金",
    ministry: "経産省",
    category: "事業転換",
    description: "新分野展開、業態転換、事業・業種転換等の思い切った事業再構築に取り組む中小企業を支援します。",
    maxAmount: 10000,
    adoptionRate: 38,
    deadline: "2024/07/31",
    tags: ["事業転換", "新分野"],
  },
  {
    name: "省エネ設備導入補助金",
    ministry: "環境省",
    category: "省エネ",
    description: "省エネルギー設備の導入を通じてCO2排出量削減と事業コスト削減を同時に実現する取り組みを支援します。",
    maxAmount: 3000,
    adoptionRate: 62,
    deadline: "2024/08/30",
    tags: ["省エネ", "環境", "設備"],
  },
  {
    name: "雇用調整助成金",
    ministry: "厚労省",
    category: "雇用",
    description: "経済上の理由により事業活動の縮小を余儀なくされた事業主への助成金です。",
    maxAmount: 900,
    adoptionRate: 72,
    deadline: "通年",
    tags: ["雇用", "助成金", "休業"],
  },
  {
    name: "キャリアアップ助成金",
    ministry: "厚労省",
    category: "人材育成",
    description: "非正規雇用労働者の正規雇用転換等を促進する事業主への助成金です。",
    maxAmount: 96,
    adoptionRate: 81,
    deadline: "通年",
    tags: ["正社員化", "処遇改善", "人材"],
  },
  {
    name: "東京都中小企業設備投資補助金",
    ministry: "東京都",
    category: "設備投資",
    description: "都内中小企業の競争力強化のための設備投資を支援します。",
    maxAmount: 500,
    adoptionRate: 55,
    deadline: "2024/07/15",
    tags: ["東京", "設備", "競争力"],
  },
  {
    name: "大阪府ものづくり支援補助金",
    ministry: "大阪府",
    category: "製造",
    description: "大阪府内の中小製造業の技術力強化を支援します。",
    maxAmount: 300,
    adoptionRate: 60,
    deadline: "2024/08/01",
    tags: ["大阪", "製造業", "技術"],
  },
  {
    name: "人材開発支援助成金",
    ministry: "厚労省",
    category: "人材育成",
    description: "職業訓練の実施に対して訓練経費や賃金の一部を助成します。",
    maxAmount: 200,
    adoptionRate: 77,
    deadline: "通年",
    tags: ["研修", "訓練", "人材育成"],
  },
  {
    name: "農業経営基盤強化支援補助金",
    ministry: "農水省",
    category: "農業",
    description: "農業経営の基盤強化のための機械・設備導入を支援します。",
    maxAmount: 1500,
    adoptionRate: 45,
    deadline: "2024/06/30",
    tags: ["農業", "設備", "スマート農業"],
  },
  {
    name: "観光地域づくり補助金",
    ministry: "観光庁",
    category: "観光",
    description: "観光地域の魅力向上と誘客促進のための取り組みを支援します。",
    maxAmount: 800,
    adoptionRate: 42,
    deadline: "2024/10/31",
    tags: ["観光", "地域", "インバウンド"],
  },
];

async function main() {
  console.log("🌱 シードデータを挿入中...");

  // 既存データをスキップ（upsert）
  for (const data of grantData) {
    await prisma.grant.upsert({
      where: { name: data.name } as never,
      update: data,
      create: data,
    });
    console.log(`  ✓ ${data.name}`);
  }

  console.log(`\n✅ ${grantData.length}件の補助金データを挿入しました`);
}

main()
  .catch((e) => {
    console.error("❌ シード実行エラー:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
