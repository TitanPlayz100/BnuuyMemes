import { Data } from "@/db/getPagenatedData";
import Image from "next/image";
import Link from "next/link";

export default function Card({ msg }: { msg: Data }) {
  const name = msg.name.split(".")[0];
  const author = msg.author;
  const hasThumbnail = !(msg.meta?.includes("no_thumbnail") ?? false);

  let thumbnailLink;
  if (!hasThumbnail) {
    thumbnailLink = "/res/placeholder.png";
  } else if (msg.type == "audio") {
    thumbnailLink = "/icons/song.svg"
  } else {
    thumbnailLink = `/thumbnails/${name}.png`
  }
  
  return (
    <Link href={`/bnuuys/${msg.id}`} className='m-1 md:m-3 bg-background-second hover:bg-hoverbg w-[150px] md:w-[200px] transition duration-350 hover:duration-50 p-2'>
      <Image src={thumbnailLink} alt="thumbnail" width={200} height={200} placeholder='empty'/>
      <h1 className='text-xl text-text-highlight m-2 truncate '>{name}</h1>
      <p className='text-sm text-text ml-2 italic truncate'>By {author}</p>
    </Link>
  )
}
