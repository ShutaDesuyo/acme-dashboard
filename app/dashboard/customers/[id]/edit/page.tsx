import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import EditCustomerForm from '@/app/ui/customers/edit-form';
import { fetchCustomerById } from '@/app/lib/data';

export const metadata: Metadata = { title: '顧客編集' };

export default async function Page({ params }: { params: { id: string } }) {
  const customer = await fetchCustomerById(params.id);
  if (!customer) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          { label: customer.name, href: `/dashboard/customers/${params.id}` },
          { label: '編集', href: `/dashboard/customers/${params.id}/edit`, active: true },
        ]}
      />
      <EditCustomerForm customer={customer} />
    </main>
  );
}
