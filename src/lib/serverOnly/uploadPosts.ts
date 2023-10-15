'use server'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const endpoint = 'https://nyc3.digitaloceanspaces.com'

export const uploadPosts = async (json: string) => {
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
    Body: json,
    ACL: 'private',
  }

  const uploadObject = async () => {
    try {
      const data = await s3Client.send(new PutObjectCommand(params))
      return data
    } catch (err) {
      console.error('Error', err)
    }
  }

  await uploadObject()
}
