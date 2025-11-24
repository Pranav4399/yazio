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

  const queryParams = to.query;
  if(queryParams.skip && to.path === '/payment') {
    return navigateTo('/payment')
  }

  const allowedRoutes = {
    'welcome': ['/goal'],
    'goal': ['/quiz'],
    'quiz': ['/branding'],
    'branding': ['/summary'],
    'summary': ['/payment'],
  }

  const fromPath = from.path as keyof typeof allowedRoutes;
  const toPath = to.path as keyof typeof allowedRoutes;
  
  console.log('fromPath', fromPath);
  console.log('toPath', toPath);

  if(allowedRoutes[fromPath] && allowedRoutes[fromPath].includes(toPath)) {
    console.log('allowed');
    return navigateTo(toPath)
  }

})
