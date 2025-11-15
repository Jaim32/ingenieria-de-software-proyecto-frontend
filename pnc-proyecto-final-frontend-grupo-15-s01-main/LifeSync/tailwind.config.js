/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,js,jsx,ts,tsx}'
  ],
  
  safelist:['bg-primary','bg-accent','text-primary','text-secondary',],

  darkMode: 'class',

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },

      /* Paleta — SÓLO las que vamos a referenciar en las utilidades */
      colors: {
        'nutri-accent': 'rgb(var(--color-accent-500)   / <alpha-value>)',
        'nutri-warning': 'rgb(var(--color-warning-500)  / <alpha-value>)',
        'nutri-success': 'rgb(var(--color-success-500)  / <alpha-value>)',
        'nutri-secondary': 'rgb(var(--color-secondary-600)/ <alpha-value>)',
        'nutri-primary': 'rgb(var(--color-primary-600)  / <alpha-value>)',
        'nutri-water': 'hsl(var(--color-water-500)    / <alpha-value>)'
      }
    }
  },

  /* ⬇️ Clases que *jamás* deben purgarse, jamas como lo que fue elias no equipo en nuestro proyecto */
  safelist: [
    // barras de la timeline, timeline que no sobrevivio nuestro querido amigo elias no equipo
    'bg-nutri-accent',
    'bg-nutri-warning',
    'bg-nutri-success',
    'bg-nutri-secondary',

    // textos auxiliares, para auxiliar a nuestro querido amigo elias no equipo
    'text-nutri-accent',
    'text-nutri-warning',
    'text-nutri-success',
    'text-nutri-secondary',

    // strokes de los “rings”
    'stroke-chart-bg',
    'stroke-chart-calories',
    'stroke-chart-warning',

    // utilidades base
    { pattern: /^bg-(surface|background)$/ },
    { pattern: /^text-(primary|secondary)$/ },
    { pattern: /^bg-nutri-(accent|warning|success|secondary)$/ },
    'border-border'
  ],

  plugins: [
    ({ addUtilities, theme }) => {
      /* Helpers */
      const bg = (t) => ({ backgroundColor: theme(`colors.${t}`) });
      const tx = (t) => ({ color: theme(`colors.${t}`) });
      const st = (css) => ({ stroke: css });

      /* Utilidades personalizadas */
      addUtilities({
        /* Timeline ------------------------------------------------------ */
        '.bg-nutri-accent': bg('nutri-accent'),
        '.bg-nutri-warning': bg('nutri-warning'),
        '.bg-nutri-success': bg('nutri-success'),
        '.bg-nutri-secondary': bg('nutri-secondary'),
        '.bg-nutri-primary': bg('nutri-primary'),
        '.bg-nutri-water': bg('nutri-water'),

        '.text-nutri-accent': tx('nutri-accent'),
        '.text-nutri-warning': tx('nutri-warning'),
        '.text-nutri-success': tx('nutri-success'),
        '.text-nutri-secondary': tx('nutri-secondary'),
        '.text-nutri-primary': tx('nutri-primary'),

        /* Rings / KPI --------------------------------------------------- */
        '.stroke-chart-bg': st('var(--chart-ring-bg)'),
        '.stroke-chart-calories': st('var(--chart-calories)'),
        '.stroke-chart-water': st('var(--chart-water)'),
        '.stroke-chart-lifepoint': st('var(--chart-lifepoint)'),
        '.stroke-chart-protein': st('var(--chart-protein)'),
        '.stroke-chart-carbs': st('var(--chart-carbs)'),
        '.stroke-chart-fats': st('var(--chart-fats)'),
        '.stroke-chart-warning': st('var(--chart-warning)'),

        /* Gradiente stop – éxito ---------------------------------------- */
        /* Se evita @apply recursivo */
        '.from-nutri-success': {
          '--tw-gradient-from': 'hsl(var(--color-success-500))',
          '--tw-gradient-to': 'hsl(var(--color-success-500) / 0)',
          '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
        }
      });
    }
  ]
};
