'use client'
import { format, getUnixTime, parse } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { parse as parseMd } from 'marked'
import { useEffect, useMemo, useState } from 'react'
import { Summary } from 'src/app/types/Messages'

import * as Accordion from '@radix-ui/react-accordion'

import { Week } from './page'
import { SummaryDisplay } from './SummaryDisplay'

interface ParsedWeek {
  [key: string]: Week
}

export const SummaryAccordion = ({ weeks }: { weeks: Week[] }) => {
  const [parsedWeeks, setParsedWeeks] = useState<ParsedWeek>({})

  const weeksRef = useMemo(() => {
    const weekMap = new Map<string, Week & { id: string }>()

    weeks.forEach((w: Week) => {
      const timestamp = `${getUnixTime(parse(w.startsOn, 'MMMM d, yyyy', new Date()))}`

      weekMap.set(timestamp, { id: `week-${timestamp}`, ...w })
    })

    return weekMap
  }, [weeks])

  useEffect(() => {
    if (weeksRef.size === 0) return

    const observers = new Map<string, MutationObserver>()

    weeksRef.forEach((week, timestamp) => {
      const element = document.getElementById(week.id)

      if (!element) return

      const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-state' &&
            element.getAttribute('data-state') === 'open'
          ) {
            setParsedWeeks(parsedMap => {
              const summaries = week.summaries.map(s => ({ ...s, summary: parseMd(s.summary) }))

              return { ...parsedMap, [timestamp]: { ...week, summaries } }
            })

            observer.disconnect()
            observers.delete(timestamp)
          }
        }
      })

      observer.observe(element, { attributes: true, attributeFilter: ['data-state'] })
      observers.set(timestamp, observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [weeksRef])

  return (
    <Accordion.Root
      className="max-w-prose w-full mx-auto bg-mauve6 bg-darken p-4 rounded-lg"
      type="single"
      collapsible
    >
      {weeks.map((w: Week) => {
        const parsedTime = parse(w.startsOn, 'MMMM d, yyyy', new Date())
        const timestamp = `${getUnixTime(parsedTime)}`
        const linkId = `week-${format(parsedTime, 'yyyy-MM-dd')}`

        return (
          <>
            <span id={linkId} className="hiddenElm" />
            <Accordion.Item
              key={timestamp}
              value={timestamp}
              className="w-full"
              id={`week-${timestamp}`}
            >
              <Accordion.Header className="w-full">
                <Accordion.Trigger className="flex justify-between w-full accordionMain">
                  <span>Week of {w.startsOn}</span>
                  <ChevronDown className="accordionIcon" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="slideUp slideDown">
                {parsedWeeks[timestamp]
                  ? parsedWeeks[timestamp].summaries.map((s: Summary) => (
                      <SummaryDisplay key={`${getUnixTime(s.parsedDate)}`} isAccordion {...s} />
                    ))
                  : null}
              </Accordion.Content>
            </Accordion.Item>
          </>
        )
      })}
    </Accordion.Root>
  )
}
