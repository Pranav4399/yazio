<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="welcome-text">
        <p class="greeting">It's great to see you</p>
        <h1 class="name">{{ userProfile.name }}</h1>
        <p class="message">We missed having you around.</p>
      </div>

      <button class="continue-button" @click="handleContinue">
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageAnalytics } from '~/composables/useAnalytics'
import { useWelcomeFlow } from '~/composables/useWelcomeFlow'
import '~/styles/index.css'

// Composables
const { userProfile } = useWelcomeFlow()
const analytics = usePageAnalytics('welcome')

// Handle continue button
const handleContinue = () => {
  analytics.trackInteraction('click', 'continue_button', { action: 'start_journey' })
  // Navigate to confirm goal page
  navigateTo('/goal')
}
</script>

