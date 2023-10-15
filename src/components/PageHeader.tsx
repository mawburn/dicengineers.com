import Image from 'next/image'

interface PageHeaderProps {}

export const PageHeader = ({}: PageHeaderProps) => (
  <header className="flex justify-between items-center p-3 w-full">
    <div className="flex justify-center items-center">
      <Image
        className="pr-2"
        src="/de.svg"
        width={42}
        height={42}
        alt="Dicengineers"
        loading="eager"
      />{' '}
      <h1 className="text-xl">Dicengineers</h1>
    </div>
    <div />
  </header>
)
