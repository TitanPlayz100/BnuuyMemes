import Link from "next/link";
import Logo from "./logo";
import Image from "next/image";
import { createClient } from '@/db/dbServer'
import Logout from './logout'

export default async function Header() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser();
    return (
        <header className="bg-foreground text-text font-hun flex p-2 pr-4 justify-between bg-[url(/res/header.png)]">
            <div className="flex gap-2 items-center">
                <Logo />
                <Link className="text-2xl md:text-4xl text-text-highlight hover:text-white transition mt-2" href="/">BNUUYMEMES</Link>
            </div>

            <div className="hidden md:flex items-center gap-5">
                <Link href="https://github.com/TitanPlayz100/BnuuyMemes" title="GitHub" className="brightness-130 hover:brightness-200">
                    <Image src="/icons/github.svg" alt="github" width={30} height={30} />
                </Link>
                <Link href="/info" title="Info page" className="brightness-130 hover:brightness-200">
                    <Image src="/icons/info.svg" alt="info page" width={25} height={25} className="translate-y-1 scale-140" />
                </Link>
                <Link href="https://www.youtube.com/@TitanPlayz100" className="hover:brightness-200">
                    <p>BY TITANPLAYZ</p>
                </Link>

                {data.user ? <Logout /> : <Link href="/auth/login" className="hover:brightness-200">LOGIN</Link>}
            </div>

            <div className="md:hidden flex items-center gap-5">
                <Link href="/info" title="Info page" className="brightness-200">
                    <Image src="/icons/info.svg" alt="info page" width={25} height={25} className="translate-y-1 scale-140" />
                </Link>
                {data.user ? <Logout /> : <Link href="/auth/login" className="text-text-highlight">LOGIN</Link>}
            </div>
        </header>
    )
}
