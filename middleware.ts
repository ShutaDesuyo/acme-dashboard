import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
// 💡 先ほど作った authConfig（閲覧制限ルール）をミドルウェアとして登録します
export default NextAuth(authConfig).auth;
 
export const config = {
  // 💡 どのページにアクセスしたときにこの閲覧制限（ログインチェック）を走らせるかの設定
  // ここでは、画像（.pngなど）やNext.jsの内部ファイル以外の「すべてのページ」でチェックを行います
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};