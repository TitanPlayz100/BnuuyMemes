import { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '../dbServer';
import { Data } from './getPagenatedData';

export async function getMedia(id: number): Promise<Data | { error: PostgrestError }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return { error } as { error: PostgrestError };
  return data as Data;
}
