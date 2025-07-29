import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const listTags = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('name')
      .order('name', { ascending: true });

    if (error) return { error }
    return { tags: data.map(d => d.name) } as { tags: string[] };
  },
  ['tags'],
  { tags: ['tags'] } // caching tag
)
