import { createClient } from "../dbClient";
import { revalidateTags } from "./revalidate";

export async function addTagToMedia(mediaId: number, tag: string) {
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError) return { error: authError };

  const { data: dataDuped } = await supabase
    .from('tags')
    .upsert({ tag }, { ignoreDuplicates: true, onConflict: 'tag' })
    .select("id, tag");
  if (dataDuped && dataDuped.length === 0) return { errorDupe: "duped" };

  // get tag id
  const { data, error } = await supabase
    .from('tags')
    .select('id')
    .eq('tag', tag)
    .single();
  if (error) return { error };

  // add tag
  const { error: error2 } = await supabase
    .from('media_tags')
    .upsert({ user_id: userData.user.id, media_id: mediaId, tag_id: data.id }, { ignoreDuplicates: true });
  if (error2) return { error2 };

  revalidateTags();
}
