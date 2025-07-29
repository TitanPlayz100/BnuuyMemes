import { createClient } from "../dbClient";
import { revalidateLikes } from "./revalidate";

export async function removeLike(mediaId: number) {
  const supabase = createClient();
  const {data: userData} = await supabase.auth.getUser();
  if (!userData.user) return;

  const { error } = await supabase
    .from('media_likes')
    .delete()
    .eq('media_id', mediaId)
    .eq('user_id', userData.user.id);
  if (error) return { error }

  const { error: error2 } = await supabase
    .rpc('decrement_like_count', { media_id: mediaId });
  if (error2) return { error2 }
  
  revalidateLikes();
}
