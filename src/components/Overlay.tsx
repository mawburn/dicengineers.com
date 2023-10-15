import { Pointer } from 'lucide-react'
import Image from 'next/image'
import { cn } from 'src/lib/cn'
import { DISCORD } from 'src/lib/constants'

export const Overlay = () => (
  <a
    href={DISCORD}
    rel="noopener noreferrer"
    target="_blank"
    className={cn(
      'absolute',
      'inline-block',
      'md:top-[450px]',
      'xs:left-0 md:left-1/5',
      'mt-52 md:mt-0',
      'mx-4',
      'bg-secondary/95',
      'font-body',
      'text-lg',
      'p-4',
      'rounded-xl',
      'w-fit md:w-56',
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
