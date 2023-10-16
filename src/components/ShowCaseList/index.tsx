import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { shuffleArray } from 'src/lib/shuffle'

import data from './data.json'
import { truncateStr } from 'src/lib/truncateStr'

const headers: string[] = ['Tabletop RPGs', 'Boardgames', 'Wargames', 'VTT Addons', 'Other']

interface Data {
  name: string
  url: string
  description?: string
  icon?: string
  author?: {
    name: string
    url?: string
  }
  games?: string[]
}

interface Projects {
  [key: (typeof headers)[number]]: Data[]
}

const showCase = data as Projects

export const ShowCaseList = () =>
  headers.map(cat =>
    showCase[cat].length === 0 ? null : (
      <section key={cat} className="flex flex-col justify-center items-center">
        <h2 className="text-2xl text-center">{cat}</h2>
        <p className="text-center text-xs mb-4">(sorted randomly)</p>
        <ul className="flex flex-col gap-4 px-4 w-full max-w-prose">
          {shuffleArray(showCase[cat]).map(p => (
            <ListItem key={`${p.name}${p.author}`} {...p} />
          ))}
        </ul>
      </section>
    )
  )

function ListItem({ name, url, description, icon, author, games }: Data) {
  return (
    <li className="flex flex-col p-4 w-full bg-primary border border-darkPrimary rounded-lg overflow-hidden shadow">
      <a href={url} target="_blank" className="flex flex-col relative w-full h-full">
        <ExternalLink size={20} className="absolute right-[-5px] top-[-5px]" />
        <h3 className="flex gap-1 items-center pb-2 mr-6 text-lg md:text-xl">
          {url.startsWith('https://github.com') && (
            <Image src="/github.svg" width={20} height={20} loading="eager" alt="Github Logo" />
          )}
          {icon && <Image src={icon} width={20} height={20} loading="eager" alt={`${name} Icon`} />}
          {url.startsWith('https://foundryvtt.com') && (
            <Image
              src="/vtt/foundry.svg"
              width={20}
              height={20}
              loading="eager"
              alt="Foundry Logo"
            />
          )}
          {truncateStr(name, 50)}
        </h3>
        <p className="text-sm">{description}</p>
      </a>
      {(games?.length || author?.name) && (
        <div className="flex justify-between items-center text-xs px-1 pt-4">
          {games?.length ? <p>Games: {truncateStr(games.join(', '), 50)}</p> : <span />}
          {author?.name && <Author {...author} />}
        </div>
      )}
    </li>
  )
}

function Author({ name, url }: { name: string; url?: string }) {
  return (
    <p>
      By:{' '}
      {url ? (
        <a href={url} target="_blank">
          {name}
        </a>
      ) : (
        name
      )}
    </p>
  )
}
