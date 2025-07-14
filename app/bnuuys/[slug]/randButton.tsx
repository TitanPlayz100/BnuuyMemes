"use client"

import { Data } from "@/app/page";
import { useRouter } from "next/navigation"

export default function Random({ data }: { data: Data[] }) {
    const router = useRouter();
    const rand = () => {
        const randomMeme = data[Math.floor(Math.random() * data.length)];
        router.push(`/bnuuys/${randomMeme.name.split(".")[0]}`);
    }
    return <button onClick={() => rand()} className="p-3 m-1 ml-5 w-30 rounded-2xl bg-background-second hover:bg-hoverbg transition">RANDOM</button>
}