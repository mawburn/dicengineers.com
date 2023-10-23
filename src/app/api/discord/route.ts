import { addHours, compareAsc, formatISO, parse, parseISO, startOfDay } from 'date-fns'
import type { DiscordMessage } from 'src/app/types/Discord'
import type { MessageSummary } from 'src/app/types/Messages'
import { getData } from 'src/lib/serverOnly/getData'
import { upload } from 'src/lib/serverOnly/upload'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({
      status: 404,
    })
  }

  const data = (await getData('discord')) as DiscordMessage
  const messageData = await fetchDiscordMessages(1163466354339369100)
  const groupedMessages = groupMessagesByDate(messageData)

  upload(JSON.stringify({ ...data, ...groupedMessages, lastId: groupedMessages.lastId }), 'discord')
}

async function fetchDiscordMessages(lastId: number) {
  const result: DiscordMessage[] = []
  let end = false

  while (!end) {
    const res = await fetch(
      `https://discord.com/api/channels/1163251543861100615/messages?after=${lastId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD}`,
        },
      }
    )

    if (res.status === 429) {
      await handleRateLimit(res)
      continue
    }

    if (!res.ok) {
      end = true
      continue
    }

    const channel = (await res.json()) as DiscordMessage[]
    if (channel.length === 0) {
      end = true
      continue
    }

    result.push(...channel)
  }

  return result
    .sort((a, b) => a.id - b.id)
    .filter((obj, index, self) => self.findIndex(t => t.id === obj.id) === index)
}

async function handleRateLimit(res: Response) {
  const retryAfter = res.headers.get('Retry-After')
  if (retryAfter) {
    await new Promise(resolve => setTimeout(resolve, Number(retryAfter)))
  }
}

function groupMessagesByDate(messages: DiscordMessage[]) {
  const now = startOfDay(addHours(new Date(), -5))
  let lastId = 0

  const grouped = messages
    .sort((a, b) => compareAsc(parseISO(a.timestamp), parseISO(b.timestamp)))
    .reduce(
      (acc, obj: DiscordMessage) => {
        const date = addHours(new Date(obj.timestamp), -5)
        const key = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })

        if (startOfDay(date) >= now) {
          return acc
        } else if (!acc[key]) {
          acc[key] = []
        }

        lastId = obj.id
        acc[key].push(`${obj.author.username}: ${obj.content}`)
        return acc
      },
      {} as Record<string, string[]>
    )

  return {
    lastId,
    messages: grouped,
  }
}
