import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f0f14',
          secondary: '#1a1a24',
          card: '#1e1e2e',
          hover: '#252535',
        },
        accent: {
          red: '#c0392b',
          'red-light': '#e74c3c',
          gold: '#d4a017',
          'gold-light': '#f1c40f',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#9090a8',
          muted: '#5a5a78',
        },
        border: {
          subtle: '#2a2a3e',
          DEFAULT: '#333350',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
