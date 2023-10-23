import { parse } from 'date-fns'
import ExtApi from 'openai'
import { getData } from 'src/lib/serverOnly/getData'
import { upload } from 'src/lib/serverOnly/upload'

import type { AIMessage, MessageSummary, Summary } from 'src/app/types/Messages'
import type { DiscordMessages } from 'src/app/types/Discord'

const MAX_TOKENS = 81912 as const

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({
      status: 404,
    })
  }

  const discordData = (await getData('discord')) as DiscordMessages
  const summaryData = (await getData('summaries')) as MessageSummary
  const data = trimData(discordData, summaryData)
  const summariesRaw = await generateSummaries(data, summaryData)

  const summaries = { ...summaryData, ...summariesRaw }

  upload(JSON.stringify(summaries), 'summaries')

  return Response.json(summaries)
}

function trimData(discord: DiscordMessages, summary: MessageSummary) {
  const lastDate = parse(summary.lastDate, 'MMMM d, yyyy', new Date())
  const dataToSummarize: Record<string, string[]> = {}

  Object.keys(discord.messages).forEach(k => {
    const date = parse(k, 'MMMM d, yyyy', new Date())

    if (date > lastDate) {
      let idx = 0
      const messageArr: string[] = []
      const messages = discord.messages[k].map(m => `${m.author.username}: ${m.content}`).join('\n')

      while (idx < messages.length) {
        messageArr.push(
          messages
            .split(' ')
            .slice(idx, idx + MAX_TOKENS)
            .join(' ')
        )
        idx += MAX_TOKENS
      }

      dataToSummarize[k] = messageArr
    }
  })

  return dataToSummarize
}

async function generateSummaries(messages: Record<string, string[]>, data: MessageSummary) {
  let lastDate = parse(data.lastDate, 'MMMM d, yyyy', new Date())

  const extApi = new ExtApi({
    apiKey: process.env.API_KEY,
    maxRetries: 10,
  })

  const summaries: Summary[] = []

  for (const k in messages) {
    const newDate = parse(k, 'MMMM d, yyyy', new Date())

    for (const content in messages[k]) {
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
        summaries.push({ date: k, summary: aiRes.choices[0].message.content })
      }

      if (newDate > lastDate) {
        lastDate = newDate
      }
    }
  }

  return {
    lastDate,
    summaries,
  }
}
