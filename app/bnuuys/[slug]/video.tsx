"use client"

import { useState } from "react"

export default function VideoPlayer({ url }: { url: string }) {
    const [error, setError] = useState(false);

    return (
        <>
            {error
                ? <p >Error with video</p>
                : (
                    <video controls autoPlay>
                        <source src={url} type="video/mp4" onError={() => setError(true)} />
                    </video>
                )}
        </>
    )
}