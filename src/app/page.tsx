import Image from 'next/image'
import { Aside } from 'src/components/Aside'
import { Info } from 'src/components/Info'
import { Layout } from 'src/components/Layout'
import { Overlay } from 'src/components/Overlay'

export default function Home() {
  return (
    <Layout className="flex-row justify-between gap-4">
      <Aside />
      <section className="flex flex-col justify-center grow">
        <Image src="/center.webp" width={480} height={480} alt="Dice Engine" />
        <Overlay />
      </section>
      <Info />
    </Layout>
  )
}
