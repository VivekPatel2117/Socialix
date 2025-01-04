/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        "49vw": "49vw", 
        "50vw": "50vw", 
      },
      height:{
        "80vh": "80dvh"
      },
    },
  },
  plugins: [],
}