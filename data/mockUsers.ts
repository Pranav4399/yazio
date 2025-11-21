import type { UserProfile } from '~/schemas/userProfile'

// Single user profile for the welcome back page
export const USER: UserProfile = {
    id: 'user-001',
    name: 'Sarah',
    goal: 'lose-weight',
    dietaryPreference: 'balanced',
    timeCommitment: '30min'
}

// Default user (same as the single user for simplicity)
export const DEFAULT_USER = USER
