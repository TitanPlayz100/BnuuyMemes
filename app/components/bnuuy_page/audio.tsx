"use client"

import { useEffect, useState } from "react"

export default function AudioPlayer({ url }: { url: string }) {
    const [error, setError] = useState(false);
    const [srcurl, setSrc] = useState("");

    useEffect(() => {
        setSrc(url)
    }, [])

    if (error) return <p>Error with video</p>;

    return (
        <>
            {srcurl && (
                <audio controls autoPlay onError={() => setError(true)}>
                    <source src={srcurl} />
                </audio>
            )}
        </>
    )
}