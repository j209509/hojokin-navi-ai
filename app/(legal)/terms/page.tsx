import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "補助金ナビAIの利用規約です。本サービスのご利用にあたってのルールを説明します。",
};

const LAST_UPDATED = "2026年5月12日";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">利用規約</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：{LAST_UPDATED}</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">

        <p>
          本利用規約（以下「本規約」）は、補助金ナビAI（以下「当社」）が提供するクラウドサービス
          「補助金ナビAI」（以下「本サービス」）の利用に関する条件を定めるものです。
          本サービスをご利用いただく前に、本規約を必ずお読みください。
          本サービスに登録・利用することで、本規約に同意したものとみなします。
        </p>

        <Section title="第1条（定義）">
          <Dl items={[
            ["利用者", "本規約に同意の上、本サービスに登録した個人または法人"],
            ["コンテンツ", "本サービスを通じて提供されるテキスト・データ・AIマッチング結果等の一切の情報"],
            ["登録情報", "利用者が本サービスの利用にあたり登録した事業情報・プロフィール等"],
          ]} />
        </Section>

        <Section title="第2条（アカウント登録）">
          <ul>
            <li>本サービスの利用にはGoogleアカウントによる認証が必要です。</li>
            <li>登録情報は正確・最新の情報を提供してください。</li>
            <li>アカウントは本人のみが利用できます。第三者への譲渡・貸与は禁止します。</li>
            <li>アカウントの認証情報の管理は利用者の責任で行ってください。</li>
            <li>不正アクセスを発見した場合は直ちに当社へご連絡ください。</li>
          </ul>
        </Section>

        <Section title="第3条（料金・支払）">
          <ul>
            <li>本サービスには無料プランと有料プランがあります。</li>
            <li>有料プランの料金は本サービス上に表示される料金表のとおりです。</li>
            <li>有料プランの料金は、登録したクレジットカードにより毎月自動請求されます。</li>
            <li>決済はStripe, Inc.が提供する決済システムを利用しています。</li>
            <li>消費税その他の税金は、表示価格に含まれます（内税）。</li>
          </ul>
        </Section>

        <Section title="第4条（キャンセル・返金）">
          <ul>
            <li>有料プランはいつでもキャンセルできます。キャンセルは次回更新日の前日までに手続きを完了してください。</li>
            <li>キャンセル後も、当月末日まで有料プランの機能をご利用いただけます。</li>
            <li>月途中のキャンセルによる日割り返金は原則として行いません。</li>
            <li>ただし、当社の責めに帰すべきサービス障害により利用不能となった場合は、その期間に応じた返金を検討します。</li>
            <li>返金のご請求はお問い合わせページよりご連絡ください。</li>
          </ul>
        </Section>

        <Section title="第5条（禁止事項）">
          <p>利用者は、以下の行為を行ってはなりません。</p>
          <ul>
            <li>法令または本規約に違反する行為</li>
            <li>当社または第三者の知的財産権・名誉・プライバシー等を侵害する行為</li>
            <li>本サービスの運営を妨害する行為（過度なアクセス・クローリング等）</li>
            <li>AIマッチング結果を無断で商業目的に転用・再販する行為</li>
            <li>補助金の不正申請を目的とした利用</li>
            <li>虚偽の情報を登録する行為</li>
            <li>その他、当社が不適切と判断する行為</li>
          </ul>
        </Section>

        <Section title="第6条（知的財産権）">
          <ul>
            <li>本サービスに関する一切の知的財産権は、当社または正当な権利者に帰属します。</li>
            <li>利用者は、本規約の範囲内でのみ本サービスを利用できます。</li>
            <li>利用者が入力した事業情報等の登録情報の権利は利用者に帰属します。</li>
            <li>利用者は、サービス改善・品質向上を目的として、当社が登録情報を匿名化して利用することに同意するものとします。</li>
          </ul>
        </Section>

        <Section title="第7条（免責事項）">
          <ul>
            <li>本サービスは、補助金の採択・受給・採択率を保証するものではありません。</li>
            <li>AIマッチング結果は参考情報であり、必ず公募要領・行政窓口にてご確認ください。</li>
            <li>当社は、本サービスを通じて得た情報に基づく利用者の意思決定・行動の結果について、法令上の責任を負う場合を除き一切の責任を負いません。</li>
            <li>当社の責任は、利用者が直近3ヶ月間に支払った利用料金の総額を上限とします。</li>
          </ul>
        </Section>

        <Section title="第8条（サービスの変更・停止）">
          <ul>
            <li>当社は、事前の通知なく本サービスの内容を変更・追加・削除することがあります。</li>
            <li>メンテナンス・障害・不可抗力等により、本サービスを一時停止することがあります。</li>
            <li>本サービスを終了する場合、30日以上前に本サービス上でお知らせします。</li>
          </ul>
        </Section>

        <Section title="第9条（アカウントの停止・解約）">
          <ul>
            <li>利用者は、いつでもアカウントを削除することができます。</li>
            <li>当社は、利用者が本規約に違反した場合、事前の通知なくアカウントを停止・削除することがあります。</li>
            <li>アカウント削除後、登録情報は当社のポリシーに従い削除されます。</li>
          </ul>
        </Section>

        <Section title="第10条（準拠法・管轄）">
          <ul>
            <li>本規約は日本法に準拠します。</li>
            <li>本サービスに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
          </ul>
        </Section>

        <Section title="第11条（お問い合わせ）">
          <p>
            本規約に関するご質問は、<a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>よりお問い合わせください。
          </p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h2>
      <div className="space-y-3 text-sm">{children}</div>
    </section>
  );
}

function Dl({ items }: { items: [string, string][] }) {
  return (
    <dl className="space-y-2">
      {items.map(([term, desc]) => (
        <div key={term} className="flex gap-2">
          <dt className="font-semibold text-gray-800 flex-shrink-0 w-24">{term}</dt>
          <dd className="text-gray-600">{desc}</dd>
        </div>
      ))}
    </dl>
  );
}
