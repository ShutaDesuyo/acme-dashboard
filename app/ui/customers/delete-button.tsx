'use client';

import { useActionState } from 'react';
import { deleteCustomer, DeleteCustomerState } from '@/app/lib/actions';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function DeleteCustomerButton({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomer.bind(null, id);
  const [state, formAction, isPending] = useActionState<DeleteCustomerState, FormData>(
    deleteCustomerWithId,
    undefined,
  );

  return (
    <div>
      {state?.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <TrashIcon className="h-4 w-4" />
          {isPending ? '削除中...' : 'この顧客を削除する'}
        </button>
      </form>
    </div>
  );
}
