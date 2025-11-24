<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1 class="admin-title">Admin Panel</h1>
      <p class="admin-subtitle">Manage feature flags and system settings</p>
    </div>

    <div v-if="loading" class="loading-container">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" />
    </div>

    <div v-else class="feature-flags-section">
      <h2 class="section-title">Feature Flags</h2>
      <div class="feature-flags-grid">
        <div v-for="flag in flagsData" :key="flag.id" class="feature-flag-card">
          <div class="flag-info">
            <h3 class="flag-key">{{ flag.key }}</h3>
          </div>
          <div class="flag-toggle">
            <InputSwitch :modelValue="flag.value === 'true'" @update:modelValue="(val: string) => updateFeatureFlag(flag, val)"
              :disabled="updatingFlags.has(flag.id)" />

            <span v-if="updatingFlags.has(flag.id)" class="updating-text">Updating...</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="quiz-section">
      <div class="section-header">
        <h2 class="section-title">Quiz Questions</h2>
        <div class="section-actions">
          <Button label="Add Question" icon="pi pi-plus" @click="addNewQuestion" class="p-button-sm" />
          <Button label="Save Changes" icon="pi pi-save" @click="updateQuizQuestions" :loading="updatingQuiz"
            class="p-button-primary p-button-sm" />
        </div>
      </div>

      <div v-if="loadingQuiz" class="loading-container">
        <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="8" fill="transparent" />
      </div>

      <div v-else class="quiz-questions-list">
        <div v-for="(question, index) in quizQuestions" :key="question.id" class="question-card">
          <div class="question-header">
            <div class="question-info">
              <h3 class="question-title">{{ question.title }}</h3>
              <span class="question-type">{{ question.type }}</span>
            </div>
            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="deleteQuestion(index)" />
          </div>

          <div class="question-content">
            <div class="form-group">
              <label>Title</label>
              <InputText v-model="question.title" class="full-width" />
            </div>

            <div class="form-group">
              <label>Description</label>
              <Textarea v-model="question.description" rows="2" class="full-width" />
            </div>

            <div class="form-group">
              <label>Type</label>
              <Dropdown v-model="question.type" :options="['radio', 'input']" class="full-width" />
            </div>

            <div class="form-group">
              <InputSwitch v-model="question.required" inputId="required-${index}" />
              <label for="required-${index}" class="switch-label">Required</label>
            </div>

            <div v-if="question.type === 'radio'" class="options-section">
              <label>Options</label>
              <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="option-item">
                <InputText v-model="option.label" placeholder="Label" class="option-input" />
                <InputText v-model="option.value" placeholder="Value" class="option-input" />
                <Button icon="pi pi-trash" class="p-button-danger p-button-sm"
                  @click="question.options.splice(optionIndex, 1)" />
              </div>
              <Button label="Add Option" icon="pi pi-plus"
                @click="question.options.push({ id: `option${question.options.length + 1}`, label: '', value: '', description: '' })"
                class="p-button-sm add-option-btn" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="quizErrorMessage" class="error-message">
        {{ quizErrorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'
import Textarea from 'primevue/textarea'
import { onMounted, ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import '~/styles/admin.css'

definePageMeta({
  middleware: 'route-protection'
})

const { featureFlags, quiz } = useSupabase()

const flagsData = ref<any[]>([])
const quizQuestions = ref<any[]>([])
const loading = ref(true)
const loadingQuiz = ref(false)
const errorMessage = ref('')
const quizErrorMessage = ref('')
const updatingFlags = ref(new Set<string>())
const updatingQuiz = ref(false)


const loadFeatureFlags = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const flags = await featureFlags.getAllFeatureFlags()
    if (flags) {
      console.log(flags);
      flagsData.value = flags;
    }
  } catch (error) {
    console.error('Error loading feature flags:', error)
    errorMessage.value = 'Failed to load feature flags'
  } finally {
    loading.value = false
  }
}

// Update feature flag
const updateFeatureFlag = async (flag: { id: string, key: string, value: string }, stringValue: string) => {
  try {
    updatingFlags.value.add(flag.id)
    errorMessage.value = ''
    // Update in database
    const success = await featureFlags.updateFeatureFlag?.(flag.key, stringValue) ?? false

    if (!success) {
      // Revert the toggle if update failed
      errorMessage.value = `Failed to update ${flag.key} to ${stringValue}`
    }
  } catch (error) {
    console.error('Error updating feature flag:', error)
    // Revert the toggle
    errorMessage.value = `Failed to update ${flag.key} to ${stringValue}`
  } finally {
    updatingFlags.value.delete(flag.id)
  }
}


// Load quiz questions
const loadQuizQuestions = async () => {
  try {
    loadingQuiz.value = true
    quizErrorMessage.value = ''
    const questions = await quiz.getQuizQuestions()
    if (questions) {
      quizQuestions.value = questions
    }
  } catch (error) {
    console.error('Error loading quiz questions:', error)
    quizErrorMessage.value = 'Failed to load quiz questions'
  } finally {
    loadingQuiz.value = false
  }
}

// Update quiz questions
const updateQuizQuestions = async () => {
  try {
    updatingQuiz.value = true
    quizErrorMessage.value = ''

    const success = await quiz.updateQuizQuestions(quizQuestions.value)
    if (!success) {
      quizErrorMessage.value = 'Failed to update quiz questions'
    }
  } catch (error) {
    console.error('Error updating quiz questions:', error)
    quizErrorMessage.value = 'Failed to update quiz questions'
  } finally {
    updatingQuiz.value = false
  }
}

// Add new question
const addNewQuestion = () => {
  quizQuestions.value.push({
    id: `question-${Date.now()}`,
    title: 'New Question',
    description: 'Question description',
    options: [
      { id: 'option1', label: 'Option 1', value: 'option1', description: 'Description 1' }
    ],
    required: true,
    type: 'radio'
  })
}

// Delete question
const deleteQuestion = (index: number) => {
  quizQuestions.value.splice(index, 1)
}

// Load data on mount
onMounted(() => {
  loadFeatureFlags()
  loadQuizQuestions()
})
</script>
