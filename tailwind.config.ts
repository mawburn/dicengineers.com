import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      bgColor: '#1E222C',
      fontColor: '#F1F1EB',
      primary: '#6D7682',
      secondary: '#A09DA8',
      tertiary: '#7F828F'
    },
  },
  plugins: [],
}
export default config
