<template>
  <div class="quiz-container">
    <button @click="goToPreviousPage" class="back-to-previous">
      ← Back
    </button>
    <div class="progress-wrapper">
      <ProgressIndicator :current-step="'quiz'" :steps="progressSteps" />
    </div>
    <div class="quiz-content">
      <div class="question-header">
        <div class="question-stepper">
          <div class="step-dots">
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="step-dot"
              :class="{
                active: index === currentQuestionIndex,
                completed: index < currentQuestionIndex
              }"
            ></div>
          </div>
          <p class="step-text">Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</p>
        </div>
      </div>

      <div class="question-section">
        <div class="question-content">
          <h1 class="question-title">{{ currentQuestion.title }}</h1>
          <p v-if="currentQuestion.description" class="question-description">
            {{ currentQuestion.description }}
          </p>
        </div>

        <div class="options-section">
          <!-- Radio button options -->
          <div
            v-for="option in currentQuestion.options"
            :key="option.id"
            v-if="currentQuestion.type === 'radio'"
            class="option-card"
            :class="{ selected: selectedAnswer === option.id }"
            @click="selectOption(option.id)"
          >
            <div class="option-content">
              <div class="option-text">{{ option.label }}</div>
              <div v-if="option.description" class="option-description">
                {{ option.description }}
              </div>
            </div>
            <div class="option-radio" :class="{ checked: selectedAnswer === option.id }">
              <div class="radio-dot" v-if="selectedAnswer === option.id"></div>
            </div>
          </div>

          <!-- Input field for text questions -->
          <div v-if="currentQuestion.type === 'input'">
            <input
              type="text"
              v-model="selectedAnswer"
              class="input-field"
              @keyup.enter="handleNext"
              placeholder="Type your answer here..."
            />
          </div>
        </div>

        <div class="navigation-section">
          <button
            @click="goBack"
            class="back-button"
            :disabled="currentQuestionIndex === 0"
          >
            Back
          </button>
          <div class="action-buttons">
            <button
              v-if="!isLastQuestion"
              @click="handleNext"
              class="next-button"
              :disabled="currentQuestion.required && !selectedAnswer"
            >
              Next
            </button>
            <button
              v-if="isLastQuestion"
              @click="handleNext"
              class="next-button"
              :disabled="!selectedAnswer"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'route-protection'
})

import { computed, onMounted, ref, watch } from 'vue'
import ProgressIndicator from '~/components/ProgressIndicator.vue'
import { usePageAnalytics } from '~/composables/useAnalytics'
import { useSupabase } from '~/composables/useSupabase'
import { useQuizManagement, useWelcomeFlow } from '~/composables/useWelcomeFlow'
import { PROGRESS_STEPS } from '~/schemas/common'
import type { QuestionId } from '~/schemas/quiz'
import '~/styles/quiz.css'

const progressSteps = PROGRESS_STEPS

// Analytics
const analytics = usePageAnalytics('quiz')

// Load quiz questions and manage state
const { quiz, quizResponses: quizDb, getCurrentUser } = useSupabase()
const { quizResponses, addQuizAnswer, completeQuiz } = useQuizManagement()
const { featureFlags } = useWelcomeFlow()

const questions = ref<any[]>([])
const currentQuestionIndex = ref(0)
const selectedAnswer = ref('')
const questionStartTime = ref<number>(0)

// Load questions on mount and initialize first question
onMounted(async () => {
  const data = await quiz.getQuizQuestions()
  if (data) {
    questions.value = data
    // Load existing answer for first question (quiz responses already loaded)
    loadExistingAnswer(0)
  }
})

// Track question start time and load existing answers when question changes
watch(currentQuestionIndex, () => {
  questionStartTime.value = Date.now()
  loadExistingAnswer(currentQuestionIndex.value)
})

// Computed properties
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {})
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)

// Methods
const loadExistingAnswer = (questionIndex: number) => {
  if (!questions.value[questionIndex]) return

  const questionId = questions.value[questionIndex].id
  const existingAnswer = quizResponses.value.answers.find((a: any) => a.questionId === questionId)

  if (existingAnswer && !existingAnswer.skipped) {
    selectedAnswer.value = existingAnswer.answer
  } else {
    selectedAnswer.value = ''
  }
}

const selectOption = (optionId: string) => {
  selectedAnswer.value = optionId

  if (!isLastQuestion.value) {
    setTimeout(async () => {
      await handleNext()
    }, 150)
  }
  // For the last question, user clicks "Complete" button which calls handleNext()
}

const handleNext = async () => {
  // If question is required and no answer, don't proceed
  if (currentQuestion.value.required && !selectedAnswer.value) return

  const timeSpent = Date.now() - questionStartTime.value
  const userId = getCurrentUser()?.id
  const isSkipped = !selectedAnswer.value && !currentQuestion.value.required

  // Save to quiz_responses table
  if (userId) {
    await quizDb.saveQuizResponse(
      userId,
      currentQuestion.value.id,
      selectedAnswer.value || '',
      isSkipped,
      Math.round(timeSpent / 1000) // Convert milliseconds to seconds
    )
  }

  addQuizAnswer({
    questionId: currentQuestion.value.id as QuestionId,
    answer: selectedAnswer.value || '',
    skipped: isSkipped
  })

  proceedToNext()
}


const proceedToNext = () => {
  if (isLastQuestion.value) {
    completeQuiz()
    // Check feature flag for branding page
    const brandingFlag = featureFlags.value.find((f: any) => f.key === 'show-branding')?.value === 'true'
    navigateTo(brandingFlag ? '/branding' : '/summary')
  } else {
    currentQuestionIndex.value++
    loadExistingAnswer(currentQuestionIndex.value)
  }
}

const goBack = () => {
  analytics.trackInteraction('click', 'back_button', { fromQuestion: currentQuestionIndex.value })

  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    loadExistingAnswer(currentQuestionIndex.value)
  }
}

const goToPreviousPage = () => {
  navigateTo('/goal')
}
</script>

