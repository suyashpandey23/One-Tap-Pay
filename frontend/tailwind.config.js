/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "inset-custom": "inset 0 0 0 2px #6c6c6b",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover"],
      transitionProperty: ["hover"],
    },
  },
  plugins: [],
};
