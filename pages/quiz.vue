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
          <p class="step-text">{{ progressSteps[currentQuestionIndex].label }}</p>
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
          <div
            v-for="option in currentQuestion.options"
            :key="option.id"
            v-if="currentQuestion.type === 'radio'"
            class="option-card"
            :class="{ selected: selectedOption === option.id }"
            @click="selectOption(option.id)"
          >
            <div class="option-content">
              <div class="option-text">{{ option.label }}</div>
              <div v-if="option.description" class="option-description">
                {{ option.description }}
              </div>
            </div>
            <div class="option-radio" :class="{ checked: selectedOption === option.id }">
              <div class="radio-dot" v-if="selectedOption === option.id"></div>
            </div>
          </div>
          <div v-if="currentQuestion.type === 'input'">
            <input
              type="text"
              v-model="selectedOption"
              class="input-field"
              @keyup.enter="handleNext"
              placeholder="Type your answer here..."
            />
          </div>
        </div>

        <div class="navigation-section">
          <button
            type="button"
            @click="goBack"
            class="back-button"
            :disabled="currentQuestionIndex === 0"
          >
            Back
          </button>
          <div class="action-buttons">
            <button
              v-if="!currentQuestion.required"
              type="button"
              @click="skipQuestion"
              class="skip-button"
            >
              Skip
            </button>
            <button
              v-if="isLastQuestion"
              type="button"
              @click="handleNext"
              class="next-button"
              :disabled="!selectedOption"
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
// Route protection middleware
definePageMeta({
  middleware: 'route-protection'
})

import { computed, ref, watch } from 'vue'
import ProgressIndicator from '~/components/ProgressIndicator.vue'
import { usePageAnalytics } from '~/composables/useAnalytics'
import { useQuizManagement } from '~/composables/useWelcomeFlow'
import { PROGRESS_STEPS } from '~/schemas/common'
import type { QuestionId, QuizAnswer } from '~/schemas/quiz'
import { QUIZ_QUESTIONS } from '~/schemas/quiz'
import '~/styles/quiz.css'

const progressSteps = PROGRESS_STEPS

// Analytics
const analytics = usePageAnalytics('quiz')

// Global states
const { quizResponses, addQuizAnswer, completeQuiz } = useQuizManagement()

// Quiz timing
const questionStartTime = ref<number>(0)

// Quiz questions from schema
const questions = QUIZ_QUESTIONS

// Quiz state
const currentQuestionIndex = ref(0)
const selectedOption = ref<string>('')
const totalQuestions = questions.length

// Computed properties
const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions - 1)

// Initialize with existing answers
watch(() => quizResponses.value, (responses) => {
  const currentQuestionId = currentQuestion.value.id
  const existingAnswer = responses.answers.find((a: QuizAnswer) => a.questionId === currentQuestionId)
  if (existingAnswer) {
    selectedOption.value = existingAnswer.answer
  }
}, { immediate: true })

// Track question start time
watch(currentQuestionIndex, () => {
  questionStartTime.value = Date.now()
})

// Methods
const selectOption = (optionId: string) => {
  selectedOption.value = optionId

  // Auto-advance to next question immediately after selection (except for last question)
  if (!isLastQuestion.value) {
    // Brief delay to ensure visual feedback is shown
    setTimeout(() => {
      handleNext()
    }, 150)
  }
}

const handleNext = () => {
  if (!selectedOption.value) return

  const timeSpent = Date.now() - questionStartTime.value

  // Track quiz answer analytics
  analytics.trackQuizAnswer(
    currentQuestion.value.id,
    currentQuestionIndex.value,
    selectedOption.value,
    timeSpent,
    false
  )

  // Save answer to global state
  addQuizAnswer({
    questionId: currentQuestion.value.id as QuestionId,
    answer: selectedOption.value,
    skipped: false
  })

  proceedToNext()
}

const skipQuestion = () => {
  const timeSpent = Date.now() - questionStartTime.value

  // Track skipped question analytics
  analytics.trackQuizAnswer(
    currentQuestion.value.id,
    currentQuestionIndex.value,
    '',
    timeSpent,
    true
  )

  // Save skipped answer to global state
  addQuizAnswer({
    questionId: currentQuestion.value.id as QuestionId,
    answer: '',
    skipped: true
  })

  analytics.trackInteraction('click', 'skip_button', { questionIndex: currentQuestionIndex.value })

  proceedToNext()
}

const proceedToNext = () => {
  if (isLastQuestion.value) {
    // Complete quiz and navigate
    completeQuiz()
    // Navigate to summary page
    navigateTo('/summary')
  } else {
    // Move to next question
    currentQuestionIndex.value++
    selectedOption.value = ''

    // Check if next question already has an answer
    const nextQuestionId = questions[currentQuestionIndex.value].id
    const existingAnswer = quizResponses.value.answers.find((a: QuizAnswer) => a.questionId === nextQuestionId)
    if (existingAnswer && !existingAnswer.skipped) {
      selectedOption.value = existingAnswer.answer
    }
  }
}

const goBack = () => {
  analytics.trackInteraction('click', 'back_button', { fromQuestion: currentQuestionIndex.value })

  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedOption.value = ''

    // Load existing answer for previous question
    const prevQuestionId = questions[currentQuestionIndex.value].id
    const existingAnswer = quizResponses.value.answers.find((a: QuizAnswer) => a.questionId === prevQuestionId)
    if (existingAnswer) {
      selectedOption.value = existingAnswer.answer
    }
  }
}

const goToPreviousPage = () => {
  navigateTo('/goal')
}
</script>

