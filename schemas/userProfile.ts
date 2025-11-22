export interface UserProfile {
  id: string
  name: string
  goal: 'lose-weight' | 'gain-weight' | 'maintain-weight' | 'build-muscle' | 'improve-health'
  dietaryPreference?: 'balanced' | 'quick-recipes' | 'meal-prep' | 'flexible'
  timeCommitment?: '15min' | '30min' | '1hour' | 'flexible'
}

// Form configuration - used by goal.vue page
export const USER_PROFILE_FORM = [
  {
    key: 'name' as keyof UserProfile,
    label: 'Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter your name'
  },
  {
    key: 'goal' as keyof UserProfile,
    label: 'Fitness Goal',
    type: 'select' as const,
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
    key: 'dietaryPreference' as keyof UserProfile,
    label: 'Eating Style',
    type: 'select' as const,
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
    key: 'timeCommitment' as keyof UserProfile,
    label: 'Time Available',
    type: 'select' as const,
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
