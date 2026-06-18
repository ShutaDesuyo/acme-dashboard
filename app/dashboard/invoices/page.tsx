// 💡 ファイルの一番上に追記してください
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices', // 💡 これにより、タブの表示が「Invoices | Acme Dashboard」になります！
};

import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';

// 💡 URLのクエリパラメータ（?query=xxx&page=1）を、引数 searchParams で直接受け取ります
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // 検索ワードに一致するデータが全部で何ページ分あるかを計算
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      
      {/* 💡 テーブルの読み込み中は専用の骨組み（Skeleton）を表示させ、
          検索ワード（query）や現在のページ（currentPage）が変わるたびにテーブルだけを自動で再読み込み（Suspense）します */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}