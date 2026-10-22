import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Headings, logo and numbers
        display: ['var(--font-outfit)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand colour ("pitch green"); change this one line to re-theme the app
        pitch: colors.emerald,
        ink: colors.slate,
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 4px 16px -4px rgb(15 23 42 / 0.08)',
        lift: '0 2px 4px rgb(15 23 42 / 0.04), 0 12px 32px -8px rgb(15 23 42 / 0.16)',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // 'backwards' (not 'both'): keeping transform after the animation would make the element the
        // containing block for position:fixed children, so modals would no longer cover the viewport
        'fade-in-up': 'fade-in-up 0.25s ease-out backwards',
      },
    },
  },
  plugins: [],
};
export default config;
