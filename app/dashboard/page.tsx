import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data'; // fetchRevenue と fetchLatestInvoices はここでは呼ばない
import { Suspense } from 'react'; // 💡 部分ローディングのための機能をインポート
import { RevenueChartSkeleton, LatestInvoicesSkeleton } from '@/app/ui/skeletons'; // 💡 ローディング中に見せる枠（骨組み）

export default async function Page() {
  // カードのデータだけを先に取得（グラフと請求書は各コンポーネントの中で直接取得するようにチュートリアル後半で変化します）
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      
      {/* 上部のカードエリア（一瞬で表示される） */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>

      {/* 下部のコンテンツエリア */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        
        {/* 💡 グラフ部分：読み込み中は「RevenueChartSkeleton」を表示しておく */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        {/* 💡 最新の請求書部分：読み込み中は「LatestInvoicesSkeleton」を表示しておく */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>

      </div>
    </main>
  );
}