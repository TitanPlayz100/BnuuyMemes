"use client"

import { useEffect, useState } from "react"

export default function VideoPlayer({ url }: { url: string }) {
    const [error, setError] = useState(false);
    const [srcurl, setSrc] = useState("");

    useEffect(() => {
        setSrc(url)
    }, [])

    return (
        <>
            {error
                ? <p >Error with video</p>
                : srcurl && (
                    <video controls autoPlay onError={() => setError(true)}>
                        <source src={srcurl} type="video/mp4" />
                    </video>
                )}
        </>
    )
}