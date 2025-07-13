"use client"

import data from '@/public/data.json';
import { search } from 'fast-fuzzy';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageNav from './pageNav';
import Card from './cards';

export interface Data {
  author: string;
  original: string;
  type: string;
  name: string;
  tags?: string[];
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

  const toggletype = (type: string) => {
    setTypeFilter(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }

  return (
    <>
      <Search search={search} value={searchTerm} types={typeFilter} toggleType={toggletype} />
      <div className='w-screen flex flex-col items-center mb-5'>
        <PageNav changePage={changePage} curPage={clampedPage} maxPage={maxPage} />

        <div className='flex flex-wrap w-4/5 border-3 border-text shadow-main justify-center bg-background-dark p-5'>
          {pagedData.map((msg, index) => {
            return <Card key={index} msg={msg} />
          })}
        </div>
      </div>

    </>
  )
}


type params2 = { search: (word: string) => void, value: string, types: string[], toggleType: (arr: string) => void }
function Search({ search, value, types, toggleType }: params2) {
  const [filters, setFilters] = useState(false);
  const validTypes = ["video", "audio", "image", "other"];

  return (
    <div className="bg-background-second text-text p-5 pl-10 m-10 mb-5 flex flex-col md:flex-row gap-5 text-xl">
      <div className='flex gap-5'>
        <input
          type='text'
          value={value}
          placeholder='Search'
          onInput={(e: any) => search(e.target.value)}
          className='border border-foreground p-2 rounded-4xl min-w-1/3 outline-none pl-5'
        />
        <img src='/search.svg' className='w-9 scale-150 translate-y-2' />
      </div>

      <div className={`grow flex  justify-end gap-5 mr-5 transition-all ${filters ? 'opacity-100' : 'opacity-0'}`}>
        {validTypes.map((type, index) => {
          return <button className={`p-2 font-hun text-${types.includes(type) ? 'text-highlight' : 'text'} transition`} onClick={() => toggleType(type)} key={index}>{type}</button>

        })}
      </div>
      <button className='ml-auto mr-5 p-2 font-hun hover:text-text-highlight transition' onClick={() => setFilters(!filters)}>FILTERS</button>
    </div>
  )
}
