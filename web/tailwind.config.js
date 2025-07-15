/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pulsepay: {
          pink: "#E573B7",
          purple: "#7B61FF",
          gold: "#FFD166",
          white: "#FFFFFF",
          blue: "#232946",
          shadow: "#1A1A2E",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        heading: ["Inter", "Montserrat", "Poppins", "sans-serif"],
        body: ["Inter", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        'pulsepay-gradient': 'linear-gradient(135deg, #E573B7 0%, #7B61FF 60%, #FFD166 100%)',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%, 30%': { transform: 'scale(1.1)' },
          '20%, 40%': { transform: 'scale(0.95)' },
        },
        fadein: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slidein: {
          '0%': { transform: 'translateY(40px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        heartbeat: 'heartbeat 1.5s infinite',
        fadein: 'fadein 1s ease-in',
        slidein: 'slidein 0.8s cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
}; 