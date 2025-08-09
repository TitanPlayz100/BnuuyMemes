import { createClient } from "../dbServer";

export async function hasUserLikedMedia(mediaId: number) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const { data, error } = await supabase
    .from('media_likes')
    .select('media_id', { count: 'exact' })
    .eq('user_id', userData.user.id)
    .eq('media_id', mediaId)
    .limit(1)
    .single();

  if (error) return { error };
  return data !== null;
}
