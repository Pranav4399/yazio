import type { RouteLocationNormalized } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // Check authentication for protected routes
  const { isAuthenticated } = useSupabase()

  // Define protected routes (all except login page)
  const protectedRoutes = ['/welcome', '/goal', '/quiz', '/branding', '/summary', '/payment']

  if (protectedRoutes.includes(to.path) && !isAuthenticated()) {
    // Redirect to login page if not authenticated
    return navigateTo('/')
  }

  // Allow navigation to login page from anywhere
  if (to.path === '/') {
    return
  }

  // Allow navigation from any valid previous page in the flow
  const allowedTransitions: Record<string, string[]> = {
    '/welcome': ['/'], // welcome can only be accessed from login
    '/goal': ['/welcome'], // goal can only be accessed from welcome
    '/quiz': ['/goal'], // quiz can only be accessed from goal
    '/branding': ['/quiz'], // branding can only be accessed from quiz
    '/summary': ['/quiz', '/branding'], // summary can be accessed from quiz or branding
    '/payment': ['/summary'] // payment can only be accessed from summary
  }

  const allowedFromPages = allowedTransitions[to.path]
  if (allowedFromPages && allowedFromPages.includes(from.path)) {
    return
  }

  // Allow back navigation within the flow (reverse direction)
  const reverseTransitions: Record<string, string[]> = {
    '/': ['/welcome'], // allow going back to login from welcome
    '/welcome': ['/goal'], // allow going back to welcome from goal
    '/goal': ['/quiz'], // allow going back to goal from quiz
    '/quiz': ['/branding', '/summary'], // allow going back to quiz from branding or summary
    '/branding': ['/summary'], // allow going back to branding from summary
    '/summary': ['/payment'] // allow going back to summary from payment
  }

  const allowedBackFromPages = reverseTransitions[to.path]
  if (allowedBackFromPages && allowedBackFromPages.includes(from.path)) {
    return
  }

  // If no valid transition, redirect to home
  return navigateTo('/')

})
