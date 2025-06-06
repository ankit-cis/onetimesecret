import { FontFamily } from '@/schemas';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * Tailwind CSS Configuration
 *
 **/

export default {
  content: [
    /**
     * `content` (Array): tells Tailwind CSS where to look for class
     * names to generate styles.
     *
     * - The `content` array specifies the paths to the files Tailwind
     *   should scan for class names.
     * - "./src/demo.html": Tailwind will scan this specific HTML file
     *   for class names.
     * - `"./src/*.{vue,js,ts,jsx,tsx}"`: Tailwind will also scan all
     *   files in the `src` directory (and subdirectories) with the
     *   extensions vue, js, ts, jsx, and tsx.
     *
     * Why does this matter?
     * - Tailwind generates CSS for the class names it finds in these
     *   files. If a file is listed, Tailwind looks inside it for class
     *   names to style.
     * - If "demo.html" exists, Tailwind includes styles for classes
     *   found in it. If it doesn't, those styles won't be generated.
     * - This setup helps keep the final CSS file size small because
     *   Tailwind only generates styles for class names it actually
     *   finds in these files.
     *
     * ELI10:
     * Imagine you're drawing pictures but only want to use colors you
     * see in your coloring books (files). You tell Tailwind (your color
     * finder) to look in specific books ("demo.html" and others in
     * `src`). Tailwind then makes sure you have just the right colors
     * (styles) for the pictures you're actually going to color (class
     * names in those files).
     *
     * ELIDELANO:
     * Make sure that demo.html is included in the content array so that
     * Tailwind CSS can generate styles for the classes found in it. And
     * make sure that it is up to date with header.html and footer.html.
     * Without demo.html, there was no <body> tag in the Vue app, and the
     * styles for the body tag were not generated. This causes the app to
     * display darkmode styles in bits and pieces rather than the whole
     * page for example. OR alternatively, include the rack app template
     * files in the content array as well.
     *
     */
    './src/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx,mjs}',
    './templates/web/**/*.html',
  ],

  darkMode: 'class',
  theme: {
    fontFamily: {
      serif: defaultTheme.fontFamily.sans,
      sans: ['Open Sans Regular'],
      sansBold: ['Open Sans SemiBold'],
      /* In CSS: font-family: theme('fontFamily.brand'); */
      brand: ['Effra', ...defaultTheme.fontFamily.sans],
      mono: defaultTheme.fontFamily.mono,
    },
    extend: {
      colors: {
        // https://javisperez.github.io/tailwindcolorshades/?flamingo=dc4a22&guardsman-red=23b5dd
        brand: {
          50: '#fcf8f2',
          100: '#fcf4e8',
          200: '#f7dec3',
          300: '#f0c39e',
          400: '#e68b5e',
          500: '#ed8c22',
          600: '#c43d1b',
          700: '#a32d12',
          800: '#85200c',
          900: '#631507',
          950: '#400b03',
        },
        branddim: {
          '50': '#fcf8f2',
          '100': '#faf0e3',
          '200': '#f0d7bd',
          '300': '#e8bb99',
          '400': '#d67e56',
          '500': '#ed8c22',
          '600': '#b03317',
          '700': '#94270f',
          '800': '#751b09',
          '900': '#591205',
          '950': '#380902',
        },
        brandcomp: {
          50: '#f2fbfc',
          100: '#e8fafc',
          200: '#c3f0f7',
          300: '#a0e6f2',
          400: '#5fcfe8',
          500: '#23b5dd',
          600: '#1c9cc7',
          700: '#1478a6',
          800: '#0d5985',
          900: '#073b63',
          950: '#032140',
        },
        brandcompdim: {
          '50': '#f2fbfc',
          '100': '#e3f7fa',
          '200': '#bfebf2',
          '300': '#99dae8',
          '400': '#57bdd9',
          '500': '#1c9cc7',
          '600': '#1786b3',
          '700': '#0f6594',
          '800': '#0a4c78',
          '900': '#053359',
          '950': '#021e3b',
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'kitt-rider': 'kitt-rider 3s linear infinite',
        'gradient-x': 'gradient-x 5s ease-in-out infinite',
      },
      keyframes: {
        'kitt-rider': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 100%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 100%',
            'background-position': 'right center',
          },
        },
      },
      backgroundSize: {
        '200%': '200% 100%',
      },
    },
    // Don't mess with the scaling. rem == root em (ie. <html>). Everything is relative to that.
    //fontSize: {
    //  'sm': '0.9rem',
    //  'base': '1rem',
    //  'lg': '1.25rem',
    //  'xl': '1.30rem',
    //  '2xl': '1.563rem',
    //  '3xl': '1.953rem',
    //  '4xl': '2.441rem',
    //  '5xl': '3.052rem',
    //}
  },
  plugins: [
    forms(),
    typography(),
    function ({ addBase }: { addBase: (config: any) => void }) {
      addBase({
        '@font-face': [
          {
            FontFamily: 'Open Sans Regular',
            src: "url('./fonts/Open_Sans/static/OpenSans-Regular.ttf') format('ttf')",
            fontWeight: '400',
            fontStyle: 'normal',
            fontDisplay: 'fallback',
          },
          {
            FontFamily: 'Open Sans SemiBold',
            src: "url('./fonts/Open_Sans/static/OpenSans-SemiBold.ttf') format('ttf')",
            fontWeight: '400',
            fontStyle: 'normal',
            fontDisplay: 'fallback',
          },
        ],
      });
    },
  ],
};
