export type QuestionId = string 
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

