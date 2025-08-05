"use client"

import { useState } from "react"

export default function ImageViewer({ url }: { url: string }) {
    const [error, setError] = useState(false);

    return (
        <>
            {error
                ? <p>Error with image</p>
                : <img src={url} alt="Image" className="max-w-full max-h-full" onError={() => setError(true)} />
            }
        </>
    )
}