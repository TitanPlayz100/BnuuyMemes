"use client"
import { useRouter } from "next/navigation"

export default function Back() {
    const router = useRouter();

    return <button onClick={() => router.back()} className="p-1 m-1 bg-foreground hover:bg-hoverbg">Back</button>
}