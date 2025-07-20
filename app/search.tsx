import { useState } from "react";

type params2 = {
  search: (word: string) => void,
  value: string,
  types: string[],
  toggleType: (arr: string) => void,
  random: () => void;
}
export default function Search({ search, value, types, toggleType, random }: params2) {
  const [filters, setFilters] = useState(false);
  const validTypes = ["video", "audio", "image", "other"];

  return (
    <div className="bg-background-second text-text p-5 pl-10 m-10 mb-5 flex flex-col md:flex-row gap-5 text-xl transition">
      <div className='flex gap-5'>
        <input
          type='text'
          value={value}
          placeholder='Search'
          onInput={(e: any) => search(e.target.value)}
          className='border border-foreground p-2 rounded-4xl min-w-1/3 outline-none pl-5'
        />
        <img src='/icons/search.svg' className='w-9 scale-150 translate-y-2' />
      </div>

      <div className={`grow flex transition-discrete flex-wrap justify-end gap-5 mr-5 transition-all ${filters ? 'opacity-100 max-h-auto' : 'opacity-0 max-h-0 pointer-events-none'}`}>
        {validTypes.map((type, index) => {
          return <button className={`p-2 font-hun text-${types.includes(type) ? 'text-highlight' : 'text'} transition`} onClick={() => toggleType(type)} key={index}>{type}</button>

        })}
      </div>

      <div>
        <button className='ml-auto mr-5 p-2 font-hun hover:text-text-highlight transition' onClick={() => random()}>RANDOM</button>
        <button className='ml-auto mr-5 p-2 font-hun hover:text-text-highlight transition' onClick={() => setFilters(!filters)}>FILTERS</button>
      </div>
    </div>
  )
}
