import { createClient } from "../dbClient";
import { revalidateTags } from "./revalidate";

export async function addTagToMedia(mediaId: number, tag: string) {
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError) return { error: authError };

  const { data, error } = await supabase
    .rpc('insert_tag_and_media', {
      tag_input: tag,
      user_id_input: userData.user.id,
      media_id_input: mediaId
    })

  if (error) return { error };

  const { media_tag_duplicate } = data[0];
  if (media_tag_duplicate) return { error: "duplicate" }

  revalidateTags();
}
