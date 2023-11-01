import clsx from 'clsx'
import { format, getUnixTime } from 'date-fns'
import { Summary } from 'src/app/types/Messages'

export const SummaryDisplay = ({
  date,
  summary,
  parsedDate,
  isAccordion = false,
}: Summary & { isAccordion?: boolean }) => {
  return (
    <section
      key={`${getUnixTime(parsedDate)}`}
      id={format(parsedDate, 'yyyy-MM-dd')}
      className={clsx(
        !isAccordion && 'bg-darken shadow-lg border-2 border-darken rounded-lg',
        `max-w-prose mx-auto w-full p-2`
      )}
    >
      <h3 className="text-2xl mb-4">{date}</h3>
      <div className="summary text-sm pl-6" dangerouslySetInnerHTML={{ __html: summary }} />
    </section>
  )
}
