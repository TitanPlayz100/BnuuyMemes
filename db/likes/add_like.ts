import { createClient } from "../dbClient";

export async function addLike(mediaId: number) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const { error } = await supabase
    .from('media_likes')
    .upsert([{ media_id: mediaId, user_id: userData.user.id }], { ignoreDuplicates: true });
  if (error) return { error };

  const { error: error2 } = await supabase
    .rpc('add_like_count', { media_id: mediaId })

  if (error2) return { error: error2 };
}
