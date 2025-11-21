import { defineNuxtPlugin } from '#app'
import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false
      }
    },
    ripple: true
  })
})
