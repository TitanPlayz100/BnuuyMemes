import { unstable_cache } from 'next/cache';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getCount = unstable_cache(
  async () => {
    const { count, error } = await supabase
      .from('media')
      .select('*', { count: 'exact', head: true });

    if (error) return { error };
    return { total: count ?? 0 };
  },
  ['media-count'],
  { tags: ['media'] } // caching tag
)