import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login', // 💡 ログイン画面のURLを指定
  },
  callbacks: {
    // 💡 ページにアクセスしようとしたときに、閲覧を許可するか決めるルール
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // 💡 ログインしてないのにダッシュボードにいたらログイン画面へ弾く
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // ログイン方法（後ほど設定します）
} satisfies NextAuthConfig;