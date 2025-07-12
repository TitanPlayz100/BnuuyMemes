"use client"

import { useState } from "react"

export default function AudioPlayer({ url }: { url: string }) {
    const [error, setError] = useState(false);

    return (
        <>
            {error
                ? <p>Error with audio</p>
                : (
                    <audio controls autoPlay>
                        <source src={url} onError={() => setError(true)} />
                    </audio>
                )}
        </>
    )
}