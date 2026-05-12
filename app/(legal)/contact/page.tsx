import type { Metadata } from "next";
import { Mail, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "補助金ナビAIへのお問い合わせはこちら。ご質問・ご要望・返金依頼等にお答えします。",
};

const TOPICS = [
  "プラン・料金について",
  "支払い・請求について",
  "返金・解約について",
  "機能・操作方法について",
  "AIマッチング結果について",
  "アカウントについて",
  "個人情報・プライバシーについて",
  "バグ・不具合の報告",
  "その他",
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">お問い合わせ</h1>
      <p className="text-gray-500 text-sm mb-10">
        ご質問・ご要望・不具合報告など、お気軽にご連絡ください。
      </p>

      {/* 対応時間・目安 */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 text-sm">対応時間</p>
            <p className="text-blue-700 text-sm mt-0.5">平日 10:00〜18:00<br />（土日祝・年末年始を除く）</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
          <MessageSquare className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900 text-sm">返信目安</p>
            <p className="text-green-700 text-sm mt-0.5">通常2営業日以内にご返信します</p>
          </div>
        </div>
      </div>

      {/* メール直接連絡 */}
      <div className="mb-10 p-5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-4">
        <Mail className="w-6 h-6 text-gray-500 flex-shrink-0" />
        <div>
          <p className="font-semibold text-gray-800 text-sm">メールでのお問い合わせ</p>
          <a
            href="mailto:support@hojokin-navi-ai.com"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            support@hojokin-navi-ai.com
          </a>
        </div>
      </div>

      {/* お問い合わせフォーム */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-900">お問い合わせフォーム</h2>
        </div>
        <form
          action="https://formspree.io/f/YOUR_FORM_ID"
          method="POST"
          className="p-6 space-y-5"
        >
          {/* お名前 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="山田 太郎"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="example@example.com"
            />
          </div>

          {/* お問い合わせ種別 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              お問い合わせ種別 <span className="text-red-500">*</span>
            </label>
            <select
              name="topic"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">選択してください</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="ご質問・ご要望を詳しくご記入ください"
            />
          </div>

          {/* 同意チェック */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="privacy"
              name="privacy"
              required
              className="mt-0.5 w-4 h-4 flex-shrink-0"
            />
            <label htmlFor="privacy" className="text-xs text-gray-600">
              <Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>に同意の上、送信します。
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm"
          >
            送信する
          </button>

          <p className="text-xs text-gray-400 text-center">
            ※送信後、確認メールをお送りします。届かない場合は迷惑メールフォルダをご確認ください。
          </p>
        </form>
      </div>

      {/* その他のリンク */}
      <div className="mt-10 grid sm:grid-cols-2 gap-4 text-sm">
        <Link href="/privacy" className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
          <p className="font-semibold text-gray-800">プライバシーポリシー</p>
          <p className="text-gray-400 text-xs mt-0.5">個人情報の取り扱いについて</p>
        </Link>
        <Link href="/terms" className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
          <p className="font-semibold text-gray-800">利用規約</p>
          <p className="text-gray-400 text-xs mt-0.5">サービス利用のルールについて</p>
        </Link>
        <Link href="/tokushoho" className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
          <p className="font-semibold text-gray-800">特定商取引法に基づく表記</p>
          <p className="text-gray-400 text-xs mt-0.5">事業者情報・返金ポリシー</p>
        </Link>
        <a href="mailto:support@hojokin-navi-ai.com" className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
          <p className="font-semibold text-gray-800">メールで直接連絡</p>
          <p className="text-gray-400 text-xs mt-0.5">support@hojokin-navi-ai.com</p>
        </a>
      </div>
    </div>
  );
}
