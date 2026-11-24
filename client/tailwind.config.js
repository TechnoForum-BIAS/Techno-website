/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#070B19',        // Deepest navy background
          card: '#0D1527',      // Elevated surface
          cardHover: '#131F38', // Hover state
          border: '#1E293B',    // Border lines
          blue: '#2563EB',      // Primary royal blue
          cyan: '#38BDF8',      // Electric cyan highlight
          indigo: '#6366F1',    // Accent violet/indigo
          muted: '#94A3B8'      // Secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
