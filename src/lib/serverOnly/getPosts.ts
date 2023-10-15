'use server'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

const endpoint = 'https://nyc3.digitaloceanspaces.com'

export const getPosts = async () => {
  const s3Client = new S3Client({
    endpoint,
    forcePathStyle: false,
    region: 'nyc3',
    credentials: {
      accessKeyId: process.env.DG_KEY!,
      secretAccessKey: process.env.DG_SECRET!,
    },
  })

  const params = {
    Bucket: 'tabletopcdn',
    Key: 'dice/data.json',
  }

  const getObject = async () => {
    try {
      const data = await s3Client.send(new GetObjectCommand(params))
      const bodyContents = await streamToString(data.Body)
      return JSON.parse(bodyContents)
    } catch (err) {
      console.error('Error', err)
    }
  }

  return await getObject()
}

const streamToString = (stream: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on('data', (chunk: any) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}
