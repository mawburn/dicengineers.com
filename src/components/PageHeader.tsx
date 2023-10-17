import Image from 'next/image'
import Link from 'next/link'
import { DISCORD } from 'src/lib/constants'

interface PageHeaderProps {}

export const PageHeader = ({}: PageHeaderProps) => (
  <header className="flex justify-between items-start md:items-center p-3 w-full">
    <Link href="/" className="flex justify-center items-center">
      <Image
        className="pr-2"
        src="/upperIcon.webp"
        width={42}
        height={42}
        alt="Dicengineers Logo"
        loading="eager"
      />{' '}
      <h1 className="text-xl hidden md:block">Dicengineers</h1>
    </Link>
    <nav className="flex justify-end mr-2 md:mr-10 w-full">
      <ul className="flex flex-wrap justify-center md:justify-normal gap-2 md:gap-4">
        <li>
          <Link href="/showcase" className="underline p-2">
            Showcase
          </Link>
        </li>
        <li>
          <a href={DISCORD} rel="noopener noreferrer" target="_blank" className="underline p-2">
            Join Discord
          </a>
        </li>
        <li>
          <a href="https://www.reddit.com/r/dicengineers" target="_blank" className="underline p-2">
            Go to Reddit
          </a>
        </li>
        <li>
          <a
            href="https://gpt.dicengineers.com"
            rel="noopener noreferrer"
            target="_blank"
            className="underline p-2"
          >
            ChatBot UI
          </a>
        </li>
      </ul>
    </nav>
  </header>
)
