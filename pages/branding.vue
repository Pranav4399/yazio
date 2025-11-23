<template>
  <div class="branding-container">
    <div class="progress-wrapper">
      <ProgressIndicator :current-step="'branding'" :steps="progressSteps" />
    </div>
    <div class="branding-content">
      <div class="branding-header">
        <div class="logo-section">
          <div class="logo">YAZIO</div>
          <div class="tagline">Smart Nutrition Tracking</div>
        </div>

        <div class="message-section">
          <h1 class="title">Welcome to YAZIO</h1>
          <p class="subtitle">YAZIO is your intelligent nutrition companion that helps you track calories, understand your eating patterns, and make informed decisions about your health. Since 2016, we've helped millions of users worldwide achieve their nutrition goals.</p>
        </div>

        <div class="features-section">
          <div class="feature">
            <h3>Calorie Tracking</h3>
            <p>Log meals and track calories with our extensive food database</p>
          </div>
          <div class="feature">
            <h3>Progress Insights</h3>
            <p>Understand your eating patterns with detailed analytics and reports</p>
          </div>
          <div class="feature">
            <h3>Goal Achievement</h3>
            <p>Set targets and stay motivated with personalized recommendations</p>
          </div>
          <div class="feature">
            <h3>Community Support</h3>
            <p>Join a community of health-conscious individuals sharing their journeys</p>
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
