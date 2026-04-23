export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          100: "#E8F0E4",
          400: "#7AAE65",
          500: "#5C8A48",
          600: "#4A7039",
        },
        terracotta: {
          100: "#F5E6DF",
          500: "#C07355",
          600: "#A85E42",
        },
        cream: {
          50: "#FEFDF8",
          100: "#F9F6ED",
        },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        soft: "0 4px 16px rgba(0,0,0,0.08)",
        lift: "0 8px 24px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
