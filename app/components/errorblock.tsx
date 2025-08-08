import { PostgrestError } from "@supabase/supabase-js";


export default function ErrorBlock({ error }: { error: PostgrestError }) {
  return <>
    <p className='text-text text-3xl'>Error with fetching data: {error.name}</p>
    <p className='text-red-400 text-m p-5'>{error.message}</p>
    <p>{error.details}</p>
  </>
}