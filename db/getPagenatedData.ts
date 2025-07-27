import { search } from 'fast-fuzzy';
import data from '@/public/data.json';

export interface Data {
    author: string,
    original: string,
    type: string,
    name: string,
    meta?: string[],
    tags?: string[]
}

const ITEMS_PER_PAGE = 25;

export function getPagenatedData(
    page: number,
    searchString: string,
    tags: string[]
): {
    curPage: number,
    pagedData: Data[],
    maxPage: number
} {
    // filtering
    const typeFiltered = data.filter(msg => tags.every(t => [msg.type, msg.tags].includes(t)));
    const fuzzied = search(searchString, typeFiltered, {
        keySelector: (msg) => [msg.name, msg.author],
        threshold: 0.6,
    })
    const filtered = searchString == '' ? typeFiltered : fuzzied;

    // paginate
    const maxPage = Math.ceil((filtered.length - 1) / 25)
    const clampedPage = Math.min(Math.max(Number(page), 1), maxPage);
    const offset = (clampedPage - 1) * ITEMS_PER_PAGE;

    // get data
    const pagedData = filtered.slice(offset, offset + ITEMS_PER_PAGE);
    return { curPage: clampedPage, pagedData, maxPage }
}