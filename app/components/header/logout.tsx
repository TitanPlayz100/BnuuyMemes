'use client'

import { createClient } from "@/db/dbClient";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();
    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
    }

    return <button onClick={logout} className="hover:brightness-200 cursor-pointer">LOGOUT</button>

}