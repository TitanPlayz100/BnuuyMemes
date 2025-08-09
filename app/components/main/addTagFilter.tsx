'use client'

import { RootParams } from "@/app/page";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { populateParams } from "./search";
import { revalidateEverything } from "@/db/warmCache";

export default function AddTagFilter({ params, tagList }: { params: RootParams, tagList: string[] }) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const router = useRouter();

  const add = async () => {
    const newTags = params.tags?.split(',') ?? [];
    newTags.push(value)

    const pageParams = populateParams(params);
    pageParams.set('tags', newTags.join(','));

    setValue('');
    setAdding(false);
    revalidateEverything();
    router.replace(`/?${pageParams.toString()}`, { scroll: false });
  }

  return (
    <>
      {adding ?
        <div className='bg-foreground-second text-text p-1 px-3 rounded-4xl'>
          <input
            type='text'
            list="tagdata"
            value={value}
            placeholder='name...'
            onInput={(e: any) => setValue(e.target.value)}
            onKeyDown={e => { if (e.key == 'Enter') { add() } }}
            autoFocus
            onBlur={() => setAdding(value !== '')}
            maxLength={13}
            size={12}
            className='p-0 outline-none'
          />
          <datalist id="tagdata">
            {tagList.map((t, i) => {
              return <option value={t} key={i} />
            })}
          </datalist>
          <button onClick={() => add()} className='p-0 cursor-pointer'>+</button>
        </div>
        :
        <button onClick={() => setAdding(true)} className='bg-foreground-second hover:bg-hoverbg transition p-1 px-3 rounded-4xl cursor-pointer'>+</button>
      }
    </>
  )
}