import { search } from 'fast-fuzzy';
import { unstable_cache } from 'next/cache';
import { createClient } from "@supabase/supabase-js";

export interface Data {
  id: number,
  author: string,
  original: string,
  type: string,
  name: string,
  like_count: number,
  meta?: string[],
}

const ITEMS_PER_PAGE = 25;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getPaginatedData = unstable_cache(
  async (page: number, searchString: string, tags: string[]) => {
    let query

    // tag filtering using rpc
    if (tags.length > 0) {
      query = supabase.rpc('get_media_with_all_tags', { tag_names: tags })
    } else {
      query = supabase.from('media').select('*').order('id', {ascending: true});
    }
    
    const { data, error } = await query;
    if (error) return { error };

    // Fuzzy search
    const filtered: Data[] = searchString
      ? search(searchString, data, {
        keySelector: (msg: any) => [msg.name, msg.author],
        threshold: 0.6,
      })
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