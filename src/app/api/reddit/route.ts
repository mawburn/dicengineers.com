import { getData as getPosts } from 'src/lib/serverOnly/getData'
import fetch from 'node-fetch'
import { upload } from 'src/lib/serverOnly/upload'
import { Reddit } from 'src/app/types/Reddit'

export const maxDuration = 300

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({
      status: 404,
    })
  }

  const redditRes = await fetch('https://www.reddit.com/r/dicengineers.json', {
    method: 'GET',
  })

  const posts = await getPosts('reddit')

  if (redditRes.ok) {
    const json: any = await redditRes.json()

    const jsonDG: Reddit = posts
    const ids = new Set<string>(jsonDG.totalMessages)
    const newIds = new Set<string>(json.data.children.map((child: any) => child.data.id))

    for (let id in ids) {
      if (!ids.has(id)) {
        newIds.add(id)
      }
    }

    const reddit: Reddit = {
      subscribers: `${json.data.children[0].data.subreddit_subscribers}`,
      totalMessages: Array.from(new Set<string>([...Array.from(ids), ...Array.from(newIds)])),
    }

    if (newIds.size > 0) {
      upload(JSON.stringify(reddit), 'reddit')
    }
  }

  return new Response(null, {
    status: 204,
  })
}
