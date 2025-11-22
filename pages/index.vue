<template>
  <!-- Always show login page -->
  <div class="login-container">
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePageAnalytics } from '~/composables/useAnalytics'
import { useSupabase } from '~/composables/useSupabase'
import '~/styles/index.css'

// Composables
const { login, isAuthenticated } = useSupabase()
const analytics = usePageAnalytics('login')

// Login form state
const loginForm = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

// Check authentication on mount and redirect if already logged in
onMounted(() => {
  if (isAuthenticated()) {
    navigateTo('/welcome')
  }
})

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
      // Navigate to welcome page after successful login
      navigateTo('/welcome')
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
</script>

