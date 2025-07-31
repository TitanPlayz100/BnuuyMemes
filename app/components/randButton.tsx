"use client"

import { useRouter } from "next/navigation"

export default function Random({ className, mediaCount }: { className: string, mediaCount: number }) {
    const router = useRouter();
    const random = async () => {
        const random = Math.floor(Math.random() * mediaCount);
        router.push(`/bnuuys/${random}`);
    }

    return <button onClick={() => random()} className={className}>RANDOM</button>
}