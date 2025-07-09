import data from '@/public/data.json';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const realdata = data.slice(0, 20);

  return (
    <>
      <header className="bg-foreground text-text p-5 flex justify-between items-baseline">
        <Link className="text-5xl text-text-highlight" href="/">BnuuyMemes</Link>
        <div>
          <p>By TitanPlayz</p>
        </div>
      </header>

      <div className="bg-background-second text-text p-5 m-10">
        <h1 className="text-2xl text-text-highlight">Search</h1>
      </div>

      <div className='flex flex-wrap m-5 ml-25 mr-25 justify-center pb-5'>
        {realdata.map((msg, index) => {
          return <Card key={index} title={msg.name.split('.')[0]} author={msg.author} />
        })}
      </div>

      <div className='w-screen p-10 flex align-middle justify-center h-40'>
        <p className='text-2xl text-text'>Fetching more...</p>
      </div>
    </>
  )
}

function Card({ title, author }: { title: string, author: string }) {
  return (
    <div className='p-5 m-2 bg-background-second hover:bg-hoverbg w-auto h-auto transition duration-350 hover:duration-50 rounded-2xl'>
      <Image src={`/thumbnails/${title.split(".")[0]}.png`} alt="thumbnail" width={200} height={200} />
      <h1 className='text-2xl text-text-highlight mt-2 mb-2 overflow-ellipsis max-w-50 overflow-x-hidden overflow-y-hidden whitespace-nowrap'>{title}</h1>
      <p className='text-l text-text mt-2 mb-2'>By {author}</p>
    </div>
  )
}