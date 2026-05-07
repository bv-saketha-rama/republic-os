import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: '#0d1117',
          surface: '#161b22',
          surface2: '#1c2128',
          border: '#30363d',
          border2: '#21262d',
          text: '#e6edf3',
          muted: '#7d8590',
          accent: '#f78166',
          green: '#3fb950',
          red: '#f85149',
          yellow: '#d29922',
          blue: '#388bfd',
          purple: '#a371f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        slideIn: 'slideIn 0.4s cubic-bezier(.4,0,.2,1)',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
