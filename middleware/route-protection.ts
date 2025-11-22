import type { RouteLocationNormalized } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (!process.client) {
    return
  }

  const { isAuthenticated } = useSupabase()

  const protectedRoutes = ['/welcome', '/goal', '/quiz', '/branding', '/summary', '/payment', '/admin', '/analytics']

  if (protectedRoutes.includes(to.path) && !isAuthenticated()) {
    return navigateTo('/')
  }

  return
})
