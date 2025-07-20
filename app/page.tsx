"use client"

import data from '@/public/data.json';
import { search } from 'fast-fuzzy';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageNav from './pageNav';
import Card from './cards';
import Search from './search';

export interface Data {
  author: string,
  original: string,
  type: string,
  name: string,
  meta?: string[],
  tags?: string[]
}

const ITEMS_PER_PAGE = 25;

// gets page contents given page, and also clamps pages to 1 - maxPage
type params = { clampedPage: number, pagedData: Data[], maxPage: number }
function getPagenatedData(page: number, searchString: string, types: string[]): params {
  // filtering
  const typeFiltered = data.filter(msg => types.includes(msg.type));
  const fuzzied = search(searchString, typeFiltered, {
    keySelector: (msg) => [msg.name, msg.author],
    threshold: 0.6,
  })
  const filtered = searchString == '' ? typeFiltered : fuzzied;

  // paginate
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
  const [typeFilter, setTypeFilter] = useState(["video", "audio", "image", "other"]);
  const { clampedPage, pagedData, maxPage } = getPagenatedData(Number(page), searchTerm, typeFilter);

  const changePage = (newpage: number) => {
    setPage(newpage);
    router.push(`/?page=${newpage}&search=${searchTerm}`, { scroll: false });
  }

  const search = (word: string) => {
    setSearchTerm(word);
    router.push(`/?page=${page}&search=${word}`, { scroll: false });
  }

  const randomPage = () => {
    const randomMeme = data[Math.floor(Math.random() * data.length)];
    router.push(`/bnuuys/${randomMeme.name.split(".")[0]}`);
  }

  const toggletype = (type: string) => {
    setTypeFilter(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }

  return (
    <>
      <Search search={search} value={searchTerm} types={typeFilter} toggleType={toggletype} random={randomPage} />
      <div className='w-screen flex flex-col items-center mb-5'>
        <PageNav changePage={changePage} curPage={clampedPage} maxPage={maxPage} />

        <div className='flex flex-wrap md:w-4/5 border-3 border-text shadow-main justify-center bg-background-dark pt-5 pb-5 m-6'>
          {pagedData.map((msg, index) => {
            return <Card key={index} msg={msg} />
          })}
        </div>
      </div>
    </>
  )
}
