import { lusitana } from '@/app/ui/fonts';

// 「export default」が正確に記述されている必要があります
export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        ダッシュボード（メイン画面）
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">総収益</h3>
          <p className="text-2xl font-semibold text-gray-900">$0.00</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">保留中の請求書</h3>
          <p className="text-2xl font-semibold text-gray-900">$0.00</p>
        </div>
      </div>
    </main>
  );
}