import { addHours, compareAsc, formatISO, parseISO, startOfDay } from 'date-fns'
import { getData } from 'src/lib/serverOnly/getData'
import { upload } from 'src/lib/serverOnly/upload'

import type { DiscordMessage, DiscordMessages } from 'src/app/types/Discord'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({
      status: 404,
    })
  }

  const data = (await getData('discord')) as DiscordMessages
  const messageData = await fetchDiscordMessages(data.lastId)
  const groupedMessages = groupMessagesByDate(messageData)

  const mergedData: DiscordMessages = {
    ...data,
    messages: { ...data.messages, ...groupedMessages.messages },
    lastId: groupedMessages.lastId,
  }

  await upload(JSON.stringify(mergedData), 'discord')

  return new Response(null, {
    status: 204,
  })
}

async function fetchDiscordMessages(lastId: number) {
  let newLastId = lastId
  const result: DiscordMessage[] = []
  let end = false

  while (!end) {
    const url = `https://discord.com/api/channels/1163251543861100615/messages?after=${newLastId}&limit=100`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD!}`,
      },
    })

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

    // Discord returns in reverse
    newLastId = channel[0].id
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
        if (!obj.content) {
          return acc
        }

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

        acc[key].push({
          id: obj.id,
          timestamp: formatISO(date),
          content: obj.content,
          author: obj.author,
        })

        return acc
      },
      {} as Record<string, DiscordMessage[]>
    )

  return {
    lastId,
    messages: grouped,
  }
}
