"use client"

import Image from "next/image";
import { useState } from "react"

export default function Logo() {
    const [url, setURL] = useState(true);

    return (
        <Image onClick={() => setURL(!url)} src={url ? '/res/goodlogo.png' : '/res/badlogo.png'} alt="logo" width={240} height={240} className="w-15 h-15" />
    )
}