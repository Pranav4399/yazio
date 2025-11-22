import { ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import type { QuizAnswer, QuizResponse } from '~/schemas/quiz'
import type { UserProfile } from '~/schemas/userProfile'

// Global user state - now loads from Supabase
const globalUserState = ref<UserProfile | null>(null)

// Generic auto-initialization helper (DRY)
const autoInitializeFromDB = async (
  isEmpty: () => boolean,
  loadData: (currentUser: any) => Promise<any>,
  transformData: (data: any) => any,
  setState: (data: any) => void
) => {
  if (isEmpty()) {
    const { getCurrentUser } = useSupabase()
    const currentUser = getCurrentUser()
    if (currentUser) {
      const data = await loadData(currentUser)
      if (data) {
        setState(transformData(data))
      }
    }
  }
}

const useGlobalUser = () => {
  // Auto-initialize from DB if empty
  autoInitializeFromDB(
    () => !globalUserState.value,
    async (currentUser) => {
      const { profiles } = useSupabase()
      return await profiles.getUserProfile(currentUser.id)
    },
    (profile) => ({
      id: profile.id,
      name: profile.name,
      goal: profile.goal as UserProfile['goal'],
      dietaryPreference: profile.dietary_preference as UserProfile['dietaryPreference'],
      timeCommitment: profile.time_commitment as UserProfile['timeCommitment']
    }),
    (data) => { globalUserState.value = data }
  )

  return globalUserState
}

// Global feature flags state (loaded by useWelcomeFlow on app mount)
const useGlobalFeatureFlags = () => {
  return useState<Record<string, string>>('global-feature-flags', () => ({}))
}

// Global quiz state (loaded by useWelcomeFlow on app mount)
const useGlobalQuiz = () => {
  return useState<QuizResponse>('global-quiz', () => ({
    answers: [],
    completedAt: undefined
  }))
}

export const useWelcomeFlow = () => {
  const quizResponses = useGlobalQuiz()
  const featureFlags = useGlobalFeatureFlags()
  const { profiles, getCurrentUser } = useSupabase()

  const loading = ref(false)

  // Load user profile from Supabase
  const loadUserProfile = async () => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      const profile = await profiles.getUserProfile(currentUser.id)
      if (profile) {
        globalUserState.value = profile as UserProfile
      }
    }
  }

  // Load quiz responses from Supabase
  const loadQuizResponses = async () => {
    const currentUser = getCurrentUser()
    if (currentUser && quizResponses.value.answers.length === 0) {
      const { quizResponses: quizDb } = useSupabase()
      const responses = await quizDb.getUserQuizResponses(currentUser.id)
      if (responses && responses.length > 0) {
        // Convert and deduplicate by questionId (keep the most recent)
        const answerMap = new Map()
        responses.forEach((r: any) => {
          answerMap.set(r.question_id, {
            questionId: r.question_id,
            answer: r.answer,
            skipped: r.skipped,
            timestamp: new Date(r.created_at).getTime()
          })
        })
        quizResponses.value.answers = Array.from(answerMap.values())
      }
    }
  }

  // Load feature flags from Supabase
  const loadFeatureFlags = async () => {
    const { featureFlags: featureFlagsDb } = useSupabase()
    const flags = await featureFlagsDb.getAllFeatureFlags()
    if (flags) {
      featureFlags.value = flags
    }
  }

  // Auto-load profile, quiz responses, and feature flags on first access
  onMounted(async () => {
    loading.value = true
    await loadUserProfile()
    await loadQuizResponses()
    await loadFeatureFlags()
    loading.value = false
  })

  return {
    userProfile: globalUserState,
    featureFlags,
    loadUserProfile,
    loading
  }
}

// Quiz management composable
export const useQuizManagement = () => {
  const quizResponses = useGlobalQuiz()

  const addQuizAnswer = (answer: Omit<QuizAnswer, 'timestamp'>) => {
    const existingIndex = quizResponses.value.answers.findIndex(
      a => a.questionId === answer.questionId
    )

    const newAnswer: QuizAnswer = {
      questionId: answer.questionId,
      answer: answer.answer,
      skipped: answer.skipped,
      timestamp: Date.now()
    }

    if (existingIndex >= 0) {
      // Update existing answer
      quizResponses.value.answers[existingIndex] = newAnswer
    } else {
      // Add new answer
      quizResponses.value.answers.push(newAnswer)
    }
  }

  const completeQuiz = () => {
    quizResponses.value.completedAt = Date.now()
  }

  return {
    quizResponses,
    addQuizAnswer,
    completeQuiz
  }
}

// Export the global states for use in other components
export { useGlobalQuiz, useGlobalUser }

