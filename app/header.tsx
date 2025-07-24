import Link from "next/link";
import Logo from "./logo";
import Image from "next/image";
import LoginButton from "./loginbutton";

export default async function Header() {
    return (
        <header className="bg-foreground text-text font-hun flex p-2 justify-between bg-[url(/res/header.png)]">
            <div className="flex gap-2 items-center">
                <Logo />
                <Link className="text-2xl md:text-4xl text-text-highlight mt-2" href="/">
                    BNUUYMEMES
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-5">
                <Link href="https://github.com/TitanPlayz100/BnuuyMemes" title="GitHub" className="brightness-130 hover:brightness-200">
                    <Image src="/icons/github.svg" alt="github" width={30} height={30} />
                </Link>
                <Link href="https://discord.com/channels/673303546107658242/917245246449016853/981447677470445578" title="Discord Top Pinned" className="brightness-130 hover:brightness-200">
                    <Image src="/icons/link.svg" alt="github" width={25} height={25} className="translate-y-1" />
                </Link>
                <Link href="https://www.youtube.com/@TitanPlayz100" className="hover:brightness-200">
                    <p>BY TITANPLAYZ</p>
                </Link>
                
                {/* <LoginButton/> todo add back once auth is done */}
            </div>
        </header>
    )
}
