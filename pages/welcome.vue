<template>
  <!-- Show loading spinner while data is loading -->
  <div v-if="loading" class="loading-container">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" />
  </div>

  <!-- Show welcome page if authenticated and data loaded -->
  <div v-if="welcomeFlag" class="welcome-container">
    <div class="welcome-content">
      <div class="welcome-text">
        <p class="greeting">“Every action you take is a vote for the person you wish to become.” — James Clear</p>
        <h1 class="name">Welcome back, {{ userProfile?.name }}</h1>
        <p class="message">Let’s keep casting those votes for a healthier you.</p>
      </div>

      <button class="continue-button" @click="handleContinue">
        Continue
      </button>
    </div>
  </div>
  <div v-else class="welcome-container">
    <div class="welcome-content">
      <div class="welcome-text">
        <p class="greeting">“Motivation gets you started; consistency keeps you going.” — Jim Ryun</p>
        <h1 class="name">Welcome back, {{ userProfile?.name }}</h1>
        <p class="message">Glad to have you here again.</p>
      </div>

      <button class="continue-button" @click="handleContinue">
        Continue
      </button>
      <button @click="goToPayment">Go to payment</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
import { computed } from 'vue'
import { usePageAnalytics } from '~/composables/useAnalytics'
import { useSupabase } from '~/composables/useSupabase'
import { useWelcomeFlow } from '~/composables/useWelcomeFlow'
import '~/styles/index.css'

// Route protection middleware
definePageMeta({
  middleware: 'route-protection'
})

const { userProfile, loadUserProfile, loading, featureFlags } = useWelcomeFlow()
const { isAuthenticated } = useSupabase()
const analytics = usePageAnalytics('welcome')


const welcomeFlag = computed(() => {
  const flag = featureFlags.value.find((f: { key: string, value: string }) => f.key === 'welcome-message')
  return flag?.value === 'true'
})

const goToPayment = () => {
  navigateTo('/payment?skip=true')
}
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
