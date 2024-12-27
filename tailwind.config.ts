import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ferrari: "#e80020",
        mercedes: "#27f4d2",
        redbull: "#3671c6",
        mclaren: "#ff8000",
        "aston-martin": "#229971",
        haas: "#b6babd",
        rb: "#6692ff",
        williams: "#64c4ff",
        alpine: "#0093cc",
        sauber: "#00E701",
      },
    },
  },
  plugins: [],
} satisfies Config;
