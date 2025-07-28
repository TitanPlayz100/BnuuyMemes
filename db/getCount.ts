"use server"

import { createClient, PostgrestError } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getCount = unstable_cache(
    async (): Promise<{ total: number } | { error: PostgrestError }> => {
        const { count, error } = await supabase
            .from('media')
            .select('*', { count: 'exact', head: true });

        if (error) return { error } as { error: PostgrestError };
        return { total: count ?? 0 };
    },
    ['media-count'],
    { tags: ['media'] }
)