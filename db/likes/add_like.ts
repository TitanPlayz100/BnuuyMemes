import { createClient } from "../dbClient";
import { revalidateLikes } from "./revalidate";

export async function addLike(mediaId: number) {
  const supabase = createClient();
  const {data: userData} = await supabase.auth.getUser();
  if (!userData.user) return;

  const { error } = await supabase
    .from('media_likes')
    .insert([{ media_id: mediaId, user_id: userData.user.id }]);
  if (error) return error;

  const { error: error2 } = await supabase
    .rpc('add_like_count', { media_id: mediaId });
  if (error2) return error;
  
  revalidateLikes()
}
