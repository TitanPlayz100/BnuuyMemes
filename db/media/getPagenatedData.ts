import { search } from 'fast-fuzzy';
import { unstable_cache } from 'next/cache';
import { createClient } from "@supabase/supabase-js";
import { RootParams } from '@/app/page';

export interface Data {
  id: number,
  author: string,
  original: string,
  type: string,
  name: string,
  like_count: number,
  meta?: string[],
  date_created: string
}

const ITEMS_PER_PAGE = 25;

const sortList = ['date_created', 'like_count', 'name', 'author'];
const sortAsc = ['name', 'author'];
const typeList = ['all', 'video', 'audio', 'image', 'text', 'other'];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getPaginatedData = unstable_cache(
  async (params: RootParams) => {
    // init filters
    const page = Number(params.page ?? 1) || 1;
    const searchString = params.search ?? '';
    const tags = params.tags?.split(',') ?? [];
    let sort = params.sort ?? 'date_created';
    if (!sortList.includes(sort)) sort = 'date_created';
    let type = params.type ?? 'all';
    if (!typeList.includes(type)) type = 'all';

    let query

    // tag filtering using rpc
    if (tags.length > 0) {
      query = supabase
        .rpc('get_media_with_all_tags', { tag_names: tags })
    } else {
      query = supabase.from('media').select('*')
    }

    // sort and type filter
    query.order(sort, { ascending: sortAsc.includes(sort) })
    if (type != 'all') query.eq('type', type);

    const { data, error } = await query;
    if (error) return { error };

    // Fuzzy search
    const filtered: Data[] = searchString
      ? search(searchString, data, { keySelector: (msg: any) => [msg.name, msg.author], threshold: 0.6 })
      : data;

    // paginate
    const maxPage = Math.ceil(filtered.length / 25)
    const clampedPage = Math.min(Math.max(Number(page), 1), maxPage);
    const offset = (clampedPage - 1) * ITEMS_PER_PAGE;
    const pagedData = filtered.slice(offset, offset + ITEMS_PER_PAGE);

    return { curPage: clampedPage, pagedData, maxPage }
  },
  ['paginated-data'],
  { tags: ['media'] } // caching tag
);