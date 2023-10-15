import Image from 'next/image'
import fetch from 'node-fetch'
import { getPosts } from 'src/lib/serverOnly/getPosts'
import { uploadPosts } from 'src/lib/serverOnly/uploadPosts'

import { Divider } from './Divider'

interface Data {
  online: string | null
  total: string | null
  reddit: string | null
  redditCount: number | null
}

async function getData() {
  const data: Data = {
    online: null,
    total: null,
    reddit: null,
    redditCount: null,
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

  const posts = getPosts()

  const [discordRes, redditRes, postsRes] = await Promise.allSettled([discord, reddit, posts])

  if (discordRes.status === 'fulfilled' && discordRes.value.ok) {
    const json: any = await discordRes.value.json()
    data.online = `${json.approximate_presence_count}`
    data.total = `${json.approximate_member_count}`
  }

  if (redditRes.status === 'fulfilled' && redditRes.value.ok) {
    const json: any = await redditRes.value.json()
    data.reddit = `${json.data.children[0].data.subreddit_subscribers}`

    if (postsRes.status === 'fulfilled') {
      const jsonDG: any = await postsRes.value
      const ids = new Set<string>(jsonDG)
      const newIds = new Set<string>(json.data.children.map((child: any) => child.data.id))

      for (let id in ids) {
        if (!ids.has(id)) {
          newIds.add(id)
        }
      }

      data.redditCount = newIds.size

      if (newIds.size > 0) {
        uploadPosts(JSON.stringify([...Array.from(ids), ...Array.from(newIds)]))
      }
    }
  }

  return { ...data }
}

const countClasses =
  'flex flex-col h-full gap-1 font-extralight font-header justify-center items-center md:mr-32' as const

export const Aside = async () => {
  const { online, total, reddit, redditCount } = await getData()

  return (
    <aside className="flex flex-col grow h-full items-center justify-center md:justify-start gap-2 pt-10 md:pt-24">
      {online && (
        <>
          <a
            className={countClasses}
            href="https://discord.gg/U4kB82phwJ"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image src="/discord-white.svg" width={142} height={26.9} alt="Discord" />
          </a>
          <a
            className={countClasses}
            href="https://discord.gg/U4kB82phwJ"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="font-bold text-2xl">{online}</span>
            <span className="italic">Active users</span>
          </a>
          <a
            className={countClasses}
            href="https://discord.gg/U4kB82phwJ"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="font-bold text-2xl">{total}</span>
            <span className="italic">Total users</span>
          </a>
        </>
      )}
      <Divider className="max-w-[50%] md:mr-32" />
      {reddit && (
        <>
          <a className={countClasses} href="https://www.reddit.com/r/dicengineers" target="_blank">
            <Image src="/reddit.svg" width={40.5} height={36} alt="Discord" />
            <span className="italic mt-2">r/dicengineers</span>
          </a>
          <a className={countClasses} href="https://www.reddit.com/r/dicengineers" target="_blank">
            <span className="font-bold text-xl">{reddit}</span>
            <span className="italic">Reddit users</span>
          </a>
          <a className={countClasses} href="https://www.reddit.com/r/dicengineers" target="_blank">
            <span className="font-bold text-xl">{redditCount}</span>
            <span className="italic">All time posts</span>
          </a>
        </>
      )}
    </aside>
  )
}
