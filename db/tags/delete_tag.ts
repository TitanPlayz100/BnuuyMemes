import { createClient } from "../dbClient";
import { revalidateTags } from "./revalidate";

export async function removeTagFromMedia(mediaId: number, tag: string) {
  const supabase = createClient();
  const { error: authError } = await supabase.auth.getUser();
  if (authError) return { error: authError };
  
  // get tag id
  const { data, error } = await supabase
    .from('tags')
    .select('id')
    .eq('tag', tag)
    .single();
  if (error) return { error };

  // remove tag
  const { error: error2 } = await supabase
    .from('media_tags')
    .delete()
    .eq('tag_id', data.id)
    .eq('media_id', mediaId);
  if (error2) return { error2 };

  revalidateTags();
}
