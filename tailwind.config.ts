import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#001f3f',
        'accent-red': '#dc2626',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            background: '#f9fafb',
            foreground: '#001f3f',
            primary: {
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#dc2626',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
              DEFAULT: '#dc2626',
              foreground: '#ffffff',
            },
            secondary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#001f3f',
              600: '#001f3f',
              700: '#001830',
              800: '#001020',
              900: '#000810',
              DEFAULT: '#001f3f',
              foreground: '#ffffff',
            },
          },
        },
      },
    }),
  ],
};
export default config;
