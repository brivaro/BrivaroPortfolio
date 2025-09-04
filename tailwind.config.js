/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        gray4: "#ced4da",
        gray7: "#495057",
        gray8: "#343a40",
        gray9: "#212529",
        cyan: "#438e96",
        cyan2: "#5FAAB1",
        cyan8: "#0c8599",
        teal8: "#099268",
      },
      fontFamily: {
        sans: ["Figtree", "sans-serif"],
        RedHat: ["Red Hat Display", "sans-serif"],
      },
      gridTemplateColumns: {
        "aboutme-layout": "1fr 300px",
      },
      keyframes: {
        scroll: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        scroll: 'scroll var(--animation-duration) linear infinite',
      }
    },
  },
  plugins: [],
};
