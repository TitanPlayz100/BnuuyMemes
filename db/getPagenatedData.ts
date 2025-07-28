import { createClient, PostgrestError } from '@supabase/supabase-js';
import { search } from 'fast-fuzzy';
import { unstable_cache } from 'next/cache';

export interface Data {
    id: number,
    author: string,
    original: string,
    type: string,
    name: string,
    meta?: string[],
    tags?: string[]
}

const ITEMS_PER_PAGE = 25;

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getPaginatedData = unstable_cache(
    async (
        page: number,
        searchString: string,
        tags: string[]
    ): Promise<{
        curPage: number;
        pagedData: Data[];
        maxPage: number;
    } | {
        error: PostgrestError
    }> => {
        let query = supabase
            .from('media')
            .select('*');

        if (tags.length > 0) {
            tags.forEach(tag => query = query.contains('tags', [tag]));
        }

        const { data, error } = await query;
        if (error || !data) return { error };

        // Fuzzy search
        const filtered = searchString
            ? search(searchString, data, {
                keySelector: (msg) => [msg.name, msg.author],
                threshold: 0.6,
            }) : data;

        // paginate
        const maxPage = Math.ceil((filtered.length - 1) / 25)
        const clampedPage = Math.min(Math.max(Number(page), 1), maxPage);
        const offset = (clampedPage - 1) * ITEMS_PER_PAGE;
        const pagedData = filtered.slice(offset, offset + ITEMS_PER_PAGE);

        return { curPage: clampedPage, pagedData, maxPage }
    },
    ['paginated-data'], // cache key parts
    {
        tags: ['media'], // revalidate when related tags are invalidated
        revalidate: 3600 // optional: revalidate after 1 hour
    }
);