'use client'

import { RootParams } from "@/app/page"
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { populateParams } from "./search";
import { revalidateEverything } from "@/db/warmCache";

const sortList = ['date_created', 'like_count', 'name', 'author'];

export default function Sort({ params }: { params: RootParams }) {
  const [value, setValue] = useState(params.sort ?? 'date_created');
  const router = useRouter();

  const setSort = async (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
    const pageParams = populateParams(params);
    pageParams.set('sort', e.target.value);
    if (e.target.value == 'like_count') revalidateEverything();
    router.replace(`/?${pageParams.toString()}`, { scroll: false });
  }

  return (
    <div className='flex flex-wrap gap-3 items-center ml-5 '>
      <p>Sort: </p>
      <div className="bg-foreground-second text-text p-1 px-3 rounded-4xl w-auto">
        <select value={value} onChange={setSort} className='outline-none appearance-none bg-foreground-second px-1 cursor-pointer'>
          {sortList.map((t, i) => {
            return <option value={t} key={i} className="font-tfont font-bold bg-background-dark">{t.replace('_', ' ')}</option>
          })}
        </select>
        <button className='rounded-4xl relative'>+</button>
      </div>

    </div >
  )
}