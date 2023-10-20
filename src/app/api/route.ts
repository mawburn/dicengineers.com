import fetch from 'node-fetch'

const MAX_TOKENS = 81912

export async function GET() {
  const result: any[] = []

  let lastId = 1163487291315073134

  let end = false

  let count = 0

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
      const retryAfter = res.headers.get('Retry-After')
      if (retryAfter) {
        await new Promise(resolve => setTimeout(resolve, Number(retryAfter)))
        continue
      }
    }

    if (!res.ok) {
      end = true
      continue
    }

    const channel = (await res.json()) as any[]

    if (channel.length === 0) {
      end = true
      continue
    }

    result.push(...channel)
    lastId = channel[channel.length - 1].id
  }

  let dupeId = 0

  const grouped = result
    .sort((a: any, b: any) => a.id - b.id)
    .filter(obj => {
      if (obj.id !== dupeId) {
        dupeId = obj.id
        return true
      }
      return false
    })
    .reduce((acc, obj) => {
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
    }, {})

  const messages: Record<string, string[]> = {}

  Object.keys(grouped).forEach(key => {
    const _msg = grouped[key]
      .join('\n')
      .replace(/<[^>]*>|(\|\|)[^|]*(\|\|)/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')

    let tokens = _msg.split(' ')
    const messageArray = []

    while (tokens.length > MAX_TOKENS) {
      const slice = tokens.slice(0, MAX_TOKENS)
      messageArray.push(slice.join(' '))
      tokens = tokens.slice(MAX_TOKENS)
    }

    if (tokens.length > 0) {
      messageArray.push(tokens.join(' '))
    }

    messages[key] = messageArray as string[]
  })

  return Response.json(messages)
}
