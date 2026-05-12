import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "補助金ナビAIのプライバシーポリシーです。お客様の個人情報の取り扱いについて説明します。",
};

const LAST_UPDATED = "2026年5月12日";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：{LAST_UPDATED}</p>

      <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

        <section>
          <p>
            補助金ナビAI（以下「当社」）は、本ウェブサービス「補助金ナビAI」（以下「本サービス」）において、
            お客様の個人情報の保護を最重要事項と位置づけ、以下のプライバシーポリシー（以下「本ポリシー」）に従い、
            適切に個人情報を取り扱います。
          </p>
        </section>

        <Section title="1. 取得する情報">
          <p>当社は、本サービスの提供にあたり、以下の情報を取得する場合があります。</p>
          <ul>
            <li><strong>アカウント情報：</strong>Googleアカウント経由のOAuth認証により取得するメールアドレス・氏名・プロフィール画像URL</li>
            <li><strong>事業情報：</strong>AIマッチング機能利用時に入力される事業内容・業種・従業員数・所在都道府県</li>
            <li><strong>利用履歴：</strong>補助金検索・マッチング履歴・ブックマーク・申請ステータス登録内容</li>
            <li><strong>アクセス情報：</strong>IPアドレス・ブラウザ種別・OS・参照URL・アクセス日時（アクセスログ）</li>
            <li><strong>決済情報：</strong>有料プラン契約時のクレジットカード情報（Stripe社が処理・保管し、当社はカード番号を保持しません）</li>
          </ul>
        </Section>

        <Section title="2. 利用目的">
          <ul>
            <li>本サービスの提供・運営・改善</li>
            <li>AIによる補助金マッチング機能の精度向上</li>
            <li>お客様へのサポート・お問い合わせ対応</li>
            <li>利用料金の請求・決済処理</li>
            <li>本サービスに関する重要なお知らせの送信</li>
            <li>規約違反・不正利用の検知・防止</li>
            <li>統計データの作成（個人を特定できない形式）</li>
          </ul>
        </Section>

        <Section title="3. 第三者提供">
          <p>
            当社は、以下のいずれかに該当する場合を除き、お客様の個人情報を第三者に提供しません。
          </p>
          <ul>
            <li>お客様の事前の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命・身体・財産の保護のために必要があり、本人の同意を得ることが困難な場合</li>
            <li>国・地方公共団体等が公共の利益のために必要とする場合</li>
          </ul>
        </Section>

        <Section title="4. 業務委託先（サブプロセッサー）">
          <p>当社は、本サービスの提供にあたり、以下の外部サービスを利用しており、これらのサービスにデータが送信される場合があります。各サービスのプライバシーポリシーをご確認ください。</p>
          <ul>
            <li><strong>Google LLC</strong>（認証）</li>
            <li><strong>Anthropic, PBC</strong>（AIマッチング処理）</li>
            <li><strong>Stripe, Inc.</strong>（決済処理）</li>
            <li><strong>Supabase, Inc.</strong>（データベース・ホスティング）</li>
            <li><strong>Vercel, Inc.</strong>（ウェブホスティング）</li>
          </ul>
        </Section>

        <Section title="5. Cookieおよびトラッキング">
          <p>
            本サービスは、認証セッションの維持のためにCookieを使用します。
            ブラウザの設定によりCookieを無効化することができますが、
            その場合、本サービスの一部機能が利用できなくなる場合があります。
          </p>
        </Section>

        <Section title="6. 個人情報の保管・セキュリティ">
          <p>
            当社は、個人情報への不正アクセス・紛失・破損・改ざん・漏洩を防止するため、
            SSL/TLS暗号化通信・データベースの暗号化・アクセス制御等の適切なセキュリティ対策を実施しています。
          </p>
        </Section>

        <Section title="7. 保存期間">
          <p>
            当社は、利用目的の達成に必要な期間、個人情報を保管します。
            アカウント削除後は、法令上の保管義務がある場合を除き、速やかに個人情報を削除します。
          </p>
        </Section>

        <Section title="8. お客様の権利">
          <p>お客様は、当社が保有する自己の個人情報について、以下の権利を有します。</p>
          <ul>
            <li>開示・訂正・追加・削除の請求</li>
            <li>利用停止・消去の請求</li>
            <li>第三者提供の停止の請求</li>
          </ul>
          <p>ご請求は下記お問い合わせ窓口までご連絡ください。本人確認のうえ、合理的な期間内に対応いたします。</p>
        </Section>

        <Section title="9. 未成年者の利用">
          <p>
            本サービスは、18歳以上の方を対象としています。
            18歳未満の方は、保護者の同意を得た上でご利用ください。
          </p>
        </Section>

        <Section title="10. 本ポリシーの変更">
          <p>
            当社は、法令の変更・サービスの変更等に伴い、本ポリシーを変更することがあります。
            重要な変更が生じた場合は、本サービス上でお知らせします。
            変更後も本サービスをご利用いただいた場合、変更後のポリシーに同意したものとみなします。
          </p>
        </Section>

        <Section title="11. お問い合わせ">
          <p>
            個人情報の取り扱いに関するご質問・ご相談は、下記お問い合わせ窓口にご連絡ください。
          </p>
          <p>
            <a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>より送信してください。<br />
            メールアドレス：<a href="mailto:support@hojokin-navi-ai.com" className="text-blue-600 hover:underline">support@hojokin-navi-ai.com</a>
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
