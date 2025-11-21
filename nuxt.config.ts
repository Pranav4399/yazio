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
  }
})
