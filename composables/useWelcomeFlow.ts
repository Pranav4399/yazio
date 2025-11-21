import { DEFAULT_USER } from '~/data/mockUsers'
import type { QuizAnswer, QuizResponse } from '~/schemas/quiz'
import type { UserProfile } from '~/schemas/userProfile'

// Global user state
const useGlobalUser = () => {
  return useState<UserProfile>('global-user', () => DEFAULT_USER)
}

// Global quiz state
const useGlobalQuiz = () => {
  return useState<QuizResponse>('global-quiz', () => ({
    answers: [],
    completedAt: undefined
  }))
}

export const useWelcomeFlow = () => {
  const userProfile = useGlobalUser()

  return {
    userProfile
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
      ...answer,
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

