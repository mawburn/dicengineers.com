import Image from 'next/image'
import { Aside } from 'src/components/Aside'
import { Info } from 'src/components/Info'
import { Layout } from 'src/components/Layout'
import { Overlay } from 'src/components/Overlay'

export default function Home() {
  return (
    <Layout className="md:flex-row md:justify-between flex-wrap gap-4">
      <Aside />
      <section className="flex flex-col justify-start grow">
        <Image src="/de.webp" width={480} height={480} alt="Dice Engine" loading="eager" />
        <Overlay />
      </section>
      <Info />
    </Layout>
  )
}
