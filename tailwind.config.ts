import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "-apple-system", "sans-serif"],
        cinzel: ["var(--font-cinzel)", "serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        wedding: {
          crimson: {
            DEFAULT: "#8B1E3F",
            dark: "#4A0E17",
            light: "#A31D1D",
            gold: "#D4AF37"
          },
          gold: {
            DEFAULT: "#D4AF37",
            dark: "#AA7C11",
            light: "#F3E5AB",
            bright: "#FFD700"
          },
          ivory: {
            DEFAULT: "#FCFBF7",
            warm: "#F5F2EB",
          },
          burgundy: "#2D050B",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "wedding-gradient": "linear-gradient(135deg, #4A0E17 0%, #8B1E3F 50%, #A31D1D 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFF9E6 0%, #F3E5AB 30%, #D4AF37 70%, #AA7C11 100%)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;

