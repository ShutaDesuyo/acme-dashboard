'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/app/auth'; // 💡 サインイン関数をインポート
import { AuthError } from 'next-auth'; // エラー判定用

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// 🔑 ログイン処理を実行するアクション（追加）
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // credentials（メール・パスワード）方式でサインインを実行
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'; // パスワードかメールが違う場合
        default:
          return 'Something went wrong.'; // その他のエラー
      }
    }
    throw error;
  }
}

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const CustomerSchema = z.object({
  name: z.string().min(1, { message: '名前を入力してください。' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
  image_url: z
    .string()
    .url({ message: '有効なURLを入力してください。' })
    .or(z.literal(''))
    .optional(),
});

export type CustomerFormState = {
  errors?: { name?: string[]; email?: string[]; image_url?: string[] };
  message?: string | null;
};

export async function updateCustomer(
  id: string,
  _prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const validated = CustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: '入力内容を確認してください。',
    };
  }

  const { name, email, image_url } = validated.data;

  try {
    if (image_url) {
      await sql`UPDATE customers SET name=${name}, email=${email}, image_url=${image_url} WHERE id=${id}`;
    } else {
      await sql`UPDATE customers SET name=${name}, email=${email} WHERE id=${id}`;
    }
  } catch {
    return { message: 'データベースエラー：顧客の更新に失敗しました。' };
  }

  revalidatePath('/dashboard/customers');
  redirect(`/dashboard/customers/${id}`);
}

export type DeleteCustomerState = { error?: string } | undefined;

export async function deleteCustomer(
  id: string,
  _prevState: DeleteCustomerState,
  _formData: FormData,
): Promise<DeleteCustomerState> {
  const { count } = (
    await sql`SELECT COUNT(*) AS count FROM invoices WHERE customer_id = ${id}`
  ).rows[0];

  if (Number(count) > 0) {
    return {
      error: `この顧客には ${count} 件の請求書が紐づいています。先に請求書をすべて削除してください。`,
    };
  }

  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
  } catch (error) {
    return { error: 'データベースエラー：顧客の削除に失敗しました。' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}// 💡 ファイルの「一番下」に追記してください
import { signOut } from '@/app/auth';

export async function handleSignOut() {
  await signOut();
}