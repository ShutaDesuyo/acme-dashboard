'use client'; // 💡 エラー画面はクライアントコンポーネントにする必要があります

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // コンソールにエラーログを出力
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-center text-xl font-semibold">Something went wrong!</h2>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // 💡 「Try again」ボタンを押すと、ページをリロードせずに、そのコンポーネントだけもう一度再試行してくれます
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}