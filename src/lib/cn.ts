import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

type Cn = string | undefined | null | { [key: string]: boolean }

export const cn = (...classes: Cn[]) => twMerge(clsx(classes))
