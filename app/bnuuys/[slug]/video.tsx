"use client"

import { useState } from "react"

export default function VideoPlayer({ url }: { url: string }) {
    const [error, setError] = useState(false);

    return (
        <>
            {error
                ? <p>Media is not uploaded (will happen eventually)</p>
                : (
                    <video className='max-w-full' width={1000} controls>
                        <source src={url} type="video/mp4" onError={() => setError(true)} />
                    </video>
                )}
        </>
    )
}