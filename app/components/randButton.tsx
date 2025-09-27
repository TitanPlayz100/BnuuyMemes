"use client"

import { useRouter } from "next/navigation"
import { resetVisited, visited } from "./visited";

export default function Random({ className, mediaCount }: { className: string, mediaCount: number }) {
  const router = useRouter();

  const random = async () => {
    if (visited.length === 0) resetVisited(mediaCount);
    const random = visited.pop();
    router.push(`/bnuuys/${random}`);
  }

  return <button onClick={() => random()} className={className}>RANDOM</button>
}