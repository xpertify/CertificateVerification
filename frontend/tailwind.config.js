/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    colors: {
      ink: '#0F1B33',
      parchment: '#F7F5F0',
      surface: '#FFFFFF',
      brass: '#B8924A',
      slate: '#5B6472',
      hairline: '#D9D5CC',
      verified: '#1F7A4D',
      revoked: '#C7821E',
      invalid: '#B23B3B',
      neutral: '#8A8478',
      white: '#FFFFFF',
      transparent: 'transparent',
      // tint variants for result card backgrounds
      'verified-tint': '#EBF5EF',
      'revoked-tint': '#FDF3E7',
      'invalid-tint': '#FBEAEA',
      'neutral-tint': '#F4F3F1',
    },
    fontFamily: {
      display: ['"Source Serif 4"', 'Georgia', 'serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'monospace'],
    },
    borderRadius: {
      btn: '6px',
      card: '10px',
      full: '9999px',
      none: '0',
    },
    maxWidth: {
      content: '1040px',
      form: '420px',
      verify: '640px',
    },
    extend: {
      spacing: {
        18: '4.5rem',
      },
      fontSize: {
        mono: ['0.9375rem', { letterSpacing: '0.01em' }],
      },
      boxShadow: {
        card: '0 2px 12px rgba(15, 27, 51, 0.08)',
      },
    },
  },
  plugins: [],
};
