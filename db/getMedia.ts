import { Data } from './getPagenatedData';
import { createClient, PostgrestError } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getMedia(id: number): Promise<Data | { error: PostgrestError }> {
    const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return { error } as { error: PostgrestError };
    return data;
}
