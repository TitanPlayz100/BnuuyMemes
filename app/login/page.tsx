'use client'

import { createClient } from '@/db/dbClient'
import { Provider } from '@supabase/supabase-js';
import Image from 'next/image';

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

    function Icon({provider}: {provider:string}) {
        return <Image src={`/icons/auth/${provider}-icon.svg`} alt={provider} width={20} height={20} className='inline mx-2 translate-y-[-20%]' />
    }

    return (
        <div className="flex w-full h-[85vh] text-text text-2xl font-bold justify-center items-center">
            <div className='flex flex-col items-center gap-5 m-5 py-25 w-full md:w-7/20 border-3 border-text shadow-main justify-center bg-background-dark'>
                <h1 className='text-4xl'>Sign In</h1>
                <p className='text-sm opacity-50'>Just click one of these</p>
                <button
                    className="bg-white text-black p-2 rounded w-3/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('google')}
                >
                    <Icon provider='google'/>
                    Google
                </button>
                <button
                    className="bg-indigo-600 text-white p-2 rounded w-3/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('discord')}
                >
                    <Icon provider='discord'/>
                    Discord
                </button>
                <button
                    className="bg-gray-400 text-black p-2 rounded w-3/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('github')}
                >
                    <Icon provider='github'/>
                    Github
                </button>
                <button
                    className="bg-black text-white border-2 border-white p-2 rounded w-3/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('twitter')}
                >
                    <Icon provider='twitter'/>
                    X (formerly twitter)
                </button>
                <button
                    className="bg-purple-700 text-white p-2 rounded w-3/5 hover:opacity-80 transition"
                    onClick={() => signInWithProvider('twitch')}
                >
                    <Icon provider='twitch'/>
                    Twitch
                </button>
            </div>
        </div>
    )
}
