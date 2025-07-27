"use server"

import { createClient, PostgrestError } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getRandomMeme(): Promise<number | { error: PostgrestError }> {
    const { count, error } = await supabase
        .from('media')
        .select('*', { count: 'exact', head: true });

    if (error) return { error } as { error: PostgrestError };
    return Math.floor(Math.random() * (count ?? 0));
}