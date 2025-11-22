<template>
  <!-- Show login page if not authenticated -->
  <div v-if="!authState && !loading" class="login-container">
    <div class="login-content">
      <div class="login-header">
        <h1 class="login-title">Welcome Back to YAZIO</h1>
        <p class="login-subtitle">Sign in to continue your personalized fitness journey</p>
      </div>

      <div class="login-form">
        <form @submit.prevent="handleLogin" class="form">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              class="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              class="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            class="login-button"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>

  <!-- Show loading spinner while data is loading -->
  <div v-else-if="loading" class="loading-container">
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
import { ref } from 'vue'
import { usePageAnalytics } from '~/composables/useAnalytics'
import { useSupabase } from '~/composables/useSupabase'
import { useWelcomeFlow } from '~/composables/useWelcomeFlow'
import '~/styles/index.css'

// Composables
const { userProfile, loadUserProfile, loading } = useWelcomeFlow()
const { login, isAuthenticated } = useSupabase()
const analytics = usePageAnalytics('welcome')

// Handle hydration mismatch - ensure auth state is only checked on client
const authState = computed(() => isAuthenticated() ?? false) 

// Login form state
const loginForm = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')


// Handle login
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    errorMessage.value = 'Please enter both username and password'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await login(loginForm.value.username, loginForm.value.password)

    if (result.success) {
      analytics.trackInteraction('login', 'login_form', { success: true })
      // Update auth state and load user profile after successful login
      await loadUserProfile()
      // Redirect will happen automatically due to reactivity
    } else {
      errorMessage.value = result.error || 'Login failed'
      analytics.trackInteraction('login', 'login_form', { success: false, error: result.error })
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'An unexpected error occurred'
    analytics.trackInteraction('login', 'login_form', { success: false, error: 'unexpected' })
  } finally {
    isLoading.value = false
  }
}


// Handle continue button (only shown when authenticated)
const handleContinue = async () => {
  analytics.trackInteraction('click', 'continue_button', { action: 'start_journey' })
  // Navigate to confirm goal page
  navigateTo('/goal')
}
</script>

