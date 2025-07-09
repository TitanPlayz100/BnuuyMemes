import data from '@/public/data.json';
import Image from 'next/image';
import Link from 'next/link';

type Data = {
  author: string;
  original: string;
  type: string;
  name: string;
  tags?: string[];
}

export default function Home() {
  // const realdata = data.slice(0, 20);

  return (
    <>
      <div className="bg-background-second text-text p-5 m-10">
        <h1 className="text-2xl text-text-highlight">Search</h1>
      </div>

      <div className='flex flex-wrap m-5 ml-25 mr-25 justify-center pb-5'>
        {data.map((msg, index) => {
          return <Card key={index} msg={msg} />
        })}
      </div>
      {/* 
      <div id='fetchmore' className='w-screen p-10 flex align-middle justify-center h-40'>
        <p className='text-2xl text-text'>Fetching more...</p>
      </div> */}
    </>
  )
}

function Card({ msg }: { msg: Data }) {
  const title = msg.name.split(".")[0];
  const author = msg.author;
  const hastn = !(msg.tags?.includes("no_thumbnail") ?? false) && msg.type != "audio"
  const tn = hastn ? `/thumbnails/${title}.png` : "/placeholder.png";

  return (
    <Link href={`/bnuuys/${title.split(".")[0]}`} className='m-3 bg-background-second hover:bg-hoverbg w-[200px] h-auto transition duration-350 hover:duration-50 rounded-xl overflow-hidden'>
      <Image src={tn} alt="thumbnail" width={200} height={200} />
      <h1 className='text-2xl text-text-highlight m-4  overflow-ellipsis overflow-y-hidden whitespace-nowrap'>{title}</h1>
      <p className='text-l text-text m-4  overflow-ellipsis overflow-y-hidden whitespace-nowrap'>By {author}</p>
    </Link>
  )
}