// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-11-21',

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css',
    'primeicons/primeicons.css'
  ],

  runtimeConfig: {
    public: {
      primevue: {
        theme: 'aura',
        ripple: true
      }
    }
  },

  // Configure router base for GitHub Pages
  router: {
    options: {
      strict: true
    }
  },

  // Build configuration for static generation
  nitro: {
    preset: 'static',
    output: {
      publicDir: 'dist'
    }
  },

  // Generate static files for GitHub Pages
  generate: {
    routes: ['/']
  },

  // App configuration
  app: {
    baseURL: import.meta.env.PROD ? '/yazio/' : '/',
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'YAZIO - Welcome Back Experience',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Personalized meal planning and fitness experience' },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
