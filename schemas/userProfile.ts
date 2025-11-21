export interface UserProfile {
  id: string
  name: string
  goal: 'lose-weight' | 'gain-weight' | 'maintain-weight' | 'build-muscle' | 'improve-health'
  dietaryPreference?: 'balanced' | 'quick-recipes' | 'meal-prep' | 'flexible'
  timeCommitment?: '15min' | '30min' | '1hour' | 'flexible'
}

// Form field configuration
export interface FormField {
  key: keyof UserProfile
  label: string
  type: 'text' | 'select'
  required: boolean
  options?: FormOption[]
  placeholder?: string
}

export interface FormOption {
  value: string
  label: string
}

// Dynamic form schema
export const USER_PROFILE_FORM: FormField[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your name'
  },
  {
    key: 'goal',
    label: 'Fitness Goal',
    type: 'select',
    required: true,
    options: [
      { value: 'lose-weight', label: 'Lose weight' },
      { value: 'gain-weight', label: 'Gain weight' },
      { value: 'maintain-weight', label: 'Maintain weight' },
      { value: 'build-muscle', label: 'Build muscle' },
      { value: 'improve-health', label: 'Improve health' }
    ]
  },
  {
    key: 'dietaryPreference',
    label: 'Eating Style',
    type: 'select',
    required: false,
    options: [
      { value: '', label: 'No preference' },
      { value: 'balanced', label: 'Balanced meals' },
      { value: 'quick-recipes', label: 'Quick recipes' },
      { value: 'meal-prep', label: 'Meal prep friendly' },
      { value: 'flexible', label: 'Flexible' }
    ]
  },
  {
    key: 'timeCommitment',
    label: 'Time Available',
    type: 'select',
    required: false,
    options: [
      { value: '', label: 'No preference' },
      { value: '15min', label: '15 minutes or less' },
      { value: '30min', label: '30 minutes' },
      { value: '1hour', label: '1 hour or more' },
      { value: 'flexible', label: 'Flexible' }
    ]
  }
]
