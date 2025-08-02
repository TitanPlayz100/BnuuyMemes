'use client'

import { createClient } from '@/db/dbClient'
import { Provider } from '@supabase/supabase-js';

export default function LoginPage() {
    const signInWithProvider = async (provider: Provider) => {
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
            <div className='flex flex-col items-center gap-5 m-5 p-10 md:p-25 border-3 border-text shadow-main justify-center bg-background-dark'>
                <h1 className='text-4xl'>Login</h1>
                <p className='text-sm opacity-50'>Just click one of these</p>
                <button
                    className="bg-white text-black p-2 rounded w-6/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('google')}
                >
                    Sign in with Google
                </button>
                <button
                    className="bg-indigo-600 text-white p-2 rounded w-6/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('discord')}
                >
                    Sign in with Discord
                </button>
                <button
                    className="bg-gray-400 text-black p-2 rounded w-6/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('github')}
                >
                    Sign in with Github
                </button>
                <button
                    className="bg-black text-white border-2 border-white p-2 rounded w-6/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('twitter')}
                >
                    Sign in with X (formerly twitter)
                </button>
                <button
                    className="bg-purple-700 text-white p-2 rounded w-6/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('twitch')}
                >
                    Sign in with Twitch
                </button>
            </div>
        </div>
    )
}
