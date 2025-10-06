
module.exports = {
  
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
      'primary': '#FF8000',
        'orange-mge':'#ff3d08',
        'secondary':'#181818',
        'dark':'#1f2020',
        'dark-gray':'#5E656D',
      },
      fontFamily: {
        "circular-web": ["circular-web", "sans-serif"],
        zentry: ['zentry', 'sans-serif'],
        "ea-football": ['ea-football', 'sans-serif'],
        "street-fighter": ['street-fighter', 'sans-serif'],
        "free-fire": ['free-fire', 'sans-serif'],
        custom: ['nightWarrior', 'sans-serif'],
        pilot: ['pilot', 'sans-serif'],
        juvanze: ['juvanze', 'sans-serif'],
        valorant: ['valorant', 'sans-serif']

      },
    },
  },
  plugins: [],
}