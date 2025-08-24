module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["ubuntu", "sans-serif"], // fallback = sans
        poppins: ["poppins", "sans-serif"], // fallback = sans
        josefin: ["josefin", "sans-serif"], // fallback = sans
      },
    },
  },
  plugins: [],
};
