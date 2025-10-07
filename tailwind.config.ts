import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#050440',
        primary: '#001F3F',
        secondary: '#0A2E5C',
        'accent-1': '#00BFFF',
        'accent-2': '#38BDF8',
        'neutral-light': '#F8FAFC',
        'neutral-dark': '#1E293B',
        'text-primary-dark': '#FFFFFF',
        'text-primary-light': '#0F172A',
        'border-subtle': '#E2E8F0',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
