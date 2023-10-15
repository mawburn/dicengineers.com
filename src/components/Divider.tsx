import { cn } from 'src/lib/cn'

export const Divider = ({ className }: { className?: string }) => (
  <hr
    className={cn(
      'w-full',
      'bg-gradient-to-r',
      'from-transparent',
      'via-light',
      'to-transparent',
      'h-px',
      'border-0',
      'my-8',
      className
    )}
  />
)
