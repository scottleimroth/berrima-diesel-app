/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Berrima Diesel brand colors
        // Primary: Berrima logo yellow/gold
        'brand-yellow': '#FFD700',      // Primary yellow/gold from Berrima logo
        'brand-gold': '#D4A84B',        // Warm heritage gold
        'brand-amber': '#C68E17',       // Rich amber

        // Australian flag colors
        'brand-navy': '#00205B',        // Australian flag navy blue
        'brand-blue': '#012169',        // Deep blue (Union Jack)
        'brand-red': '#C8102E',         // Australian flag red
        'brand-white': '#FFFFFF',       // Clean white

        // Earth & country heritage colors
        'brand-ochre': '#CC7722',       // Australian ochre/burnt orange
        'brand-tan': '#D2B48C',         // Outback tan
        'brand-brown': '#6B4423',       // Rich earth brown
        'brand-cream': '#FFF8E7',       // Warm heritage cream
        'brand-eucalyptus': '#4A6741',  // Bush green
        'brand-dust': '#C4A484',        // Dusty road tan

        // UI colors
        'brand-dark': '#2D2A26',        // Warm dark (charcoal with brown)
        'brand-gray': '#5D534A',        // Warm body text gray
        'brand-light': '#FAF6F0',       // Warm off-white background

        // Semantic colors
        'success': '#22c55e',           // Cheap fuel indicators
        'warning': '#f59e0b',           // Medium pricing
      },
      fontFamily: {
        'headline': ['Oswald', 'Roboto Condensed', 'sans-serif'],
        'body': ['Roboto', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
