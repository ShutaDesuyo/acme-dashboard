import DashboardSkeleton from '@/app/ui/skeletons';

// 💡 Next.jsは、この「loading.tsx」というファイルを作るだけで、
// ページがデータを読み込んでいる間、自動的にこのスケルトン画面を身代わりとして表示してくれます。
export default function Loading() {
  return <DashboardSkeleton />;
}