import { createClient } from "../dbClient";
import { revalidateTags } from "./revalidate";

export async function removeTagFromMedia(mediaId: number, tag: string) {
  const supabase = createClient();
  const { error: authError, data: userData } = await supabase.auth.getUser();
  if (authError) return { error: authError };

  const { error } = await supabase.rpc('delete_tag_from_media', {
    tag_name: tag,
    media_id_input: mediaId,
    user_id_input: userData.user.id,
  });

  if (error) return { error };

  revalidateTags();
}
