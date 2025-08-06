import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getMediaTags = unstable_cache(
  async (mediaId: number) => {
    const { data, error } = await supabase
      .from('media_tags')
      .select('tags(tag),user_id')
      .eq('media_id', mediaId)

    if (error) return { error };
    const data_any: any = data;
    return data_any as { tags: { tag: string }, user_id: string }[];
  },
  ['tags'],
  { tags: ['tags'] } // caching tag
)
