'use client'

import { RootParams } from "@/app/page";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Random from "../randButton";

export default function Search({ params }: { params: RootParams }) {
  const [value, setValue] = useState(params.search ?? "");
  const [viewFilters, setViewFilters] = useState(false);
  const [loading, setLoading] = useTransition()
  const router = useRouter();

  const changeValue = (word: string) => setValue(word);

  const search = () => {
    setLoading(() => {
      const pageParams = new URLSearchParams({ search: value });
      if (params.page) pageParams.set('page', params.page);
      router.replace(`/?${pageParams.toString()}`, { scroll: false });
    })
  }

  return (
    <div className="bg-background-second text-text p-5 pl-10 m-10 mb-5 flex flex-col md:flex-row flex-wrap gap-5 text-xl transition">
      <div className='flex gap-5'>
        <input
          type='text'
          value={value}
          placeholder='Search'
          onInput={(e: any) => changeValue(e.target.value)}
          onKeyDown={e => { if (e.key == 'Enter') { search() } }}
          className='border border-foreground p-2 rounded-4xl min-w-1/3 outline-none pl-5'
        />
        <img src='/icons/search.svg' onClick={search} className='w-9 scale-150 translate-y-2 cursor-pointer' />
        {loading && <div className="p-2 text-foreground animate-pulse">Searching...</div>}
      </div>
      <div className="ml-auto">
        <Random className='mr-5 p-2 font-hun hover:text-text-highlight transition' />
        <button className='mr-5 p-2 font-hun hover:text-text-highlight transition' onClick={() => setViewFilters(!viewFilters)}>TAGS</button>
      </div>
      {viewFilters && (
        <div className="flex flex-row gap-2 w-full">
          <div>test</div>
          <div>test</div>
          <div>test</div>
          <div>test</div>
          <div>test</div>
          <div>test</div>
          <div>test</div>
          <div>test</div>
          <div>test</div>
        </div>
      )}
    </div>
  )
}
