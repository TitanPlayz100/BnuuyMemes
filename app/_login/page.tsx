'use client'

import { createClient } from '@/scripts/dbClient'

export default function LoginPage() {
    const signInWithProvider = async (provider: 'google' | 'discord') => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`, // ensure this is whitelisted in Supabase dashboard
            },
        })
    }

    return (
        <div className="flex flex-col gap-4 p-8 max-w-md mx-auto">
            <h1 className="text-xl font-bold">Login</h1>
            <button
                className="bg-black text-white p-2 rounded"
                onClick={() => signInWithProvider('google')}
            >
                Sign in with Google
            </button>
            {/* <button
                className="bg-indigo-600 text-white p-2 rounded"
                onClick={() => signInWithProvider('discord')}
            >
                Sign in with Discord
            </button> */}
        </div>
    )
}
