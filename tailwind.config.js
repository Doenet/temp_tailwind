/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
    "./src/Tools/temp/index.html",
    "./src/Tools/test/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

