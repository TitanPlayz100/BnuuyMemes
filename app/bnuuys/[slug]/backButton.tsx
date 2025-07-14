"use client"
import { useRouter } from "next/navigation"

export default function Back() {
    const router = useRouter();

    return <button onClick={() => router.back()} className="p-3 m-1 ml-5 w-30 rounded-2xl bg-background-second hover:bg-hoverbg transition">BACK</button>
}