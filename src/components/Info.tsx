import { MessagesSquare } from 'lucide-react'

import { Divider } from './Divider'
import Image from 'next/image'
import { shuffleArray } from 'src/lib/shuffle'

interface Item {
  title: string
  url: string
}

const items: Item[] = [
  { title: 'Typescript', url: 'ts.svg' },
  { title: 'JavaScript', url: 'js.svg' },
  { title: 'Kotlin', url: 'kotlin.svg' },
  { title: 'React', url: 'react.svg' },
  { title: 'Android', url: 'android.svg' },
  { title: 'Apple', url: 'apple.svg' },
  { title: 'Svelte', url: 'svelte.svg' },
  { title: 'Vue', url: 'vue.svg' },
  { title: 'NodeJS', url: 'nodejs.svg' },
  { title: 'Python', url: 'python.svg' },
  { title: 'Rust', url: 'rust.svg' },
  { title: 'Visual Studio Code', url: 'vsc.svg' },
  { title: 'Figma', url: 'figma.svg' },
  { title: 'Ruby on Rails', url: 'rails.svg' },
  { title: 'GoLang', url: 'golang.svg' },
  { title: 'TailwindCSS', url: 'tailwind.svg' },
  { title: 'NextJS', url: 'nextjs.svg' },
  { title: 'Angular', url: 'angular.svg' },
]

export const Info = () => (
  <aside className="flex flex-col gap-8 px-4 pt-4 min-w-prose md:pt-14 grow md:w-40 items-center">
    <section className="flex flex-col items-center">
      <h2 className="flex gap-2 text-center text-2xl pb-2">
        Join us! <MessagesSquare size={28} />
      </h2>
      <p className="text-center text-sm">
        Connect with fellow developers, software engineers, UI/UX designers, and other creative tech
        enthusiasts who share a love for tabletop games.
      </p>
    </section>
    <Divider className="my-0" />
    <section>
      <h2 className="text-center text-2xl pb-2">Who are we?</h2>
      <p className="text-center text-sm">
        We’re a community of passionate creators. Not only do we adore tabletop games, but we also
        thrive on crafting innovative tools and additions for our gaming experiences.
      </p>
    </section>
    <Divider className="my-0" />
    <section>
      <h2 className="flex justify-center items-center gap-2 text-2xl pb-2">
        Pick your poison <Image src="/poison.svg" width={28} height={42} alt="Poison Icon" />
      </h2>
      <p className="text-center text-sm">
        Whether you’re a newbie developer smitten with <strong>D&D</strong>, a veteran immersed in{' '}
        <strong>Warhammer 40k Harlequins</strong>, or a hobbyist designer captivated by{' '}
        <strong>Magic: The Gathering</strong>... if you love meshing your hobbies, we’re the spot
        you’ve been searching for.
      </p>
      <p className="text-center text-sm mt-2">
        We’re an inclusive community welcoming all skill levels and backgrounds. Whether you need
        help, support, or just a chat, we’re here for you.
      </p>
    </section>
    <Divider className="my-0" />
    <section className="flex flex-wrap justify-center items-center gap-4">
      {shuffleArray(items).map(({ title, url }) => (
        <Image
          key={title}
          src={`/prog/${url}`}
          width={32}
          height={32}
          alt={`${title} Logo`}
          title={title}
        />
      ))}
    </section>
  </aside>
)
