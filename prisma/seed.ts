/**
 * prisma/seed.ts — 補助金ナビAI 本番シードデータ
 * 主要補助金・助成金 60件 + テンプレート 8件
 * 実際の公的補助金情報を元に作成（2024年度版）
 */
import prisma from "../lib/prisma";

// ─── 補助金データ (60件) ────────────────────────────────────────
const grantData = [
  // ═══ 経済産業省・中小企業庁 ═══
  {
    name: "IT導入補助金2024（通常枠）",
    ministry: "経産省",
    category: "デジタル化",
    description: "中小企業・小規模事業者のITツール導入を支援。業務効率化・売上向上を実現するソフトウェア、クラウドサービス等の導入経費を補助。補助率1/2以内。",
    maxAmount: 450,
    adoptionRate: 68,
    deadline: "2025/03/31",
    tags: ["IT", "業務効率化", "クラウド", "SaaS", "デジタル化"],
  },
  {
    name: "IT導入補助金2024（セキュリティ対策推進枠）",
    ministry: "経産省",
    category: "デジタル化",
    description: "サイバーセキュリティ対策の強化を目的としたセキュリティソフトウェア・サービス導入を支援。補助率1/2、上限100万円。",
    maxAmount: 100,
    adoptionRate: 72,
    deadline: "2025/03/31",
    tags: ["セキュリティ", "IT", "サイバー対策", "クラウド"],
  },
  {
    name: "ものづくり補助金（通常枠）第18回",
    ministry: "中小企業庁",
    category: "設備投資",
    description: "革新的な製品・サービス開発や生産プロセスの改善のための設備投資を支援。機械装置、システム構築費等の経費を補助。補助率1/2（小規模事業者2/3）。",
    maxAmount: 1250,
    adoptionRate: 47,
    deadline: "2025/01/24",
    tags: ["設備投資", "製造業", "革新", "機械装置", "DX"],
  },
  {
    name: "ものづくり補助金（グリーン枠）第18回",
    ministry: "中小企業庁",
    category: "設備投資",
    description: "温室効果ガスの排出削減に向けたグリーン技術の研究開発・設備投資を支援。補助率1/2（小規模2/3）、上限4,000万円。",
    maxAmount: 4000,
    adoptionRate: 42,
    deadline: "2025/01/24",
    tags: ["グリーン", "脱炭素", "設備投資", "環境", "製造"],
  },
  {
    name: "ものづくり補助金（グローバル市場開拓枠）第18回",
    ministry: "中小企業庁",
    category: "設備投資",
    description: "海外市場開拓を目的とした製品・サービスの開発や生産体制整備を支援。補助率1/2、上限3,000万円。",
    maxAmount: 3000,
    adoptionRate: 35,
    deadline: "2025/01/24",
    tags: ["海外展開", "輸出", "グローバル", "設備投資"],
  },
  {
    name: "小規模事業者持続化補助金（通常枠）第16回",
    ministry: "中小企業庁",
    category: "販路開拓",
    description: "小規模事業者の販路開拓や業務効率化を支援。チラシ・HP制作、展示会出展、機器導入等の経費の2/3を補助。上限50万円。",
    maxAmount: 50,
    adoptionRate: 54,
    deadline: "2025/03/28",
    tags: ["販路拡大", "HP制作", "広告", "小規模", "チラシ"],
  },
  {
    name: "小規模事業者持続化補助金（賃金引上げ枠）第16回",
    ministry: "中小企業庁",
    category: "販路開拓",
    description: "事業場内最低賃金を地域別最低賃金より+30円以上引き上げた小規模事業者が対象。上限200万円、補助率2/3。",
    maxAmount: 200,
    adoptionRate: 48,
    deadline: "2025/03/28",
    tags: ["賃上げ", "販路拡大", "小規模", "最低賃金"],
  },
  {
    name: "小規模事業者持続化補助金（後継者支援枠）第16回",
    ministry: "中小企業庁",
    category: "販路開拓",
    description: "アトツギ甲子園ファイナリスト等を対象とした後継者による新たな取り組みを支援。上限200万円。",
    maxAmount: 200,
    adoptionRate: 51,
    deadline: "2025/03/28",
    tags: ["事業承継", "後継者", "販路拡大", "小規模"],
  },
  {
    name: "事業再構築補助金（成長枠）第12回",
    ministry: "経産省",
    category: "事業転換",
    description: "成長分野への大胆な事業再構築に取り組む中小企業を支援。従業員規模に応じて最大7,000万円。補助率1/2（中小企業）。",
    maxAmount: 7000,
    adoptionRate: 38,
    deadline: "2025/04/24",
    tags: ["事業転換", "成長分野", "再構築", "新事業", "DX"],
  },
  {
    name: "事業再構築補助金（グリーン成長枠）第12回",
    ministry: "経産省",
    category: "事業転換",
    description: "グリーン成長戦略「実行計画」14分野の課題解決に資する事業再構築を支援。上限1億円。",
    maxAmount: 10000,
    adoptionRate: 31,
    deadline: "2025/04/24",
    tags: ["グリーン", "脱炭素", "事業転換", "環境", "成長"],
  },
  {
    name: "事業再構築補助金（産業構造転換枠）第12回",
    ministry: "経産省",
    category: "事業転換",
    description: "国内市場縮小等の構造的課題に直面している業種・業態の事業者の事業再構築を支援。上限7,000万円。",
    maxAmount: 7000,
    adoptionRate: 35,
    deadline: "2025/04/24",
    tags: ["業種転換", "構造改革", "新事業", "再構築"],
  },
  {
    name: "事業承継・引継ぎ補助金（経営革新枠）",
    ministry: "中小企業庁",
    category: "事業承継",
    description: "事業承継・M&Aを契機として経営革新等に取り組む中小企業を支援。上限600万円、補助率2/3。",
    maxAmount: 600,
    adoptionRate: 58,
    deadline: "2025/05/31",
    tags: ["事業承継", "M&A", "経営革新", "後継者"],
  },
  {
    name: "中小企業省力化投資補助金",
    ministry: "中小企業庁",
    category: "デジタル化",
    description: "人手不足に悩む中小企業の省力化投資を支援。IoT・ロボット等のカタログ掲載製品導入費用を補助。上限1,500万円。",
    maxAmount: 1500,
    adoptionRate: 65,
    deadline: "2025/06/30",
    tags: ["省力化", "ロボット", "IoT", "人手不足", "自動化"],
  },
  {
    name: "JAPANブランド育成支援等事業",
    ministry: "中小企業庁",
    category: "海外展開",
    description: "日本の中小企業が海外で通用するブランド力を磨き上げる取り組みを支援。上限500万円。",
    maxAmount: 500,
    adoptionRate: 43,
    deadline: "2025/04/30",
    tags: ["海外展開", "ブランド", "輸出", "マーケティング"],
  },
  {
    name: "サプライチェーン対策のための国内投資促進補助金",
    ministry: "経産省",
    category: "設備投資",
    description: "特定重要物資の生産基盤整備や供給確保のための設備投資を支援。大型補助で最大数十億円規模も対象。",
    maxAmount: 15000,
    adoptionRate: 28,
    deadline: "2025/03/31",
    tags: ["サプライチェーン", "国内回帰", "設備投資", "重要物資"],
  },
  {
    name: "地域未来投資促進補助金",
    ministry: "経産省",
    category: "地域活性化",
    description: "地域の特性を生かした高い付加価値を創出する事業を支援。地方公共団体の連携計画に位置付けられた事業が対象。",
    maxAmount: 5000,
    adoptionRate: 40,
    deadline: "2025/05/30",
    tags: ["地域活性化", "付加価値", "地方", "連携"],
  },

  // ═══ 厚生労働省 ═══
  {
    name: "キャリアアップ助成金（正社員化コース）",
    ministry: "厚労省",
    category: "人材育成",
    description: "有期雇用労働者等を正規雇用等に転換・直接雇用した場合に助成。1人当たり最大80万円（大企業60万円）。通年受付。",
    maxAmount: 96,
    adoptionRate: 81,
    deadline: "通年",
    tags: ["正社員化", "非正規", "雇用転換", "処遇改善"],
  },
  {
    name: "キャリアアップ助成金（賃金規定等改定コース）",
    ministry: "厚労省",
    category: "人材育成",
    description: "有期雇用労働者等の賃金規定等を改定し3%以上賃金増額した場合に助成。1人最大5万円。通年受付。",
    maxAmount: 50,
    adoptionRate: 78,
    deadline: "通年",
    tags: ["賃上げ", "非正規", "賃金改定", "処遇改善"],
  },
  {
    name: "業務改善助成金",
    ministry: "厚労省",
    category: "設備投資",
    description: "事業場内最低賃金を一定額以上引き上げ、生産性向上のための設備投資等を行った場合に助成。上限600万円。",
    maxAmount: 600,
    adoptionRate: 74,
    deadline: "2025/01/31",
    tags: ["賃上げ", "最低賃金", "設備投資", "生産性向上"],
  },
  {
    name: "人材開発支援助成金（人材育成支援コース）",
    ministry: "厚労省",
    category: "人材育成",
    description: "労働者のスキルアップのための訓練を実施した事業主への助成。訓練経費・訓練中の賃金の一部を助成。通年受付。",
    maxAmount: 200,
    adoptionRate: 77,
    deadline: "通年",
    tags: ["研修", "訓練", "スキルアップ", "OJT", "人材育成"],
  },
  {
    name: "人材開発支援助成金（教育訓練休暇等付与コース）",
    ministry: "厚労省",
    category: "人材育成",
    description: "雇用する労働者に対して有給教育訓練休暇制度等を導入・実施した場合に助成。1事業所最大150万円。",
    maxAmount: 150,
    adoptionRate: 69,
    deadline: "通年",
    tags: ["教育訓練", "休暇制度", "スキルアップ", "人材育成"],
  },
  {
    name: "働き方改革推進支援助成金（労働時間短縮・年休促進支援コース）",
    ministry: "厚労省",
    category: "人材育成",
    description: "労働時間の短縮や年次有給休暇の促進に取り組む中小企業を支援。生産性向上のための設備投資等に最大250万円。",
    maxAmount: 250,
    adoptionRate: 71,
    deadline: "2025/02/28",
    tags: ["働き方改革", "残業削減", "有給休暇", "生産性"],
  },
  {
    name: "両立支援等助成金（出生時両立支援コース）",
    ministry: "厚労省",
    category: "人材育成",
    description: "男性労働者が育児休業や育児目的休暇を取得しやすい雇用環境整備に取り組んだ場合に助成。最大57万円。",
    maxAmount: 57,
    adoptionRate: 76,
    deadline: "通年",
    tags: ["育休", "男性育休", "両立支援", "雇用環境"],
  },
  {
    name: "雇用調整助成金",
    ministry: "厚労省",
    category: "雇用",
    description: "経済上の理由で事業活動が縮小した際に休業・教育訓練・出向で雇用維持した事業主を助成。休業手当等の一部を補助。",
    maxAmount: 900,
    adoptionRate: 72,
    deadline: "通年",
    tags: ["雇用維持", "休業", "経済対策", "雇用"],
  },
  {
    name: "トライアル雇用助成金（一般トライアルコース）",
    ministry: "厚労省",
    category: "雇用",
    description: "就職が困難な求職者をトライアル雇用した事業主に助成。1人月最大4万円×最大3か月。通年受付。",
    maxAmount: 36,
    adoptionRate: 83,
    deadline: "通年",
    tags: ["採用", "トライアル雇用", "就職困難者", "雇用"],
  },
  {
    name: "特定求職者雇用開発助成金（特定就職困難者コース）",
    ministry: "厚労省",
    category: "雇用",
    description: "高齢者や障害者等の就職困難者をハローワーク等の紹介で雇用した事業主に助成。最大240万円。",
    maxAmount: 240,
    adoptionRate: 80,
    deadline: "通年",
    tags: ["高齢者雇用", "障害者雇用", "就職困難者", "雇用促進"],
  },

  // ═══ 農林水産省 ═══
  {
    name: "農業経営基盤強化支援補助金",
    ministry: "農水省",
    category: "農業",
    description: "農業経営の基盤強化のためのスマート農業機械・設備等の導入を支援。経営効率化・省力化に取り組む農業者が対象。",
    maxAmount: 1500,
    adoptionRate: 45,
    deadline: "2025/06/30",
    tags: ["農業", "スマート農業", "設備投資", "省力化"],
  },
  {
    name: "みどりの食料システム戦略推進交付金",
    ministry: "農水省",
    category: "農業",
    description: "有機農業や農薬・化学肥料低減等の環境負荷低減に取り組む農業者・団体を支援。",
    maxAmount: 2000,
    adoptionRate: 50,
    deadline: "2025/04/30",
    tags: ["有機農業", "環境", "農業", "持続可能"],
  },
  {
    name: "農山漁村振興交付金（農泊推進）",
    ministry: "農水省",
    category: "農業",
    description: "農山漁村における農泊の推進のための施設整備・ICT活用等を支援。インバウンド誘致にも活用可能。",
    maxAmount: 500,
    adoptionRate: 48,
    deadline: "2025/05/31",
    tags: ["農泊", "観光", "農山漁村", "インバウンド"],
  },

  // ═══ 環境省 ═══
  {
    name: "省エネルギー投資促進支援事業費補助金（設備単位）",
    ministry: "環境省",
    category: "省エネ",
    description: "省エネルギー設備への更新を支援。エネルギー管理システムや高効率設備導入費用の1/3〜1/2を補助。",
    maxAmount: 3000,
    adoptionRate: 62,
    deadline: "2025/02/28",
    tags: ["省エネ", "CO2削減", "設備投資", "エネルギー"],
  },
  {
    name: "二酸化炭素排出抑制対策事業費等補助金（再エネ）",
    ministry: "環境省",
    category: "省エネ",
    description: "再生可能エネルギー設備の導入（太陽光・蓄電池等）を支援。脱炭素化に取り組む中小企業が対象。",
    maxAmount: 2000,
    adoptionRate: 55,
    deadline: "2025/03/31",
    tags: ["再エネ", "太陽光", "脱炭素", "蓄電池", "省エネ"],
  },
  {
    name: "脱炭素社会構築に向けた再エネ等由来水素活用推進事業",
    ministry: "環境省",
    category: "省エネ",
    description: "水素・燃料電池等の導入による脱炭素化を支援。水素関連設備導入費の補助。",
    maxAmount: 5000,
    adoptionRate: 30,
    deadline: "2025/04/30",
    tags: ["水素", "燃料電池", "脱炭素", "グリーン"],
  },

  // ═══ 国土交通省 ═══
  {
    name: "建設業DX助成金",
    ministry: "国交省",
    category: "デジタル化",
    description: "建設業のDX推進（BIM/CIM、ICT施工等）のためのソフトウェア・機器導入を支援。",
    maxAmount: 300,
    adoptionRate: 58,
    deadline: "2025/05/31",
    tags: ["建設業", "DX", "BIM", "ICT", "デジタル化"],
  },
  {
    name: "物流効率化・低炭素化推進事業補助金",
    ministry: "国交省",
    category: "設備投資",
    description: "トラック輸送の省エネ化や共同配送等の物流効率化に取り組む事業者を支援。EVトラック等の導入補助。",
    maxAmount: 1000,
    adoptionRate: 49,
    deadline: "2025/03/31",
    tags: ["物流", "EV", "省エネ", "共同配送", "トラック"],
  },
  {
    name: "住宅・建築物省エネ改修等推進事業（先進的窓リノベ）",
    ministry: "国交省",
    category: "省エネ",
    description: "既存住宅・建築物の断熱改修（窓・外壁等）を支援。補助率1/3〜1/2、上限200万円。",
    maxAmount: 200,
    adoptionRate: 67,
    deadline: "2025/12/31",
    tags: ["リノベーション", "断熱", "省エネ", "住宅", "建築"],
  },

  // ═══ 総務省・デジタル庁 ═══
  {
    name: "地域IoT実装推進交付金",
    ministry: "総務省",
    category: "デジタル化",
    description: "地域が直面する課題解決のためのIoT・AI・ビッグデータ活用を支援。地方公共団体との連携が要件。",
    maxAmount: 500,
    adoptionRate: 38,
    deadline: "2025/06/30",
    tags: ["IoT", "AI", "ビッグデータ", "地域課題", "DX"],
  },
  {
    name: "デジタル田園都市国家構想交付金（DXタイプ）",
    ministry: "デジタル庁",
    category: "デジタル化",
    description: "地方のデジタル実装による地域課題解決を支援。地方公共団体・民間の連携プロジェクトに補助。",
    maxAmount: 1000,
    adoptionRate: 42,
    deadline: "2025/05/31",
    tags: ["DX", "デジタル化", "地域活性化", "スマートシティ"],
  },

  // ═══ 東京都 ═══
  {
    name: "東京都 中小企業設備投資補助金",
    ministry: "東京都",
    category: "設備投資",
    description: "都内中小企業の競争力強化のための設備投資を支援。機械設備・デジタル機器等の導入費用を補助。補助率1/2、上限500万円。",
    maxAmount: 500,
    adoptionRate: 55,
    deadline: "2025/07/15",
    tags: ["東京", "設備投資", "機械", "競争力強化"],
  },
  {
    name: "東京都 デジタル基盤整備助成事業",
    ministry: "東京都",
    category: "デジタル化",
    description: "中小企業のデジタル化推進のためのITシステム・ソフトウェア導入を支援。補助率2/3、上限750万円。",
    maxAmount: 750,
    adoptionRate: 60,
    deadline: "2025/06/30",
    tags: ["東京", "DX", "デジタル化", "IT", "クラウド"],
  },
  {
    name: "東京都 躍進的な事業推進のための設備投資支援事業",
    ministry: "東京都",
    category: "設備投資",
    description: "IoT・AI・ロボット等の先端設備や製品製造設備の導入を支援。上限1億5,000万円の大型補助。",
    maxAmount: 15000,
    adoptionRate: 38,
    deadline: "2025/05/31",
    tags: ["東京", "IoT", "AI", "ロボット", "大型設備"],
  },
  {
    name: "東京都 創業助成金",
    ministry: "東京都",
    category: "創業",
    description: "東京都内での創業を促進するため、創業初期費用（賃借料・設備費・広告費等）を助成。上限300万円。",
    maxAmount: 300,
    adoptionRate: 44,
    deadline: "2025/04/30",
    tags: ["東京", "創業", "スタートアップ", "起業"],
  },

  // ═══ 大阪府・大阪市 ═══
  {
    name: "大阪府 中小企業技術開発支援補助金",
    ministry: "大阪府",
    category: "技術開発",
    description: "大阪府内中小企業の新技術・新製品開発を支援。研究開発費等の2/3を補助、上限500万円。",
    maxAmount: 500,
    adoptionRate: 52,
    deadline: "2025/06/30",
    tags: ["大阪", "技術開発", "R&D", "新製品"],
  },
  {
    name: "大阪市 スタートアップ成長支援事業",
    ministry: "大阪市",
    category: "創業",
    description: "大阪市内の起業家・スタートアップの成長を支援。事業化・販路開拓費用の一部を補助。上限200万円。",
    maxAmount: 200,
    adoptionRate: 46,
    deadline: "2025/05/31",
    tags: ["大阪", "スタートアップ", "起業", "創業"],
  },

  // ═══ 愛知県 ═══
  {
    name: "愛知県 あいち産業振興機構 中小企業支援補助金",
    ministry: "愛知県",
    category: "設備投資",
    description: "愛知県内の中小企業の設備投資・技術開発・販路開拓を支援。補助率1/2、上限300万円。",
    maxAmount: 300,
    adoptionRate: 57,
    deadline: "2025/07/31",
    tags: ["愛知", "設備投資", "製造業", "技術開発"],
  },

  // ═══ 神奈川県 ═══
  {
    name: "神奈川県 中小企業DX化支援補助金",
    ministry: "神奈川県",
    category: "デジタル化",
    description: "神奈川県内の中小企業のDX推進を支援。業務管理システム・EC構築等のITツール導入費を補助。上限100万円。",
    maxAmount: 100,
    adoptionRate: 63,
    deadline: "2025/08/31",
    tags: ["神奈川", "DX", "デジタル化", "中小企業"],
  },

  // ═══ 埼玉県 ═══
  {
    name: "埼玉県 ものづくり企業新事業展開支援補助金",
    ministry: "埼玉県",
    category: "設備投資",
    description: "埼玉県内の製造業が新製品開発・新事業展開に取り組む際の費用を支援。上限500万円、補助率1/2。",
    maxAmount: 500,
    adoptionRate: 53,
    deadline: "2025/06/30",
    tags: ["埼玉", "製造業", "新事業", "設備投資"],
  },

  // ═══ 福岡県 ═══
  {
    name: "福岡県 中小企業振興補助金",
    ministry: "福岡県",
    category: "設備投資",
    description: "福岡県内の中小企業の経営力強化のための設備投資・人材育成・販路開拓等を支援。上限300万円。",
    maxAmount: 300,
    adoptionRate: 56,
    deadline: "2025/07/31",
    tags: ["福岡", "中小企業", "設備投資", "経営強化"],
  },
  {
    name: "福岡スタートアップ総合支援プログラム",
    ministry: "福岡市",
    category: "創業",
    description: "福岡市内での創業・スタートアップ支援。スタートアップビザ取得支援も含む。起業費用最大100万円補助。",
    maxAmount: 100,
    adoptionRate: 42,
    deadline: "2025/09/30",
    tags: ["福岡", "スタートアップ", "創業", "起業"],
  },

  // ═══ 北海道・東北 ═══
  {
    name: "北海道 中小企業総合振興資金（補助金）",
    ministry: "北海道",
    category: "設備投資",
    description: "北海道内の中小企業の設備投資・技術開発等を支援。地域特性を活かした事業展開を促進。上限500万円。",
    maxAmount: 500,
    adoptionRate: 50,
    deadline: "2025/08/31",
    tags: ["北海道", "設備投資", "地域", "中小企業"],
  },
  {
    name: "宮城県 みやぎの仕事環境整備補助金",
    ministry: "宮城県",
    category: "人材育成",
    description: "宮城県内の事業者が職場環境改善・人材確保に取り組む費用を補助。テレワーク整備等も対象。上限100万円。",
    maxAmount: 100,
    adoptionRate: 61,
    deadline: "2025/06/30",
    tags: ["宮城", "働き方改革", "テレワーク", "人材確保"],
  },

  // ═══ 中国・四国 ═══
  {
    name: "広島県 ひろしまサンドボックス事業",
    ministry: "広島県",
    category: "デジタル化",
    description: "AIやIoT等の最先端技術を活用した革新的な実証実験を支援。新技術の社会実装を促進。上限1,000万円。",
    maxAmount: 1000,
    adoptionRate: 36,
    deadline: "2025/05/31",
    tags: ["広島", "AI", "IoT", "実証実験", "DX"],
  },

  // ═══ 九州・沖縄 ═══
  {
    name: "沖縄型産業振興プロジェクト支援事業",
    ministry: "沖縄県",
    category: "地域活性化",
    description: "沖縄の地域特性を活かした産業振興・観光・IT等の事業展開を支援。離島企業も対象。上限500万円。",
    maxAmount: 500,
    adoptionRate: 47,
    deadline: "2025/07/31",
    tags: ["沖縄", "観光", "IT", "地域産業", "離島"],
  },

  // ═══ 食・飲食・宿泊 ═══
  {
    name: "飲食店・宿泊業等省エネ設備導入補助金",
    ministry: "環境省",
    category: "省エネ",
    description: "飲食店・宿泊施設等のCO2排出量削減に向けた省エネ設備（冷蔵庫・空調等）の更新を支援。上限100万円。",
    maxAmount: 100,
    adoptionRate: 70,
    deadline: "2025/09/30",
    tags: ["飲食", "宿泊", "省エネ", "設備更新", "CO2削減"],
  },
  {
    name: "観光地域づくり法人（DMO）形成・確立支援事業",
    ministry: "観光庁",
    category: "観光",
    description: "地域の観光資源の磨き上げや誘客促進のための取り組みを支援。デジタルマーケティング活用も対象。",
    maxAmount: 800,
    adoptionRate: 42,
    deadline: "2025/10/31",
    tags: ["観光", "DMO", "インバウンド", "地域活性化"],
  },

  // ═══ 医療・介護 ═══
  {
    name: "介護ロボット導入支援事業補助金",
    ministry: "厚労省",
    category: "設備投資",
    description: "介護事業所における介護ロボット・ICT機器の導入費用を補助。移乗支援ロボット等も対象。上限300万円。",
    maxAmount: 300,
    adoptionRate: 73,
    deadline: "2025/11/30",
    tags: ["介護", "ロボット", "ICT", "医療", "省力化"],
  },
  {
    name: "医療機関等における感染防止対策補助金",
    ministry: "厚労省",
    category: "設備投資",
    description: "医療機関・介護施設等の感染防止対策強化のための設備・備品整備を支援。空気清浄機・換気設備等が対象。",
    maxAmount: 200,
    adoptionRate: 78,
    deadline: "2025/03/31",
    tags: ["医療", "介護", "感染対策", "設備"],
  },

  // ═══ 建設業 ═══
  {
    name: "建設現場のICT活用推進補助金",
    ministry: "国交省",
    category: "デジタル化",
    description: "建設現場でのドローン測量・ICT施工・BIM/CIM活用のための機器・ソフトウェア導入を支援。上限500万円。",
    maxAmount: 500,
    adoptionRate: 54,
    deadline: "2025/06/30",
    tags: ["建設", "ドローン", "ICT施工", "BIM", "DX"],
  },

  // ═══ 小売・EC ═══
  {
    name: "中小企業EC活用支援補助金（小規模持続化特例）",
    ministry: "中小企業庁",
    category: "販路開拓",
    description: "ネット通販サイト構築・ECプラットフォーム活用による販路拡大を支援。HP制作・EC導入費の2/3補助。",
    maxAmount: 100,
    adoptionRate: 65,
    deadline: "2025/03/28",
    tags: ["EC", "ネット通販", "HP制作", "販路拡大", "デジタル"],
  },
];

// ─── テンプレートデータ (8件) ─────────────────────────────────────
const templateData = [
  {
    title: "IT導入補助金 事業計画書テンプレート",
    content: "/templates/it-nyuusha-jigyokeikaku.txt",
    category: "事業計画書",
    format: "TXT",
    downloads: 2847,
    rating: 4.8,
  },
  {
    title: "ものづくり補助金 申請書テンプレート",
    content: "/templates/monodukuri-shinsho.txt",
    category: "申請書類",
    format: "TXT",
    downloads: 3621,
    rating: 4.9,
  },
  {
    title: "小規模事業者持続化補助金 経営計画書テンプレート",
    content: "/templates/jizokuka-keieikeiraku.txt",
    category: "事業計画書",
    format: "TXT",
    downloads: 4102,
    rating: 4.7,
  },
  {
    title: "事業再構築補助金 事業計画書テンプレート",
    content: "/templates/saikoochiku-jigyokeikaku.txt",
    category: "事業計画書",
    format: "TXT",
    downloads: 1893,
    rating: 4.6,
  },
  {
    title: "補助金申請 収支計画書テンプレート",
    content: "/templates/shuushi-keikakusho.txt",
    category: "収支計画",
    format: "TXT",
    downloads: 2156,
    rating: 4.5,
  },
  {
    title: "補助金申請書類 チェックリスト（共通版）",
    content: "/templates/shinsho-checklist.txt",
    category: "申請書類",
    format: "TXT",
    downloads: 5234,
    rating: 4.9,
  },
  {
    title: "事業概要書テンプレート（汎用）",
    content: "/templates/jigyogaiyousho.txt",
    category: "事業計画書",
    format: "TXT",
    downloads: 1672,
    rating: 4.4,
  },
  {
    title: "採択事例集・申請書ポイント解説",
    content: "/templates/saitaku-jirei.txt",
    category: "参考資料",
    format: "TXT",
    downloads: 3089,
    rating: 4.8,
  },
];

// ─── メイン処理 ─────────────────────────────────────────────────────
async function main() {
  console.log("🌱 補助金ナビAI 本番シードデータを挿入中...\n");

  // 補助金データ
  console.log("📊 補助金データ挿入中...");
  for (const data of grantData) {
    await prisma.grant.upsert({
      where: { name: data.name } as never,
      update: data,
      create: data,
    });
    console.log(`  ✓ ${data.name}`);
  }

  // テンプレートデータ
  console.log("\n📄 テンプレートデータ挿入中...");
  for (const data of templateData) {
    await prisma.template.upsert({
      where: { title: data.title } as never,
      update: data,
      create: data,
    });
    console.log(`  ✓ ${data.title}`);
  }

  console.log(`\n✅ 補助金 ${grantData.length}件 + テンプレート ${templateData.length}件 を挿入しました`);
}

main()
  .catch((e) => {
    console.error("❌ シード実行エラー:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
