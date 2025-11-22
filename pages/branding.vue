<template>
  <div class="branding-container">
    <div class="progress-wrapper">
      <ProgressIndicator :current-step="'branding'" :steps="progressSteps" />
    </div>
    <div class="branding-content">
      <div class="branding-header">
        <div class="logo-section">
          <div class="logo">YAZIO</div>
          <div class="tagline">Your AI Fitness Companion</div>
        </div>

        <div class="message-section">
          <h1 class="title">Thank you for choosing YAZIO</h1>
          <p class="subtitle">We're excited to help you on your fitness journey with personalized nutrition and workout plans powered by AI.</p>
        </div>

        <div class="features-section">
          <div class="feature">
            <div class="feature-icon">🎯</div>
            <h3>Personalized Plans</h3>
            <p>AI-powered meal and workout recommendations tailored to your goals</p>
          </div>
          <div class="feature">
            <div class="feature-icon">📊</div>
            <h3>Smart Tracking</h3>
            <p>Advanced analytics to monitor your progress and keep you motivated</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🏆</div>
            <h3>Achieve Goals</h3>
            <p>Reach your fitness targets with our proven methodology</p>
          </div>
        </div>
      </div>

      <button class="continue-button" @click="handleContinue">
        Continue to Summary
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'route-protection'
})

import { onMounted } from 'vue'
import ProgressIndicator from '~/components/ProgressIndicator.vue'
import { usePageAnalytics } from '~/composables/useAnalytics'
import { PROGRESS_STEPS } from '~/schemas/common'
import '~/styles/branding.css'

const progressSteps = PROGRESS_STEPS
const analytics = usePageAnalytics('branding')

onMounted(() => {
  analytics.trackInteraction('view', 'branding_page')
})

const handleContinue = () => {
  analytics.trackInteraction('click', 'continue_to_summary')
  navigateTo('/summary')
}
</script>
