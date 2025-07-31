'use client'

import { RootParams } from "@/app/page";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Random from "../randButton";
import { AddFilter } from "./addFilter";

export default function Search({ params, tagList, mediaCount }:
  { params: RootParams, tagList: string[], mediaCount: number }
) {
  const [value, setValue] = useState(params.search ?? "");
  const [viewFilters, setViewFilters] = useState(!!params.tags);
  const [loading, setLoading] = useTransition()
  const router = useRouter();

  const tags = params.tags?.split(',') ?? [];

  const changeValue = (word: string) => setValue(word);

  const search = () => {
    setLoading(() => {
      const pageParams = new URLSearchParams({ search: value });
      if (params.page) pageParams.set('page', params.page);
      router.replace(`/?${pageParams.toString()}`, { scroll: false });
    })
  }

  const remove = async (name: string) => {
    const oldTags = params.tags?.split(',') ?? [];
    const newTags = oldTags.filter(t => t != name).join(',')
    const pageParams = new URLSearchParams();
    if (newTags.length > 0) pageParams.set('tags', newTags);
    if (params.page) pageParams.set('page', params.page);
    if (params.search) pageParams.set('search', params.search);
    router.replace(`/?${pageParams.toString()}`, { scroll: false });
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
        <Random mediaCount={mediaCount} className='mr-5 p-2 font-hun hover:text-text-highlight transition' />
        <button className='mr-5 p-2 font-hun hover:text-text-highlight transition' onClick={() => setViewFilters(!viewFilters)}>FILTERS</button>
      </div>
      {viewFilters && (
        <div className="flex flex-row gap-2 w-full">
          <div className='flex flex-wrap gap-3 items-center ml-5'>
            <p>Tags: </p>
            {tags.length > 0 && tags.map((tag, index) => {
              return <div key={index} className='bg-foreground-second text-text px-3 p-1 rounded-4xl'>
                {tag}
                <button onClick={() => remove(tag)} className='bg-foreground-second px-3 rounded-4xl cursor-pointer'>-</button>
              </div>
            })}
            <AddFilter params={params} tagList={tagList} />
          </div>
        </div>
      )}
    </div>
  )
}
