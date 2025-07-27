"use client"

import { getRandomMeme } from "@/db/getRandom";
import { useRouter } from "next/navigation"

export default function Random() {
    const router = useRouter();
    const random = () => {
        const randomMeme = getRandomMeme();
        router.push(`/bnuuys/${randomMeme.name.split(".")[0]}`);
    }
    
    return <button onClick={() => random()} className="p-3 m-1 ml-5 w-30 rounded-2xl bg-background-second hover:bg-hoverbg transition">RANDOM</button>
}