<template>
  <div class="confirm-container">
    <button @click="goToPreviousPage" class="back-to-previous">
      ← Back
    </button>
    <div class="progress-wrapper">
      <ProgressIndicator :current-step="'goal'" :steps="progressSteps" />
    </div>
    <div class="confirm-content">
      <div class="header">
        <h1 class="title">Confirm Your Goal</h1>
        <p class="subtitle">Review and update your fitness goals</p>
      </div>

      <div class="goal-form">
        <div
          v-for="field in formFields"
          :key="field.key"
          class="form-group"
        >
          <label :for="field.key" class="form-label">{{ field.label }}</label>

          <!-- Text Input -->
          <input
            v-if="field.type === 'text'"
            :id="field.key"
            v-model="formData[field.key]"
            type="text"
            class="form-input"
            :placeholder="field.placeholder"
            :readonly="!isEditing"
            :class="{ 'readonly': !isEditing }"
            :required="field.required"
          />

          <!-- Select Input -->
          <select
            v-else-if="field.type === 'select'"
            :id="field.key"
            v-model="formData[field.key]"
            class="form-select"
            :disabled="!isEditing"
            :class="{ 'readonly': !isEditing }"
            :required="field.required"
          >
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="button-group">
          <button type="button" @click="toggleEdit" class="edit-button">
            {{ isEditing ? 'Save' : 'Edit' }}
          </button>
          <button type="button" @click="handleContinue" class="continue-button">
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Route protection middleware
definePageMeta({
  middleware: 'route-protection'
})

import { onMounted, ref } from 'vue'
import ProgressIndicator from '~/components/ProgressIndicator.vue'
import { usePageAnalytics } from '~/composables/useAnalytics'
import { useGlobalUser } from '~/composables/useWelcomeFlow'
import { PROGRESS_STEPS } from '~/schemas/common'
import type { UserProfile } from '~/schemas/userProfile'
import { USER_PROFILE_FORM } from '~/schemas/userProfile'
import '~/styles/goal.css'

const progressSteps = PROGRESS_STEPS

// Analytics
const analytics = usePageAnalytics('goal')

// Global user state
const userProfile = useGlobalUser()

// Form schema
const formFields = ref(USER_PROFILE_FORM)

// Edit mode state
const isEditing = ref(false)

// Form data
const formData = ref<UserProfile>({
  id: '',
  name: '',
  goal: 'lose-weight',
  dietaryPreference: undefined,
  timeCommitment: undefined
})

// Initialize form with current user data
onMounted(() => {
  formData.value = { ...userProfile.value }
})

// Toggle edit mode
const toggleEdit = () => {
  if (isEditing.value) {
    // Save changes to global state
  userProfile.value = { ...formData.value }
  }
  // Toggle edit mode
  isEditing.value = !isEditing.value
}

// Handle continue button
const handleContinue = () => {
  analytics.trackInteraction('click', 'continue_button', {
    goal: userProfile.value.goal,
    dietaryPreference: userProfile.value.dietaryPreference,
    timeCommitment: userProfile.value.timeCommitment
  })

  // Navigate to quiz page
  navigateTo('/quiz')
}

// Go back to previous page
const goToPreviousPage = () => {
  navigateTo('/')
}
</script>

