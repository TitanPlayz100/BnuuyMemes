'use client'

import { RootParams } from "@/app/page";
import { getCount } from "@/db/getCount";
import { useRouter } from "next/navigation";
import { startTransition, useState, useTransition } from "react";
import Random from "../randButton";

export default function Search({ params }: { params: RootParams }) {
  const [value, setValue] = useState(params.search ?? "");
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

  // const random = async () => {
  //   const data = await getCount();
  //   if ('error' in data) return;
  //   const random = Math.floor(Math.random() * data.total);
  //   router.push(`/bnuuys/${random}`);
  // }

  return (
    <div className="bg-background-second text-text p-5 pl-10 m-10 mb-5 flex flex-col md:flex-row gap-5 text-xl transition">
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
      {/* 
      <div className={`grow flex transition-discrete flex-wrap justify-end gap-5 mr-5 transition-all ${filters ? 'opacity-100 max-h-auto' : 'opacity-0 max-h-0 pointer-events-none'}`}>
        {validTypes.map((type, index) => {
          return <button className={`p-2 font-hun text-${types.includes(type) ? 'text-highlight' : 'text'} transition`} onClick={() => toggleType(type)} key={index}>{type}</button>

        })}
      </div> */}
      <div className="grow"></div>
      <div>
        <Random className='ml-auto mr-5 p-2 font-hun hover:text-text-highlight transition' />
        {/* <button  onClick={() => random()}>RANDOM</button> */}
        {/* <button className='ml-auto mr-5 p-2 font-hun hover:text-text-highlight transition' onClick={() => {}}>FILTERS</button> */}
      </div>
    </div>
  )
}
