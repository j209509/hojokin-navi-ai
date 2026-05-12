import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "補助金ナビAIの特定商取引法に基づく表記です。",
};

export default function TokushohoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        特定商取引法に基づく表記
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        特定商取引に関する法律第11条に基づき、以下の事項を表示します。
      </p>

      {/* 要記入注意書き */}
      <div className="mb-10 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>事業者様へ：</strong>以下の【要記入】欄は、実際の情報に置き換えてください。
          Stripe審査・特商法コンプライアンスに必須の情報です。
        </p>
      </div>

      <table className="w-full text-sm border-collapse">
        <tbody className="divide-y divide-gray-200">
          {[
            ["販売業者", "補助金ナビAI"],
            ["運営責任者", "【代表者氏名を記入してください】"],
            ["所在地", "【〒XXX-XXXX 都道府県市区町村 番地 建物名】"],
            ["電話番号", "【電話番号を記入】（受付時間：平日10:00〜18:00）\n※お問い合わせはメールまたはお問い合わせフォームにて優先的に承ります"],
            ["メールアドレス", "support@hojokin-navi-ai.com"],
            ["サービスURL", "https://hojokin-navi-ai.vercel.app"],
            ["サービス内容", "AIを活用した補助金マッチング・申請サポートクラウドサービス「補助金ナビAI」の提供"],
            ["販売価格", [
              "・スタータープラン：¥0／月（無料）",
              "・スタンダードプラン：¥9,800／月（税込）",
              "・プレミアムプラン：¥29,800／月（税込）",
              "※各プランの詳細は料金ページをご確認ください",
            ].join("\n")],
            ["支払方法", "クレジットカード決済（Visa・Mastercard・American Express・JCB）\n決済処理はStripe, Inc.が行います"],
            ["支払時期", "有料プラン登録時に課金が発生し、以降は毎月同日に自動更新・自動請求されます"],
            ["サービス提供開始時期", "決済完了後、即時ご利用いただけます"],
            ["キャンセル・解約", "有料プランはいつでも解約できます。解約はアカウント設定画面より手続き可能です。解約月末日までご利用いただけます。月途中の解約による日割り返金は原則として行いません"],
            ["返金ポリシー", "当社の責めに帰すべき重大な瑕疵または長時間のサービス停止が発生した場合を除き、支払い済み料金の返金は行いません。返金のご要望はお問い合わせフォームよりご連絡ください"],
            ["動作環境", "Google Chrome・Mozilla Firefox・Apple Safari・Microsoft Edge 各最新版\nインターネット接続環境が必要です"],
            ["無料試用期間", "スタータープランは無料で継続的にご利用いただけます。有料プランの無料試用期間については、サービス内の告知をご確認ください"],
          ].map(([label, value]) => (
            <tr key={String(label)}>
              <th className="py-4 pr-6 text-left font-semibold text-gray-800 align-top w-40 sm:w-48 bg-gray-50 px-4">
                {label}
              </th>
              <td className="py-4 pl-4 text-gray-700 whitespace-pre-line align-top">
                {String(value).includes("【") ? (
                  <span className="text-amber-700 font-medium">{String(value)}</span>
                ) : (
                  String(value)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-12 p-5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-900">
        <p className="font-semibold mb-2">ご注意事項</p>
        <ul className="space-y-1.5 text-blue-800 list-disc list-inside">
          <li>本サービスは補助金の採択・受給を保証するものではありません。</li>
          <li>AIが提供するマッチング結果・情報は参考情報です。必ず最新の公募要領・行政機関の公式発表をご確認ください。</li>
          <li>補助金申請は各公募要領の条件を満たした上で、ご自身の責任で行ってください。</li>
          <li>行政書士業務（申請書類の作成代行・代理申請）には対応しておりません。</li>
        </ul>
      </div>
    </div>
  );
}
