<template>
  <!-- Show loading spinner while data is loading -->
  <div v-if="loading" class="loading-container">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" />
  </div>

  <!-- Show welcome page if authenticated and data loaded -->
  <div v-else class="welcome-container">
    <div class="welcome-content">
      <div class="welcome-text">
        <p class="greeting">It's great to see you</p>
        <h1 class="name">{{ userProfile?.name }}</h1>
        <p class="message">We missed having you around.</p>
      </div>

      <button class="continue-button" @click="handleContinue">
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
import { usePageAnalytics } from '~/composables/useAnalytics'
import { useSupabase } from '~/composables/useSupabase'
import { useWelcomeFlow } from '~/composables/useWelcomeFlow'
import '~/styles/index.css'

// Route protection middleware
definePageMeta({
  middleware: 'route-protection'
})

// Composables
const { userProfile, loadUserProfile, loading } = useWelcomeFlow()
const { isAuthenticated } = useSupabase()
const analytics = usePageAnalytics('welcome')

// Load user profile on mount
onMounted(async () => {
  if (isAuthenticated()) {
    await loadUserProfile()
  }
})

// Handle continue button (only shown when authenticated)
const handleContinue = async () => {
  analytics.trackInteraction('click', 'continue_button', { action: 'start_journey' })
  // Navigate to confirm goal page
  navigateTo('/goal')
}
</script>
