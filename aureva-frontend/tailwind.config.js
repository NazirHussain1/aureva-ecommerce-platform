export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: {
            DEFAULT: '#DB2777',
            light: '#EC4899',
            dark: '#BE185D',
          },
          purple: {
            DEFAULT: '#9333EA',
            light: '#A855F7',
            dark: '#7E22CE',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideInUp': 'slideInUp 0.4s ease-out',
        'slideInDown': 'slideInDown 0.4s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'modalFadeIn': 'modalFadeIn 0.3s ease-out',
      },
      keyframes: {
        blob: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': {
            transform: 'translate(20px, -50px) scale(1.1)',
          },
          '50%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '75%': {
            transform: 'translate(50px, 50px) scale(1.05)',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px) scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        slideInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        modalFadeIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.95) translateY(-20px)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
