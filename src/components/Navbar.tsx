import Link from "next/link";
import Image from "next/image";
import {PlusCircleIcon} from "@heroicons/react/24/outline";
import {AuthSession} from "@/utils/getAuthServerSideProps";

type NavbarProps = {
  user?: AuthSession['user']
}

export function Navbar({user}: NavbarProps) {
  return <header className="flex h-14 px-4 border-b lg:h-20 md:px-6">
    <div className='container flex items-center justify-between max-w-6xl mx-auto'>
      <div className="flex items-center gap-2 text-sm font-semibold uppercase">
        <Link className="flex items-center gap-2" href="/">
          <Image src='/logo.png' alt='PanelaMágica' width={50} height={50}/>
          <span className="sr-only">Panela Mágica</span>
        </Link>
      </div>
      <nav className="flex ml-auto space-x-4">
        <Link className="font-semibold" href="/">
          Receitas
        </Link>

        {user && (
          <>
            <Link href='/receitas/nova' className="font-semibold">
              <PlusCircleIcon className="h-6 w-6"/>
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link href='/login' className="font-semibold">
              Login
            </Link>
          </>
        )}

      </nav>
    </div>
  </header>
}

