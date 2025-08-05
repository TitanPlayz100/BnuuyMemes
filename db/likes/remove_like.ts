import { createClient } from "../dbClient";

export async function removeLike(mediaId: number) {
  const supabase = createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from('media_likes')
    .delete()
    .eq('media_id', mediaId)
    .eq('user_id', userData.user.id);
  if (error) return { error }

  await supabase
    .rpc('update_media_likes', { p_media_id: mediaId });
}
