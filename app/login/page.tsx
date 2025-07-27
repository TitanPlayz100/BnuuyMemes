'use client'

import { createClient } from '@/db/dbClient'

export default function LoginPage() {
    const signInWithProvider = async (provider: 'google' | 'discord' | 'github') => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`
            },
        })
    }

    return (
        <div className="flex w-full h-[85vh] text-text text-2xl font-bold justify-center items-center">
            <div className='flex flex-col items-center gap-5 p-25 bg-background-second rounded-2xl border-4 border-text-highlight'>
                <h1>Login</h1>
                <button
                    className="bg-white text-black p-2 rounded"
                    onClick={() => signInWithProvider('google')}
                >
                    Sign in with Google
                </button>
                <button
                    className="bg-indigo-600 text-white p-2 rounded"
                    onClick={() => signInWithProvider('discord')}
                >
                    Sign in with Discord
                </button>
                <button
                    className="bg-gray-400 text-black p-2 rounded"
                    onClick={() => signInWithProvider('github')}
                >
                    Sign in with Github
                </button>
            </div>
        </div>
    )
}
