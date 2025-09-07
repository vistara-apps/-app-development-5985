/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220, 98%, 61%)',
        accent: 'hsl(164, 98%, 39%)',
        secondary: 'hsl(220, 14%, 71%)',
        success: 'hsl(134, 61%, 41%)',
        warning: 'hsl(43, 94%, 54%)',
        error: 'hsl(0, 78%, 52%)',
        surface: 'hsl(0, 0%, 100%)',
        background: 'hsl(0, 0%, 98%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(220,18%,12%,0.12)',
        'popover': '0 16px 48px hsla(220,18%,12%,0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 250ms cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}