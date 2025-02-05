/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "16px",
    },
    extend: {
      colors: {
        primary50: "#008ADA",
        "regal-gray": "#1F4247",
        "regal-dark": "#0D1D23",
        "regal-black": "#09141A",
        "regal-blue": "#62CDCB",
        "regal-sky": "#4599DB",
        "gold-300": "#D5BE88",
        "gold-400": "#FFE2BE",
        "gold-500": "#F8FAE5",
        "gold-600": "#F3EDA6",
        "gold-700": "#94783E",
        bck: "#162329",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      poppins: "Poppins",
      nunitoSans: "nunito sans",
      pacifico: "pacifico",
    },
  },
  plugins: [],
};
