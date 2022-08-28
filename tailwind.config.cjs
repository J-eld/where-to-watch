/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'search-icon': "url('/searchIcon.svg')",
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child-img', '& img');
      addVariant('child-span', '& span');
    }
  ],
};
