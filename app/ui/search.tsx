'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// 💡 use-debounce というライブラリを使って、タイピングが止まってから300ミリ秒後に検索を実行させます（サーバーの負荷軽減）
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // 💡 入力された文字をURLに反映する処理（デバウンス付き）
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // 検索したら1ページ目に戻す
    
    if (term) {
      params.set('query', term); // 文字があれば URLに ?query=〇〇 をつける
    } else {
      params.delete('query');    // 空っぽならクエリを消す
    }
    
    // URLを書き換える（ページはリロードされず、中身だけがサッと変わる）
    replace(`${pathname}?${params.toString()}`);
  }, 300); // 300ms 待つ

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}