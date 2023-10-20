import fetch from 'node-fetch'
import ExtApi from 'openai'
import messagesJson from './data.json'

const MAX_TOKENS = 81912

export async function GET(req: Request) {
  const apikey = req.headers.get('Authorization')

  if (apikey !== process.env.KEY) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // const result: any[] = []

  // let lastId = 1163487291315073134

  // let end = false

  // while (!end) {
  //   const res = await fetch(
  //     `https://discord.com/api/channels/1163251543861100615/messages?after=${lastId}`,
  //     {
  //       headers: {
  //         Authorization: `Bot ${process.env.DISCORD}`,
  //       },
  //     }
  //   )

  //   if (res.status === 429) {
  //     const retryAfter = res.headers.get('Retry-After')
  //     if (retryAfter) {
  //       await new Promise(resolve => setTimeout(resolve, Number(retryAfter)))
  //       continue
  //     }
  //   }

  //   if (!res.ok) {
  //     end = true
  //     continue
  //   }

  //   const channel = (await res.json()) as any[]

  //   if (channel.length === 0) {
  //     end = true
  //     continue
  //   }

  //   result.push(...channel)
  //   lastId = channel[channel.length - 1].id
  // }

  // let dupeId = 0

  // const grouped = result
  //   .sort((a: any, b: any) => a.id - b.id)
  //   .filter(obj => {
  //     if (obj.id !== dupeId) {
  //       dupeId = obj.id
  //       return true
  //     }
  //     return false
  //   })
  //   .reduce((acc, obj) => {
  //     const date = new Date(obj.timestamp)
  //     const key = date.toLocaleDateString('en-US', {
  //       month: 'long',
  //       day: 'numeric',
  //       year: 'numeric',
  //     })

  //     if (!acc[key]) {
  //       acc[key] = []
  //     }

  //     acc[key].push(`${obj.author.username}: ${obj.content}`)

  //     return acc
  //   }, {})

  // const messages: Record<string, string[]> = {}

  // Object.keys(grouped).forEach(key => {
  //   const _msg = grouped[key]
  //     .join('\n')
  //     .replace(/<[^>]*>|(\|\|)[^|]*(\|\|)/g, '')
  //     .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')

  //   let tokens = _msg.split(' ')
  //   const messageArray = []

  //   while (tokens.length > MAX_TOKENS) {
  //     const slice = tokens.slice(0, MAX_TOKENS)
  //     messageArray.push(slice.join(' '))
  //     tokens = tokens.slice(MAX_TOKENS)
  //   }

  //   if (tokens.length > 0) {
  //     messageArray.push(tokens.join(' '))
  //   }

  //   messages[key] = messageArray as string[]
  // })

  const extApi = new ExtApi({
    apiKey: process.env.API_KEY,
    maxRetries: 10,
  })

  const summary: { date: string; summary: string }[] = []

  const messages = messagesJson as Record<string, string[]>

  let start = true

  for (const k in messages) {
    if (!start) {
      await new Promise(resolve => setTimeout(resolve, 10000))
    }
    start = false

    const messageArr = messages[k]

    for (const content of messageArr) {
      const aiMessages: any[] = [
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
        summary.push({ date: k, summary: aiRes.choices[0].message.content })
      }
    }
  }

  return Response.json(summary)
}
