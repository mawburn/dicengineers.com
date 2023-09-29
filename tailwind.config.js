import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        darkColor: '#343433',
        lightColor: '#F8F5E3',
        primary: '#69C5A9',
        secondary: '#D27F4F',
        darkSecondary: '#30292B'
      },
    },
  },
  plugins: [],
}
export default config
