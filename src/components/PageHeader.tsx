import Image from 'next/image'
import Link from 'next/link'

interface PageHeaderProps {}

export const PageHeader = ({}: PageHeaderProps) => (
  <header className="flex justify-between items-center p-3 w-full">
    <Link href="/" className="flex justify-center items-center">
      <Image
        className="pr-2"
        src="/de.svg"
        width={42}
        height={42}
        alt="Dicengineers"
        loading="eager"
      />{' '}
      <h1 className="text-xl hidden md:block">Dicengineers</h1>
    </Link>
    <nav className="mr-2 md:mr-10">
      <ul className="flex gap-4">
        <li>
          <Link href="/showcase" className="underline">
            Showcase
          </Link>
        </li>
        <li>
          <a
            href="https://discord.gg/U4kB82phwJ"
            rel="noopener noreferrer"
            target="_blank"
            className="underline"
          >
            Join Discord
          </a>
        </li>
        <li>
          <a href="https://www.reddit.com/r/dicengineers" target="_blank" className="underline">
            Go to Reddit
          </a>
        </li>
      </ul>
    </nav>
  </header>
)
