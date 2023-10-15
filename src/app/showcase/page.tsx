import { Layout } from 'src/components/Layout'
import { OuterLink } from 'src/components/OuterLink'

const classes = 'flex flex-col justify-center items-center' as const

export default function ShowCase() {
  return (
    <Layout className="gap-10 mt-10">
      <section className={classes}>
        <h2 className="text-2xl text-center mb-4">Tabletop RPGs</h2>
        <ul className="flex flex-col gap-2 list-disc text-sm">
          <li>
            <OuterLink
              url="https://fluxfall.thegame.tools/"
              title="Fluxfall Horizon - Powered by the Apocalypse game by Dave Thaumavore"
            >
              Fluxfall Horizon Generators
            </OuterLink>
          </li>
          <li>
            <OuterLink
              url="https://github.com/mawburn/across-a-thousand-dead-worlds-data"
              title="A data repository for Across a Thousand Deadworlds by Blackoath Entertainment"
            >
              Across a Thousand Dead Worlds - Data repository
            </OuterLink>
          </li>
        </ul>
      </section>
      <section className={classes}>
        <h2 className="text-2xl text-center mb-4">Boardgames</h2>
        Coming Soon...
        {/* <ul className="list-disc">
          <li></li>
        </ul> */}
      </section>
      <section className={classes}>
        <h2 className="text-2xl text-center mb-4">Wargames</h2>
        Coming Soon...
        {/* <ul className="list-disc">
          <li></li>
        </ul> */}
      </section>
      <section className={classes}>
        <h2 className="text-2xl text-center mb-4">Other</h2>
        Coming Soon...
        {/* <ul className="list-disc">
          <li></li>
        </ul> */}
      </section>
    </Layout>
  )
}
