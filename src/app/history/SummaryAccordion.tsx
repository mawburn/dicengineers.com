'use client'
import { format, getUnixTime, parse } from 'date-fns'
import { Summary } from 'src/app/types/Messages'

import { Week } from './page'
import { SummaryDisplay } from './SummaryDisplay'
import { Fragment } from 'react'
import { Divider } from 'src/components/Divider'

export const SummaryAccordion = ({ weeks }: { weeks: Week[] }) => {
  return weeks.map((w: Week) => {
    const parsedTime = parse(w.startsOn, 'MMMM d, yyyy', new Date())
    const timestamp = `${getUnixTime(parsedTime)}`
    const linkId = `week-${format(parsedTime, 'yyyy-MM-dd')}`
    return (
      <details
        id={linkId}
        key={timestamp}
        className="max-w-prose w-full mx-auto bg-mauve6 bg-darken p-4 rounded-lg cursor-pointer"
      >
        <summary>
          <span className="pl-4">Week of {w.startsOn}</span>
        </summary>
        {w.summaries.map((s: Summary, idx: number) => (
          <Fragment key={`${getUnixTime(s.parsedDate)}`}>
            <SummaryDisplay isAccordion {...s} />
            {idx !== w.summaries.length - 1 && <Divider />}
          </Fragment>
        ))}
      </details>
    )
  })
}
