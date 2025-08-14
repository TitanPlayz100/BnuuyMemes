"use client"

import Image from "next/image";
import { useState } from "react"
import CoolBg from "./cool-bg";
import Link from "next/link";
import styles from "./logo.module.css"

export default function Logo() {
  const [url, setURL] = useState(true);
  const [animating, setAnimating] = useState(false);

  const click = () => {
    setURL(!url);
    setAnimating(true);
    document.documentElement.classList.toggle('rev-theme');
  }

  return (
    <>
      <div className="flex gap-3 items-center">
        <div onAnimationEnd={() => setAnimating(false)} className={`${animating ? styles.animate : ""} w-15`}>
          <Image onClick={click} src={url ? '/res/goodlogo.png' : '/res/badlogo.png'} alt="logo" width={240} height={240} className="w-15 h-15 ml-2 cursor-pointer" />
        </div>
        <Link className="text-2xl md:text-4xl text-text-highlight hover:text-white transition mt-2" href="/">BNUUYMEMES</Link>
      </div>
      {!url && <CoolBg />}
    </>
  )
}