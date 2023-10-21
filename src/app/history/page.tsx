import './style.css'

import { parse } from 'marked'
import { Metadata } from 'next'
import { Layout } from 'src/components/Layout'
import { getData as getSummaries } from 'src/lib/serverOnly/getData'

export const revalidate = 3600

interface Summary {
  date: string
  summary: string
}

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
    const summaryResponse = summaryRes.summaries.map((s: Summary) => ({
      date: s.date,
      summary: parse(s.summary),
    }))

    return summaryResponse
  }

  return []
}

export default async function ShowCase() {
  const data = (await getData()) as Summary[]

  return (
    <Layout className="gap-10 my-10">
      <h2 className="text-3xl text-center">
        <span className="font-mono inline-block">#main</span> Summaries by date
      </h2>
      {data.map(({ date, summary }) => (
        <section
          key={date}
          className="max-w-prose mx-auto bg-darken rounded-lg border-2 border-darkPrimary shadow-lg p-2"
        >
          <h3 className="text-2xl mb-4">{date}</h3>
          <div className="summary text-sm pl-6" dangerouslySetInnerHTML={{ __html: summary }} />
        </section>
      ))}
    </Layout>
  )
}
