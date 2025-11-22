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
import { useSupabase } from '~/composables/useSupabase'
import { useGlobalUser } from '~/composables/useWelcomeFlow'
import { PROGRESS_STEPS } from '~/schemas/common'
import type { UserProfile } from '~/schemas/userProfile'
import { USER_PROFILE_FORM } from '~/schemas/userProfile'
import '~/styles/goal.css'

const progressSteps = PROGRESS_STEPS

// Analytics
const analytics = usePageAnalytics('goal')

// Supabase
const { profiles, getCurrentUser } = useSupabase()

// Global user state
const userProfile = useGlobalUser()

// Form schema
const formFields = ref(USER_PROFILE_FORM)

// Edit mode state
const isEditing = ref(false)

// Form data (partial profile for editing)
const formData = ref<Partial<UserProfile>>({
  id: '',
  name: '',
  goal: 'lose-weight',
  dietaryPreference: undefined,
  timeCommitment: undefined
})

// Initialize form with current user data
onMounted(() => {
  if (userProfile.value) {
    formData.value = { ...userProfile.value }
  }
})

// Helper function to save profile to database
const saveProfileToDatabase = async (): Promise<boolean> => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser || !formData.value.id || !formData.value.name || !formData.value.goal) {
      console.error('Missing required profile fields')
      return false
    }

    // Create update data without id (as expected by updateUserProfile function)
    const updateData = {
      name: formData.value.name,
      goal: formData.value.goal,
      dietaryPreference: formData.value.dietaryPreference,
      timeCommitment: formData.value.timeCommitment
    }
    console.log('updateData', updateData)
    const success = await profiles.updateUserProfile(currentUser.id, updateData)
    if (success) {
      // Update global state (keep the existing id)
      userProfile.value = {
        id: formData.value.id,
        name: formData.value.name,
        goal: formData.value.goal,
        dietaryPreference: formData.value.dietaryPreference,
        timeCommitment: formData.value.timeCommitment
      }
      return true
    } else {
      console.error('Failed to save profile to database')
      return false
    }
  } catch (error) {
    console.error('Error saving profile:', error)
    return false
  }
}

// Toggle edit mode
const toggleEdit = async () => {
  if (isEditing.value) {
    const success = await saveProfileToDatabase()
    if (!success) return // Don't toggle edit mode if save failed
  }
  // Toggle edit mode
  isEditing.value = !isEditing.value
}

// Handle continue button
const handleContinue = async () => {
  // If user is in edit mode with unsaved changes, save them first
  if (isEditing.value) {
    await saveProfileToDatabase() // Continue even if save fails
  }

  analytics.trackInteraction('click', 'continue_button', {
    goal: userProfile.value?.goal,
    dietaryPreference: userProfile.value?.dietaryPreference,
    timeCommitment: userProfile.value?.timeCommitment
  })

  // Navigate to quiz page
  navigateTo('/quiz')
}

// Go back to previous page
const goToPreviousPage = () => {
  navigateTo('/')
}
</script>

