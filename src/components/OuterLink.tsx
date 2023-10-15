import { ExternalLink } from 'lucide-react'
import { PropsWithChildren } from 'react'

interface OuterLinkProps {
  url: string
  title?: string
}

export const OuterLink = ({ url, title = '', children }: PropsWithChildren<OuterLinkProps>) => (
  <a href={url} title={title} target="_blank" className="flex items-center gap-2 underline">
    {children} <ExternalLink size={16} />
  </a>
)
