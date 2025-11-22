// Quiz types - data comes from Supabase, validated at database level
export type QuestionId = string // Dynamic, not hardcoded
export interface QuizAnswer {
  questionId: QuestionId
  answer: string
  timestamp: number
  skipped?: boolean
}
export interface QuizResponse {
  answers: QuizAnswer[]
  completedAt?: number
}

// Quiz question definitions - matches Supabase data structure
export interface QuizQuestion {
  id: QuestionId
  title: string
  description: string
  options: QuizOption[]
  required: boolean
  type: 'radio' | 'input'
}

export interface QuizOption {
  id: string
  label: string
  value: string
  description: string
}

