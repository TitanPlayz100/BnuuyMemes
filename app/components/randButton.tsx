"use client"

import { getCount } from "@/db/getCount";
import { useRouter } from "next/navigation"

export default function Random({ className }: { className: string }) {
    const router = useRouter();
    const random = async () => {
        const data = await getCount();
        if ('error' in data) return;
        const random = Math.floor(Math.random() * data.total);
        router.push(`/bnuuys/${random}`);
    }

    return <button onClick={() => random()} className={className}>RANDOM</button>
}