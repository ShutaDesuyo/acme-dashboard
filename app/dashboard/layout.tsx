import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* 左側の共通サイドナビゲーション */}
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      {/* 右側のコンテンツエリア（中身だけが入れ替わります） */}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}