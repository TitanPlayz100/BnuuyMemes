'use client'

import { RootParams } from "@/app/page";
import { getRandomMeme } from "@/db/getRandom";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search({ params }: { params: RootParams}) {
  const [value, setValue] = useState(params.search ?? "");
  const router = useRouter();

  const changeValue = (word: string) => setValue(word);

  const search = () => {
    router.replace(`/?page=${params.page}&search=${value}`, { scroll: false });
  }

  const random = () => {
    const randomMeme = getRandomMeme();
    router.push(`/bnuuys/${randomMeme}`);
  }

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
      </div>
      {/* 
      <div className={`grow flex transition-discrete flex-wrap justify-end gap-5 mr-5 transition-all ${filters ? 'opacity-100 max-h-auto' : 'opacity-0 max-h-0 pointer-events-none'}`}>
        {validTypes.map((type, index) => {
          return <button className={`p-2 font-hun text-${types.includes(type) ? 'text-highlight' : 'text'} transition`} onClick={() => toggleType(type)} key={index}>{type}</button>

        })}
      </div> */}
      <div className="grow"></div>
      <div>
        <button className='ml-auto mr-5 p-2 font-hun hover:text-text-highlight transition' onClick={() => random()}>RANDOM</button>
        {/* <button className='ml-auto mr-5 p-2 font-hun hover:text-text-highlight transition' onClick={() => {}}>FILTERS</button> */}
      </div>
    </div>
  )
}
