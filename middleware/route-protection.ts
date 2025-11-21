import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // Allow navigation to home page from anywhere
  if (to.path === '/') {
    return
  }

  // Allow navigation from any valid previous page in the flow
  const allowedTransitions: Record<string, string[]> = {
    '/goal': ['/'], // goal can only be accessed from home
    '/quiz': ['/goal'], // quiz can only be accessed from goal
    '/summary': ['/quiz'], // summary can only be accessed from quiz
    '/payment': ['/summary'] // payment can only be accessed from summary
  }

  const allowedFromPages = allowedTransitions[to.path]
  if (allowedFromPages && allowedFromPages.includes(from.path)) {
    return
  }

  // Allow back navigation within the flow (reverse direction)
  const reverseTransitions: Record<string, string[]> = {
    '/': ['/goal'], // allow going back to home from goal
    '/goal': ['/quiz'], // allow going back to goal from quiz
    '/quiz': ['/summary'], // allow going back to quiz from summary
    '/summary': ['/payment'] // allow going back to summary from payment
  }

  const allowedBackFromPages = reverseTransitions[to.path]
  if (allowedBackFromPages && allowedBackFromPages.includes(from.path)) {
    return
  }

  // If no valid transition, redirect to home
  return navigateTo('/')

})
