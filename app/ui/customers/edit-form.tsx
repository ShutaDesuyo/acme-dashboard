'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { UserCircleIcon, EnvelopeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateCustomer, CustomerFormState } from '@/app/lib/actions';
import { FormattedCustomersTable } from '@/app/lib/definitions';

export default function EditCustomerForm({
  customer,
}: {
  customer: FormattedCustomersTable;
}) {
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState<CustomerFormState, FormData>(
    updateCustomerWithId,
    {},
  );

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* 名前 */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            名前
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={customer.name}
              placeholder="例：田中 太郎"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 aria-[invalid=true]:border-red-500"
              aria-invalid={!!state.errors?.name}
            />
            <UserCircleIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.name?.map((e) => (
            <p key={e} className="mt-1 text-xs text-red-500">{e}</p>
          ))}
        </div>

        {/* メールアドレス */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            メールアドレス
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={customer.email}
              placeholder="例：taro@example.com"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 aria-[invalid=true]:border-red-500"
              aria-invalid={!!state.errors?.email}
            />
            <EnvelopeIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.email?.map((e) => (
            <p key={e} className="mt-1 text-xs text-red-500">{e}</p>
          ))}
        </div>

        {/* プロフィール画像URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            プロフィール画像URL
            <span className="ml-1 text-xs font-normal text-gray-400">（任意）</span>
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={customer.image_url}
              placeholder="https://example.com/avatar.png"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 aria-[invalid=true]:border-red-500"
              aria-invalid={!!state.errors?.image_url}
            />
            <PhotoIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.image_url?.map((e) => (
            <p key={e} className="mt-1 text-xs text-red-500">{e}</p>
          ))}
        </div>

        {state.message && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/dashboard/customers/${customer.id}`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          キャンセル
        </Link>
        <Button type="submit">変更を保存</Button>
      </div>
    </form>
  );
}
