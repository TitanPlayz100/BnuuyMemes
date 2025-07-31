'use client'

import { addLike } from "@/db/likes/add_like";
import { removeLike } from "@/db/likes/remove_like";
import Image from "next/image"
import { useState } from "react"

export default function Likes({ likes, hasLiked, id }: { likes: number, hasLiked: boolean, id: number }) {
  const [liked, setLiked] = useState(hasLiked);
  const [count, setCount] = useState(likes);

  const like = async () => {
    const data = await addLike(id);
    if (data && 'error' in data) { console.log(data); return };
    setLiked(true);
    setCount(count + 1)
  }

  const unlike = async () => {
    const data = await removeLike(id);
    if (data && 'error' in data) { console.log(data); return };
    setLiked(false);
    setCount(count - 1)
  }

  return (
    <>
      <div className='w-30 flex justify-end translate-y-2'>
        <Image src='/icons/heart.svg' alt='Like' width={200} height={200} className={'w-15 scale-100 hover:scale-120 transition ' + (liked ? "opacity-100" : "opacity-50")} onClick={() => liked ? unlike() : like()} />
      </div>
      <div className='w-30 md:text-left opacity-70'>Likes: {count}</div>
    </>
  )
}