import Image from "next/image";
import Link from "next/link";
import { Data } from "./page";

export default function Card({ msg }: { msg: Data }) {
  const title = msg.name.split(".")[0];
  const author = msg.author;
  const hastn = !(msg.tags?.includes("no_thumbnail") ?? false)
  let tn;
  if (!hastn) {
    tn = "/placeholder.png";
  } else if (msg.type == "audio") {
    tn = "/song.svg"
  } else {
    tn = `/thumbnails/${title}.png`
  }
  
  return (
    <Link href={`/bnuuys/${title.split(".")[0]}`} className='m-3 bg-background-second hover:bg-hoverbg w-[150px] md:w-[200px]  h-auto transition duration-350 hover:duration-50 rounded-xl overflow-hidden'>
      <Image src={tn} alt="thumbnail" width={200} height={200} loading='lazy' placeholder='empty' onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.png"; }} />
      <h1 className='text-2xl text-text-highlight m-4 truncate '>{title}</h1>
      <p className='text-l text-text m-4 truncate'>By {author}</p>
    </Link>
  )
}
