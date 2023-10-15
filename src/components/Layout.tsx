import { PropsWithChildren } from 'react'
import { cn } from 'src/lib/cn'

import { Footer } from './Footer'
import { PageHeader } from './PageHeader'

interface LayoutProps {
  className?: string
}

export const Layout = ({ className, children }: PropsWithChildren<LayoutProps>) => (
  <div id="main">
    <PageHeader />
    <main
      className={cn(
        'flex',
        'grow',
        'min-h-screen',
        'flex-col',
        'px-4 md:px-0',
        'w-full',
        className
      )}
    >
      {children}
    </main>
    <Footer />
  </div>
)
