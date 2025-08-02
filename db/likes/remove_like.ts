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

  const { error: error2 } = await supabase
    .rpc('decrement_like_count', { media_id: mediaId });
  if (error2) return { error: error2 }
}
