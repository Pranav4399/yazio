// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-11-21',

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/main.css',
    'primeicons/primeicons.css'
  ],

  // Configure router options
  router: {
    options: {
      strict: true
    }
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'apple-touch-icon', sizes: '96x96', href: '/apple-touch-icon-96x96.png' },
      ]
    }
  }
})
