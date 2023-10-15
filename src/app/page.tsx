import Image from 'next/image'
import { Aside } from 'src/components/Aside'
import { Info } from 'src/components/Info'
import { Layout } from 'src/components/Layout'
import { Overlay } from 'src/components/Overlay'

export default function Home() {
  return (
    <Layout className="md:flex-row md:justify-between flex-wrap gap-4">
      <Aside />
      <section className="flex flex-col justify-center grow">
        <Image
          src="/center.webp"
          width={480}
          height={480}
          alt="Dice Engine"
          placeholder="blur"
          blurDataURL="/center-blur.webp"
          loading="eager"
        />
        <Overlay />
      </section>
      <Info />
    </Layout>
  )
}
