// app/auth/callback/page.tsx
import { createClient } from '@/scripts/dbServer'
import { redirect } from 'next/navigation'

export default async function AuthCallback() {
  const supabase = await createClient()
  await supabase.auth.getUser() // this triggers session refresh via middleware

  return redirect('/') // or any page you'd like
}
