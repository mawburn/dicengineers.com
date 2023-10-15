import { Pointer } from 'lucide-react'
import Image from 'next/image'
import { cn } from 'src/lib/cn'

export const Overlay = () => (
  <a
    href="https://discord.gg/U4kB82phwJ"
    rel="noopener noreferrer"
    className={cn(
      'absolute',
      'inline-block',
      'top-1/4 md:top-1/3',
      'left-1/5',
      'bg-discord/95',
      'font-body',
      'text-lg',
      'p-4',
      'rounded-xl',
      'w-56',
      'shadow-lg',
      'border-4',
      'border-darken',
      'pointer'
    )}
  >
    <h2 aria-label="Website Description">
      Connect with other engineers &amp; designers with a passion for tabletop gaming
    </h2>
    <span className="flex w-full p-2 justify-end">
      <Pointer className="rotate-90 mr-3" strokeWidth={3} />
      <Image
        className="iconWobble drop-shadow"
        src="/discord-mark-white.svg"
        width={32}
        height={32}
        alt="Discord Icon"
      />
    </span>
  </a>
)
