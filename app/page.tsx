"use client"
import data from '@/public/data.json';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export interface Data {
  author: string;
  original: string;
  type: string;
  name: string;
  tags?: string[];
}

const ITEMS_PER_PAGE = 25;

function getPagenatedData(page: number, search: string): { clampedPage: number, pagedData: Data[], maxPage: number } {
  const filtered = search == '' ? data : data.filter(msg => msg.name.toLowerCase().includes(search));

  const maxPage = Math.ceil((filtered.length - 1) / 25)
  const clampedPage = Math.min(Math.max(Number(page), 1), maxPage);
  const offset = (clampedPage - 1) * ITEMS_PER_PAGE;

  const pagedData = filtered.slice(offset, offset + ITEMS_PER_PAGE);
  return { clampedPage, pagedData, maxPage }
}

export default function Home() {
  const router = useRouter();
  const pageParam = useSearchParams().get('page');
  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const searchParam = useSearchParams().get('search') ?? '';

  const [page, setPage] = useState(requestedPage);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const { clampedPage, pagedData, maxPage } = getPagenatedData(Number(page), searchTerm);

  const changePage = (newpage: number) => {
    setPage(newpage);
    router.push(`/?page=${newpage}&search=${searchTerm}`, { scroll: false });
  }

  const search = (word: string) => {
    const lower = word.toLowerCase()
    setSearchTerm(lower);
    router.push(`/?page=${page}&search=${lower}`, { scroll: false });
  }

  return (
    <>
      <Search search={search} value={searchTerm} />
      <PageNav changePage={changePage} curPage={clampedPage} maxPage={maxPage} />

      <div className='flex flex-wrap m-5 ml-25 mr-25 justify-center'>
        {pagedData.map((msg, index) => {
          return <Card key={index} msg={msg} />
        })}
      </div>

    </>
  )
}

function Search({ search, value }: { search: (word: string) => void, value: string }) {
  return (
    <div className="bg-background-second text-text p-5 m-10 flex gap-10">
      <h1 className="text-2xl text-text-highlight">Search</h1>
      <input
        type='text'
        value={value}
        placeholder='search...'
        onInput={(e: any) => search(e.target.value)}
      />
    </div>
  )
}

function PageNav({ changePage, curPage, maxPage }: { changePage: (newpage: number) => void, curPage: number, maxPage: number }) {
  const Button = ({ string, click, selected = false }: { string: string, click: any, selected?: boolean }) => <button onClick={click} className={`text-text text-xl m-2 aspect-square h-8  hover:bg-hoverbg border border-foreground rounded-2xl ${selected ? 'bg-hoverbg' : 'bg-background-second'}`}>{string}</button>

  return (
    <div className='w-screen flex justify-center'>
      <Button string={"<"} click={() => changePage(curPage - 1)} />
      {Array.from({ length: maxPage }).map((_, index) => {
        return <Button key={index} string={(index + 1).toString()} click={() => changePage(index + 1)} selected={curPage == index + 1} />
      })}
      {/* <span className='text-text text-xl m-5'>Current Page: {curPage}</span> */}
      <Button string={">"} click={() => changePage(curPage + 1)} />
    </div>
  )
}

function Card({ msg }: { msg: Data }) {
  const title = msg.name.split(".")[0];
  const author = msg.author;
  const hastn = !(msg.tags?.includes("no_thumbnail") ?? false) && msg.type != "audio"
  const tn = hastn ? `/thumbnails/${title}.png` : "/placeholder.png";

  return (
    <Link href={`/bnuuys/${title.split(".")[0]}`} className='m-3 bg-background-second hover:bg-hoverbg w-[200px] h-auto transition duration-350 hover:duration-50 rounded-xl overflow-hidden'>
      <Image src={tn} alt="thumbnail" width={200} height={200} loading='lazy' placeholder='empty' unoptimized onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.png"; }} />
      <h1 className='text-2xl text-text-highlight m-4  overflow-ellipsis overflow-y-hidden whitespace-nowrap'>{title}</h1>
      <p className='text-l text-text m-4  overflow-ellipsis overflow-y-hidden whitespace-nowrap'>By {author}</p>
    </Link>
  )
}
