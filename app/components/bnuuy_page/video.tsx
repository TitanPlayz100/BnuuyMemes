"use client"

import { useEffect, useState } from "react"

export default function VideoPlayer({ url }: { url: string }) {
  const [error, setError] = useState(false);
  const [srcurl, setSrc] = useState("");

  useEffect(() => {
    setSrc(url)
  }, [])

  if (error) return <p>Error with video</p>;

  return (
    <>
      {srcurl && (
        <video controls autoPlay playsInline onError={() => setError(true)}>
          <source src={srcurl} type="video/mp4" />
        </video>
      )}
    </>
  )
}