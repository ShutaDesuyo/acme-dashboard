import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, EnvelopeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCustomerById } from '@/app/lib/data';
import DeleteCustomerButton from '@/app/ui/customers/delete-button';

export const metadata: Metadata = { title: '顧客詳細' };

export default async function Page({ params }: { params: { id: string } }) {
  const customer = await fetchCustomerById(params.id);
  if (!customer) notFound();

  return (
    <main className="w-full">
      <div className="mb-6">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          顧客一覧に戻る
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
          顧客詳細
        </h1>
        <Link
          href={`/dashboard/customers/${params.id}/edit`}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <PencilIcon className="h-4 w-4" />
          編集
        </Link>
      </div>

      {/* プロフィールカード */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <Image
            src={customer.image_url}
            alt={`${customer.name}のプロフィール画像`}
            width={72}
            height={72}
            className="rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {customer.name}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <EnvelopeIcon className="h-4 w-4" />
              {customer.email}
            </p>
          </div>
        </div>

        {/* 請求書サマリー */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500">請求書数</p>
            <p className={`${lusitana.className} mt-1 text-2xl font-bold text-gray-900`}>
              {customer.total_invoices}
            </p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4 text-center">
            <p className="text-xs text-gray-500">未払い合計</p>
            <p className={`${lusitana.className} mt-1 text-2xl font-bold text-yellow-700`}>
              {customer.total_pending}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-xs text-gray-500">支払済合計</p>
            <p className={`${lusitana.className} mt-1 text-2xl font-bold text-green-700`}>
              {customer.total_paid}
            </p>
          </div>
        </div>
      </div>

      {/* 削除エリア */}
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="mb-1 text-sm font-semibold text-red-800">
          危険な操作
        </h3>
        <p className="mb-4 text-sm text-red-600">
          顧客を削除すると元に戻せません。請求書が残っている場合は削除できません。
        </p>
        <DeleteCustomerButton id={customer.id} />
      </div>
    </main>
  );
}
