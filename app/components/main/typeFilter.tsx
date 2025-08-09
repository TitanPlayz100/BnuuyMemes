'use client'

import { RootParams } from "@/app/page"
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { populateParams } from "./search";

const typeList = ['all', 'video', 'audio', 'image', 'text', 'other'];

export default function TypeFilter({ params }: { params: RootParams }) {
  const [value, setValue] = useState(params.type ?? 'all');
  const router = useRouter();

  const setType = async (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
    const pageParams = populateParams(params);
    pageParams.set('type', e.target.value);
    router.replace(`/?${pageParams.toString()}`, { scroll: false });
  }

  return (
    <div className='flex flex-wrap gap-3 items-center ml-5 '>
      <p>Type: </p>
      <div className="bg-foreground-second text-text p-1 px-3 rounded-4xl w-auto">
        <select value={value} onChange={setType} className='outline-none appearance-none bg-foreground-second px-1 cursor-pointer'>
          {typeList.map((t, i) => {
            return <option value={t} key={i} className="font-tfont font-bold bg-background-dark">{t.replace('_', ' ')}</option>
          })}
        </select>
        <button className='rounded-4xl relative'>+</button>
      </div>

    </div >
  )
}