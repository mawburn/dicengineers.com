import { addHours, compareAsc, formatISO, parse, startOfDay } from 'date-fns'
import fetch from 'node-fetch'
import ExtApi from 'openai'
import { getData } from 'src/lib/serverOnly/getData'
import { upload } from 'src/lib/serverOnly/upload'

import type { AIMessage, MessageSummary, Summary } from 'src/app/types/Messages'
import type { FetchResponse } from 'src/app/types/types'
import type { DiscordMessage } from 'src/app/types/Discord'

const MAX_TOKENS = 81912 as const

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({
      status: 404,
    })
  }

  // const summaryData = (await getData('summaries')) as MessageSummary
  // const discordData = (await getData('discord')) as DiscordMessage
  // const messages = getMessages(discordData, summaryData)
  // const summariesRaw = await generateSummaries(discordData)

  // const summaries = sortByDate([...data.summaries, ...summariesRaw])

  // const newData = {
  //   lastId: messages[messages.length - 1].id,
  //   summaries,
  // }

  // upload(JSON.stringify(newData), 'summaries')

  // return Response.json(newData)
}

// async function generateSummaries(grouped: Record<string, string[]>, data: MessageSummary) {
//   const extApi = new ExtApi({
//     apiKey: process.env.API_KEY,
//     maxRetries: 10,
//   })

//   const summaries: { date: string; summary: string }[] = []

//   for (const k in grouped) {
//     const messages = grouped[k].join('\n').split(' ')
//     const messageArr: string[] = []
//     let index = 0

//     while (index < messages.length) {
//       messageArr.push(messages.slice(index, index + MAX_TOKENS).join(' '))
//       index += MAX_TOKENS
//     }

//     for (const content of messageArr) {
//       const aiMessages: AIMessage[] = [
//         {
//           role: 'system',
//           content:
//             'Give me the BRIEFEST possible summary of the conversation in the given chat and return it in a bulleted list. You do not need to do line by line, you can combine multiple messages from a user and just give an overall VERY BRIEF summary of the conversation. The format will be:\n(username):(message)\n(username:)(message)\n and so on. Do not include any personal information, except usernames and urls. Wrap usernames in double stars ie: **username** when used.',
//         },
//         {
//           role: 'user',
//           content,
//         },
//       ]

//       const aiRes = await extApi.chat.completions.create({
//         model: 'gpt-4',
//         messages: aiMessages,
//         temperature: 0.5,
//         max_tokens: 500,
//         frequency_penalty: 1,
//         presence_penalty: 0.25,
//       })

//       if (aiRes.choices[0].message.content) {
//         const idx = data.summaries.findIndex((s: Summary) => s.date === k)

//         if (idx > -1) {
//           const overlap = findOverlap(data.summaries[idx].summary, aiRes.choices[0].message.content)
//           const nonOverlappingPart = aiRes.choices[0].message.content.substring(overlap.length)
//           data.summaries[idx].summary += nonOverlappingPart
//         } else {
//           summaries.push({ date: k, summary: aiRes.choices[0].message.content })
//         }
//       }
//     }
//   }

//   return summaries
// }

// async function handleRateLimit(res: FetchResponse) {
//   const retryAfter = res.headers.get('Retry-After')
//   if (retryAfter) {
//     await new Promise(resolve => setTimeout(resolve, Number(retryAfter)))
//   }
// }

// function sortByDate(summaries: Summary[]): Summary[] {
//   const now = startOfDay(addHours(new Date(), -5))

//   return summaries
//     .map(s => ({
//       ...s,
//       date: formatISO(addHours(parse(s.date, 'MMMM d, yyyy', new Date()), -5)),
//     }))
//     .filter(s => startOfDay(parse(s.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", new Date())) < now)
//     .sort((a, b) => {
//       const dateA = parse(a.date, 'MMMM d, yyyy', new Date())
//       const dateB = parse(b.date, 'MMMM d, yyyy', new Date())
//       return compareAsc(dateA, dateB)
//     })
// }
