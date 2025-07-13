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
    <Link href={`/bnuuys/${title.split(".")[0]}`} className='m-3 bg-background-second hover:bg-hoverbg w-[150px] md:w-[200px] transition duration-350 hover:duration-50 p-2'>
      <Image src={tn} alt="thumbnail" width={200} height={200} loading='lazy' placeholder='empty' onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.png"; }} />
      <h1 className='text-xl text-text-highlight m-2 truncate '>{title}</h1>
      <p className='text-sm text-text ml-2 italic truncate'>By {author}</p>
    </Link>
  )
}
