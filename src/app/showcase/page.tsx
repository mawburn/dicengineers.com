import { Metadata } from 'next'
import { Layout } from 'src/components/Layout'
import { ShowCaseList } from 'src/components/ShowCaseList'

export const metadata: Metadata = {
  title: 'Showcase - Dicengineers',
  description: 'Showcase of projects by members of Dicengineers',
  openGraph: {
    images: [
      { url: '/showcaseog.webp', width: 1600, height: 800, alt: 'Dicengineers.com Showcase' },
      { url: '/showcaseog.jpg', width: 1600, height: 800, alt: 'Dicengineers.com Showcase' },
    ],
    url: 'https://dicengineers.com',
  },
}

export default function ShowCase() {
  return (
    <Layout className="gap-10 my-10">
      <ShowCaseList />
    </Layout>
  )
}
