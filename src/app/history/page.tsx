import './style.css'

import { parse } from 'marked'
import { Metadata } from 'next'
import { Layout } from 'src/components/Layout'
import { getData as getSummaries } from 'src/lib/serverOnly/getData'

export const revalidate = 43200

export const metadata: Metadata = {
  title: 'Message Summary - Dicengineers',
  description: 'Dicengineers Message Summary',
  openGraph: {
    images: [
      { url: '/messages.webp', width: 1600, height: 800, alt: 'Dicengineers.com Message Summary' },
      { url: '/message.jpg', width: 1600, height: 800, alt: 'Dicengineers.com Message Summary' },
    ],
    url: 'https://dicengineers.com',
  },
}

async function getData() {
  const summaryRes = await getSummaries('summaries')

  if (summaryRes) {
    return summaryRes.summaries as { date: string; summary: string }[]
  }

  return []
}

export default async function ShowCase() {
  const data = await getData()

  return (
    <Layout className="gap-10 my-10">
      <h2 className="text-3xl text-center">#main Summaries by date</h2>
      {data.map(({ date, summary }) => (
        <section key={date} className="max-w-prose mx-auto">
          <h3 className="text-2xl mb-4">{date}</h3>
          <div
            className="summary text-sm pl-6"
            dangerouslySetInnerHTML={{ __html: parse(summary) }}
          />
        </section>
      ))}
    </Layout>
  )
}
