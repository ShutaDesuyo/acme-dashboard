import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        請求書管理（Invoices）ページ
      </h1>
      <p className="text-gray-600">ここに請求書のデータ一覧が表示されるようになります。</p>
    </main>
  );
}