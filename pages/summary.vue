<template>
  <div class="summary-container">
    <button @click="goToPreviousPage" class="back-to-previous">
      ← Back
    </button>
    <div class="progress-wrapper">
      <ProgressIndicator :current-step="'summary'" :steps="progressSteps" />
    </div>
    <div class="summary-content">
      <div class="header">
        <h1 class="title">Your Profile Summary</h1>
        <p class="subtitle">Review your fitness preferences and goals</p>
      </div>

      <div class="summary-sections">
        <!-- User Profile Section -->
        <div class="summary-section">
          <h2 class="section-title">Personal Information</h2>
          <div class="info-grid">
            <div class="info-item" v-if="userProfile">
              <span class="info-label">Name</span>
              <span class="info-value">{{ userProfile.name }}</span>
            </div>
            <div class="info-item" v-if="userProfile">
              <span class="info-label">Fitness Goal</span>
              <span class="info-value">{{ formatGoal(userProfile.goal) }}</span>
            </div>
            <div class="info-item" v-if="userProfile?.dietaryPreference">
              <span class="info-label">Eating Style</span>
              <span class="info-value">{{ formatPreference(userProfile.dietaryPreference) }}</span>
            </div>
            <div class="info-item" v-if="userProfile?.timeCommitment">
              <span class="info-label">Time Available</span>
              <span class="info-value">{{ formatTime(userProfile.timeCommitment) }}</span>
            </div>
          </div>
        </div>

        <!-- Quiz Responses Section -->
        <div class="summary-section">
          <h2 class="section-title">Your Preferences</h2>
          <div class="quiz-responses">
            <div
              v-for="answer in quizResponses.answers"
              :key="answer.questionId"
              class="response-item"
              :class="{ skipped: answer.skipped }"
            >
              <div class="response-question">{{ getQuestionTitle(answer.questionId) }}</div>
              <div class="response-answer">
                <span v-if="answer.skipped" class="skipped-text">Skipped</span>
                <span v-else>{{ formatAnswer(answer.questionId, answer.answer) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-section">
        <button @click="editProfile" class="edit-profile-button">
          Edit Profile
        </button>
        <button @click="startJourney" class="start-journey-button">
          Start My Journey
        </button>
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
import { useGlobalUser, useQuizManagement } from '~/composables/useWelcomeFlow'
import { PROGRESS_STEPS } from '~/schemas/common'
import type { QuizOption, QuizQuestion } from '~/schemas/quiz'
import '~/styles/summary.css'

const progressSteps = PROGRESS_STEPS

// Analytics
const analytics = usePageAnalytics('summary')

// Global states
const userProfile = useGlobalUser()
const { quizResponses } = useQuizManagement()

// Quiz questions from Supabase
const quizQuestions = ref<QuizQuestion[]>([])

// Generic formatting function (DRY)
const formatValue = (value: string, mapping: Record<string, string>) => {
  return mapping[value] || value
}

// Computed properties for formatting (DRY)
const formatGoal = (goal: string) => formatValue(goal, {
  'lose-weight': 'Lose weight',
  'gain-weight': 'Gain weight',
  'maintain-weight': 'Maintain weight',
  'build-muscle': 'Build muscle',
  'improve-health': 'Improve health'
})

const formatPreference = (preference: string) => formatValue(preference, {
  'balanced': 'Balanced meals',
  'quick-recipes': 'Quick recipes',
  'meal-prep': 'Meal prep friendly',
  'flexible': 'Flexible'
})

const formatTime = (time: string) => formatValue(time, {
  '15min': '15 minutes or less',
  '30min': '30 minutes',
  '1hour': '1 hour or more',
  'flexible': 'Flexible'
})

const getQuestionTitle = (questionId: string) => {
  const question = quizQuestions.value.find(q => q.id === questionId)
  return question?.title || questionId
}

const formatAnswer = (questionId: string, answer: string) => {
  const question = quizQuestions.value.find((q: QuizQuestion) => q.id === questionId)
  if (!question) return answer

  if (question.type === 'input') {
    return answer
  }

  const option = question.options?.find((opt: QuizOption) => opt.id === answer)
  return option?.label || answer
}

// Load quiz questions only (global state auto-initializes from DB)
const loadData = async () => {
  try {
    const { quiz } = useSupabase()

    // Load quiz questions for answer formatting
    const questions = await quiz.getQuizQuestions()
    if (questions) {
      quizQuestions.value = questions
    }

    // Global state (userProfile & quizResponses) auto-initializes from DB
  } catch (error) {
    console.error('Failed to load quiz questions:', error)
  }
}

// Navigation functions
const goToPreviousPage = () => {
  navigateTo('/quiz')
}

const editProfile = () => {
  analytics.trackInteraction('click', 'edit_profile_button')
  navigateTo('/goal')
}

const startJourney = () => {
  analytics.trackInteraction('click', 'start_journey_button', {
    profile: userProfile.value,
    quizAnswers: quizResponses.value.answers.length
  })

  // Navigate to payment page
  navigateTo('/payment')
}

onMounted(async () => {
  await loadData()
})
</script>

