import './style.css'

import {
  addHours,
  compareDesc,
  differenceInSeconds,
  format,
  getWeek,
  parse,
  set,
  startOfWeek,
  subHours,
} from 'date-fns'
import { parse as parseMd } from 'marked'
import { Metadata } from 'next'
import { Layout } from 'src/components/Layout'
import { getData as getSummaries } from 'src/lib/serverOnly/getData'

import { SummaryAccordion } from './SummaryAccordion'
import { SummaryDisplay } from './SummaryDisplay'

import type { Summary } from 'src/app/types/Messages'

export const revalidate = 7200
export interface Week {
  startsOn: string
  summaries: Summary[]
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
    const weekNow = getWeek(new Date())

    const summaryMapped = summaryRes.summaries
      .map((s: Summary) => {
        const parsedDate = parse(s.date, 'MMMM d, yyyy', new Date())
        return {
          date: s.date,
          parsedDate,
          summary: parseMd(s.summary),
        }
      })
      .sort((a: Summary, b: Summary) => compareDesc(a.parsedDate, b.parsedDate))

    const currentWeek: Week = {
      startsOn: format(new Date(), 'MMMM d, yyyy'),
      summaries: [],
    }

    const otherWeeks: Map<string, Summary[]> = new Map()

    summaryMapped.forEach((s: Summary) => {
      if (getWeek(s.parsedDate!) === weekNow) {
        currentWeek.summaries.push(s)
      } else {
        const weekStart = format(startOfWeek(s.parsedDate), 'MMMM d, yyyy')
        const startWeek = otherWeeks.get(weekStart)

        if (startWeek !== undefined) {
          startWeek.push(s)
          otherWeeks.set(weekStart, startWeek)
        } else {
          otherWeeks.set(weekStart, [s])
        }
      }
    })

    const weekArray: Week[] = Array.from(otherWeeks.entries()).map(([startsOn, summaries]) => {
      return {
        startsOn,
        summaries,
      }
    })

    return { currentWeek, otherWeeks: weekArray }
  }

  return []
}

interface SummaryData {
  currentWeek: Week
  otherWeeks: Week[]
}

export default async function ShowCase() {
  const { currentWeek, otherWeeks } = (await getData()) as SummaryData

  return (
    <Layout className="gap-10 my-10">
      <h2 className="text-3xl text-center">
        <span className="font-mono inline-block">#main</span> Summaries by date
      </h2>
      {currentWeek.summaries.map(props => (
        <SummaryDisplay key={props.date} {...props} />
      ))}

      <SummaryAccordion weeks={otherWeeks} />
    </Layout>
  )
}
