import { z } from 'zod'

export const questionIdSchema = z.enum([
  'dietary-preference',
  'time-commitment',
  'motivation-style'
])

export const quizAnswerSchema = z.object({
  questionId: questionIdSchema,
  answer: z.string(), // Allow empty string for skipped questions
  timestamp: z.number(),
  skipped: z.boolean().optional()
})

export const quizResponseSchema = z.object({
  answers: z.array(quizAnswerSchema),
  completedAt: z.number().optional()
})

export type QuestionId = z.infer<typeof questionIdSchema>
export type QuizAnswer = z.infer<typeof quizAnswerSchema>
export type QuizResponse = z.infer<typeof quizResponseSchema>

// Quiz question definitions
export interface QuizQuestion {
  id: QuestionId
  title: string
  description?: string
  options?: QuizOption[]
  required: boolean
  type: 'radio' | 'input'
}

export interface QuizOption {
  id: string
  label: string
  value: string
  description?: string
}

// Predefined questions
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'dietary-preference',
    title: "What's your preferred eating style?",
    description: 'This helps us personalize your meal recommendations',
    options: [
      { id: 'balanced', label: 'Balanced meals', value: 'balanced', description: 'Nutritious variety every day' },
      { id: 'quick-recipes', label: 'Quick recipes', value: 'quick-recipes', description: 'Fast and easy to prepare' },
      { id: 'meal-prep', label: 'Meal prep friendly', value: 'meal-prep', description: 'Prepare ahead for the week' },
      { id: 'flexible', label: 'No preference', value: 'flexible', description: 'I\'m open to anything' }
    ],
    required: true,
    type: 'radio'
  },
  {
    id: 'time-commitment',
    title: 'How much time can you dedicate daily?',
    description: 'This helps us match you with realistic goals',
    options: [
      { id: '15min', label: '15 minutes or less', value: '15min', description: 'Quick and efficient approach' },
      { id: '30min', label: '30 minutes', value: '30min', description: 'Moderate daily commitment' },
      { id: '1hour', label: '1 hour or more', value: '1hour', description: 'Dedicated time for results' },
      { id: 'flexible', label: 'Flexible', value: 'flexible', description: 'Varies by day and situation' }
    ],
    required: true,
    type: 'radio'
  },
  {
    id: 'motivation-style',
    title: 'What motivates you most?',
    description: 'Understanding your drive helps us keep you engaged',
    required: false,
    type: 'input'
  }
]
