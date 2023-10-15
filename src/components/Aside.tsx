import Image from 'next/image'
import fetch from 'node-fetch'
import { cn } from 'src/lib/cn'

interface Data {
  online: string | null
  total: string | null
  reddit: string | null
}

async function getData() {
  const data: Data = {
    online: null,
    total: null,
    reddit: null,
  }

  const headers = new Headers()
  headers.set('Authorization', `Bot ${process.env.DISCORD}`)
  const discord = fetch('https://discord.com/api/guilds/1157151836126593054/preview', {
    method: 'GET',
    headers,
    // @ts-ignore-next-line
    next: { revalidate: 3600 },
  })

  const reddit = fetch('https://www.reddit.com/r/dicengineers.json', {
    method: 'GET',
    // @ts-ignore-next-line
    next: { revalidate: 3600 },
  })

  const [discordRes, redditRes] = await Promise.allSettled([discord, reddit])

  if (discordRes.status === 'fulfilled' && discordRes.value.ok) {
    const json: any = await discordRes.value.json()
    data.online = `${json.approximate_presence_count}`
    data.total = `${json.approximate_member_count}`
  }

  if (redditRes.status === 'fulfilled' && redditRes.value.ok) {
    const json: any = await redditRes.value.json()
    data.reddit = `${json.data.children[0].data.subreddit_subscribers}`
  }

  return { ...data }
}

const countClasses =
  'flex flex-col h-full gap-1 font-extralight font-header justify-center items-center mr-32' as const

export const Aside = async () => {
  const { online, total, reddit } = await getData()

  return (
    <aside className="flex flex-col grow h-full items-center justify-start gap-2 pt-24">
      {online && (
        <>
          <a
            className={countClasses}
            href="https://discord.gg/U4kB82phwJ"
            rel="noopener noreferrer"
          >
            <span className="text-sm italic">Current</span>
            <Image src="/discord-white.svg" width={142} height={26.9} alt="Discord" />
            <span className="text-sm italic">Stats</span>
          </a>
          <div className={countClasses}>
            <span className="font-bold text-2xl">{online}</span>
            <span className="italic">Active users</span>
          </div>
          <div className={countClasses}>
            <span className="font-bold text-2xl">{total}</span>
            <span className="italic">Total users</span>
          </div>
        </>
      )}
      {reddit && (
        <>
          <a className={cn(countClasses, 'mt-8')} href="https://www.reddit.com/r/dicengineers">
            <Image src="/reddit.svg" width={40.5} height={36} alt="Discord" />
          </a>
          <a className={countClasses} href="https://www.reddit.com/r/dicengineers">
            <span className="font-bold text-xl">{reddit}</span>
            <span className="italic">Reddit users</span>
          </a>
        </>
      )}
    </aside>
  )
}
