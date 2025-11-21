import { z } from 'zod'

export const paywallVariantSchema = z.enum(['A', 'B', 'D', 'E'])
export type PaywallVariant = z.infer<typeof paywallVariantSchema>

// Paywall variant definitions with behavioral science principles
export interface PaywallVariantConfig {
  id: PaywallVariant
  headline: string
  subheadline: string
  benefits: string[]
  cta: string
  principles: string[] // Behavioral science principles used
  personalizationType: 'none' | 'goal' | 'goal+preferences' | 'full'
}

export const PAYWALL_VARIANTS: Record<PaywallVariant, PaywallVariantConfig> = {
  A: {
    id: 'A',
    headline: 'Join 50,000+ Successful Users',
    subheadline: 'Transform your health with nutritionist-approved plans backed by science and real results.',
    benefits: [
      'Personalized meal plans based on your goals',
      'Recipes approved by registered dietitians',
      'Track progress with detailed analytics',
      '24/7 support from nutrition experts'
    ],
    cta: 'Start Your Transformation',
    principles: ['authority', 'social_proof'],
    personalizationType: 'none'
  },
  B: {
    id: 'B',
    headline: 'Don\'t Lose Your Momentum',
    subheadline: 'You\'ve invested time defining your goals and preferences. Complete your transformation with a personalized plan that matches your commitment.',
    benefits: [
      'Custom plans built from your goal selections',
      'Recipes tailored to your dietary preferences',
      'Time-efficient meals for your schedule',
      'Ongoing support to stay committed'
    ],
    cta: 'Complete Your Journey',
    principles: ['loss_aversion', 'commitment_consistency'],
    personalizationType: 'goal+preferences'
  },
  D: {
    id: 'D',
    headline: 'People Like You Succeed 2x Faster',
    subheadline: 'Users with your same preferences lose 2x more weight in the first month. Start with achievable daily wins and build lasting habits.',
    benefits: [
      'Learn from successful users with similar goals',
      'Start with small, achievable changes',
      'Build sustainable healthy habits',
      'Track progress against similar users'
    ],
    cta: 'Join the Success Stories',
    principles: ['social_comparison', 'small_wins'],
    personalizationType: 'goal+preferences'
  },
  E: {
    id: 'E',
    headline: 'Your Custom Plan is Ready',
    subheadline: 'We\'ve analyzed your goals and created a personalized plan just for you. As a thank you for your time, get unlimited access for 30% off - your first recipe delivered instantly.',
    benefits: [
      'Instant access to your personalized plan',
      '30% discount on your first month',
      'No commitment, cancel anytime',
      'Expert guidance included'
    ],
    cta: 'Claim Your 30% Discount',
    principles: ['reciprocity', 'present_bias'],
    personalizationType: 'full'
  }
}

// Selection logic based on user data
export function selectPaywallVariant(userData: {
  goal: string
  dietaryPreference?: string
  timeCommitment?: string
  quizAnswers?: Array<{ questionId: string; answer: string }>
}): PaywallVariant {
  const { goal, dietaryPreference, timeCommitment, quizAnswers } = userData

  // Check for strong personalization signals
  const hasDetailedPreferences = dietaryPreference && timeCommitment
  const hasQuizAnswers = quizAnswers && quizAnswers.length > 0

  // Variant E: Full personalization (reciprocity + present bias)
  // Best for users who've provided detailed information
  if (hasDetailedPreferences && hasQuizAnswers) {
    return 'E'
  }

  // Variant B: Goal + preferences (loss aversion + commitment)
  // Good for users with clear goals and some preferences
  if (goal && (dietaryPreference || timeCommitment)) {
    return 'B'
  }

  // Variant D: Social comparison (good for weight loss goals)
  // Effective for goal-oriented users
  if (goal === 'lose-weight' || goal === 'build-muscle') {
    return 'D'
  }

  // Variant A: Authority + social proof (fallback)
  // Works for all users, especially those with minimal data
  return 'A'
}