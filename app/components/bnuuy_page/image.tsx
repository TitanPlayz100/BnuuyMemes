"use client"

import { useState } from "react"

export default function ImageViewer({ url }: { url: string }) {
    const [error, setError] = useState(false);

    if (error) return <p>Error with image</p>;

    return <img src={url} alt="Image" className="max-w-full max-h-full" onError={() => setError(true)} />
}