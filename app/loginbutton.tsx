'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/scripts/dbClient'
import Link from 'next/link'

export default function LoginButton() {
    const [user, setUser] = useState<any>(null)

    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.reload();
    }

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();
            if (!error) setUser(data.user);
        }
        getUser();
    }, []);

    return (
        <>
            {user ? (
                <button onClick={logout} className="hover:brightness-200">LOGOUT</button>
            ) : (
                <Link href="/login" className="hover:brightness-200">LOGIN</Link>
            )}
        </>
    )
}
