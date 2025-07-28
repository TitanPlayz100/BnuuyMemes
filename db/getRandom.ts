"use server"

import { createClient, PostgrestError } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getRandomMeme = unstable_cache(
    async (): Promise<number | { error: PostgrestError }> => {
        const { count, error } = await supabase
            .from('media')
            .select('*', { count: 'exact', head: true });

        if (error) return { error } as { error: PostgrestError };
        return Math.floor(Math.random() * (count ?? 0));
    },
    ['media-count'], // cache key parts
    {
        tags: ['media'], // revalidate when related tags are invalidated
    }
)