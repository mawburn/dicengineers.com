import { Hammer } from 'lucide-react'

const Dash = () => <span className="mx-1">|</span>

export const Footer = () => (
  <footer className="flex flex-wrap w-full gap-4 text-xs min-h-20 justify-center items-center pb-4">
    <div>&copy; {new Date().getFullYear()} Dicengineers.com</div>
    <Dash />
    <address className="flex items-center gap-0 md:gap-2">
      <Hammer className="text-neutral-200 hidden md:inline" />
      <span>Built by</span>
      <a href="https://mawburn.com/" rel="me" className="p-1">
        mawburn
      </a>
    </address>
    <Dash />
    <div className="flex justify-center items-center">
      <a href="https://tabletop.land" className="p-1">
        Tabletop.Land
      </a>
    </div>
  </footer>
)
