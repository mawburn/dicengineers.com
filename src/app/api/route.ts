import { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10'
import fetch from 'node-fetch'
import ExtApi from 'openai'
import { getData } from 'src/lib/serverOnly/getData'
import { upload } from 'src/lib/serverOnly/upload'

import type { Response as FetchResponse } from 'node-fetch'

const MAX_TOKENS = 81912 as const

interface Summary {
  date: string
  summary: string
}

interface JsonData {
  lastId: number
  summaries: Summary[]
}

interface Message extends RESTPostAPIChannelMessageJSONBody {
  id: number
  timestamp: string
  author: {
    username: string
  }
}

interface AIMessage {
  role: 'user' | 'system'
  content: string
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({
      status: 404,
    })
  }

  const data = (await getData('summaries')) as JsonData
  const messages = await fetchDiscordMessages(data.lastId || 1163466354339369100)
  const groupedMessages = groupMessagesByDate(messages)
  const summaries = await generateSummaries(groupedMessages, data)

  const newData = {
    lastId: messages[messages.length - 1].id,
    summaries: [...data.summaries, ...summaries],
  }

  upload(JSON.stringify(newData), 'summaries')

  return Response.json(newData)
}

async function fetchDiscordMessages(lastId: number) {
  const result: Message[] = []
  let end = false

  while (!end) {
    const res = (await fetch(
      `https://discord.com/api/channels/1163251543861100615/messages?after=${lastId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD}`,
        },
      }
    )) as FetchResponse

    if (res.status === 429) {
      await handleRateLimit(res)
      continue
    }

    if (!res.ok) {
      end = true
      continue
    }

    const channel = (await res.json()) as Message[]
    if (channel.length === 0) {
      end = true
      continue
    }

    result.push(...channel)
    lastId = channel[channel.length - 1].id
  }

  return result
    .sort((a, b) => a.id - b.id)
    .filter((obj, index, self) => self.findIndex(t => t.id === obj.id) === index)
}

function groupMessagesByDate(messages: Message[]) {
  return messages.reduce(
    (acc, obj: Message) => {
      const date = new Date(obj.timestamp)
      const key = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

      if (!acc[key]) {
        acc[key] = []
      }

      acc[key].push(`${obj.author.username}: ${obj.content}`)
      return acc
    },
    {} as Record<string, string[]>
  )
}

async function generateSummaries(grouped: Record<string, string[]>, data: JsonData) {
  const extApi = new ExtApi({
    apiKey: process.env.API_KEY,
    maxRetries: 10,
  })

  const summaries: { date: string; summary: string }[] = []

  for (const k in grouped) {
    const messages = grouped[k].join('\n').split(' ')
    const messageArr: string[] = []
    let index = 0

    while (index < messages.length) {
      messageArr.push(messages.slice(index, index + MAX_TOKENS).join(' '))
      index += MAX_TOKENS
    }

    for (const content of messageArr) {
      const aiMessages: AIMessage[] = [
        {
          role: 'system',
          content:
            'Give me the BRIEFEST possible summary of the conversation in the given chat and return it in a bulleted list. You do not need to do line by line, you can combine multiple messages from a user and just give an overall VERY BRIEF summary of the conversation. The format will be:\n(username):(message)\n(username:)(message)\n and so on. Do not include any personal information, except usernames and urls. Wrap usernames in double stars ie: **username** when used.',
        },
        {
          role: 'user',
          content,
        },
      ]

      const aiRes = await extApi.chat.completions.create({
        model: 'gpt-4',
        messages: aiMessages,
        temperature: 0.5,
        max_tokens: 500,
        frequency_penalty: 1,
        presence_penalty: 0.25,
      })

      if (aiRes.choices[0].message.content) {
        const idx = data.summaries.findIndex((s: Summary) => s.date === k)

        if (idx > -1) {
          const overlap = findOverlap(data.summaries[idx].summary, aiRes.choices[0].message.content)
          const nonOverlappingPart = aiRes.choices[0].message.content.substring(overlap.length)
          data.summaries[idx].summary += nonOverlappingPart
        } else {
          summaries.push({ date: k, summary: aiRes.choices[0].message.content })
        }
      }
    }
  }

  return summaries
}

function findOverlap(str1: string, str2: string): string {
  let overlap = ''

  for (let i = 0; i < str1.length; i++) {
    const substring = str1.substring(i)
    if (str2.startsWith(substring)) {
      overlap = substring
      break
    }
  }
  return overlap
}

async function handleRateLimit(res: FetchResponse) {
  const retryAfter = res.headers.get('Retry-After')
  if (retryAfter) {
    await new Promise(resolve => setTimeout(resolve, Number(retryAfter)))
  }
}
