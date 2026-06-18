import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        顧客管理（Customers）ページ
      </h1>
      <p className="text-gray-600">ここに顧客の一覧が表示されるようになります。</p>
    </main>
  );
}