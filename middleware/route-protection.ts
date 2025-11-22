import type { RouteLocationNormalized } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // Only run authentication checks on client-side (where localStorage is available)
  if (!process.client) {
    return // Allow server-side rendering to proceed
  }

  // Check authentication for protected routes
  const { isAuthenticated } = useSupabase()

  // Define protected routes (all except login page)
  const protectedRoutes = ['/welcome', '/goal', '/quiz', '/branding', '/summary', '/payment', '/admin', '/analytics']

  // If trying to access a protected route without authentication, redirect to login
  if (protectedRoutes.includes(to.path) && !isAuthenticated()) {
    return navigateTo('/')
  }

  // Allow all other navigation (authenticated users can go anywhere)
  return
})
