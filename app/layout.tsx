import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next'; // 💡 メタデータの型をインポート
 
// 💡 アプリ全体のメタデータ（タイトルと説明文）を定義
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard', // 各ページで設定した文字が「%s」に入ります
    default: 'Acme Dashboard',       // 特に入定がない場合のデフォルト名
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}