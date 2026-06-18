import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';
import Credentials from 'next-auth/providers/credentials'; // 💡 メール・パスワード認証用のプロバイダ
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt'; // 💡 パスワードの暗号化照合用ライブラリ

// 🔍 データベースからメールアドレスをキーにしてユーザー情報を引っ張ってくる関数
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // 1. 入力された値（メール、パスワード）の形が正しいかZodでチェック
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // 2. データベースからユーザーを取得
          const user = await getUser(email);
          if (!user) return null; // ユーザーがいなければ拒否

          // 3. 入力されたパスワードと、DB内の暗号化パスワードが一致するか比較
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user; // 💡 一致したらログイン成功！ユーザー情報を返す
        }

        console.log('Invalid credentials');
        return null; // 一致しなければログイン拒否
      },
    }),
  ],
});