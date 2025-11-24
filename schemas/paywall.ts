import { z } from 'zod'

export const paywallVariantSchema = z.enum(['B', 'C'])
export type PaywallVariant = z.infer<typeof paywallVariantSchema>

export interface PaywallVariantConfig {
  id: PaywallVariant
  headline: string
  subheadline: string
  benefits: string[]
  cta: string
  principles: string[]
  personalizationType: 'none' | 'goal' | 'goal+preferences' | 'full'
}

export const PAYWALL_VARIANTS: Record<PaywallVariant, PaywallVariantConfig> = {
  // A: {
  //   id: 'A',
  //   headline: 'Take your Yazio journey to the next level',
  //   subheadline: 'You\'ve already started tracking with us - now let\'s add the guidance and motivation to turn those good habits into lasting results.',
  //   benefits: [
  //     'Personalized coaching based on your tracking history',
  //     'Daily encouragement tailored to your progress',
  //     'Advanced insights from your existing data',
  //     'Expert support when you need it most'
  //   ],
  //   cta: 'Upgrade Your Journey',
  //   principles: ['continuity', 'progress_acceleration'],
  //   personalizationType: 'goal'
  // },
  B: {
    id: 'B',
    headline: 'You\'ve built great habits. Now optimize them.',
    subheadline: 'Your clear goals and consistent tracking show real commitment. Let\'s create a premium plan that maximizes your progress.',
    benefits: [
      'Advanced meal plans built on your preferences',
      'Pro recipes that complement your current routine',
      'Time-saving tools for busy schedules',
      'Priority support from nutrition experts'
    ],
    cta: 'Elevate Your Results',
    principles: ['optimization', 'expertise'],
    personalizationType: 'goal+preferences'
  },
  C: {
    id: 'C',
    headline: 'Accelerate your progress with premium features',
    subheadline: 'You know Yazio works - now experience the full potential with expert guidance and advanced tools designed for dedicated users like you.',
    benefits: [
      'Professional meal planning and recipes',
      'In-depth progress analytics and insights',
      'Direct access to registered dietitians',
      'Advanced customization options'
    ],
    cta: 'Unlock Premium Benefits',
    principles: ['acceleration', 'expert_support'],
    personalizationType: 'goal'
  }
}

const GOAL_MAP = {
  'lose-weight': 'specific',
  'gain-weight': 'specific',
  'maintain-weight': 'general',
  'build-muscle': 'specific',
  'improve-health': 'general'
}

const DIETARY_PREFERENCE_MAP = {
  'balanced': 'specific',
  'quick-recipes': 'specific',
  'meal-prep': 'specific',
  'flexible': 'general',
  '': 'general'
}

const TIME_COMMITMENT_MAP = {
  '15min': 'specific',
  '30min': 'specific',
  '1hour': 'specific',
  'flexible': 'general',
  '': 'general'
}

const REASON_FOR_DOING_MAP = ['me', 'myself', 'i', 'health', 'fitness', 'body'];

export function selectPaywallVariant(userData: {
  goal: string
  dietaryPreference?: string
  timeCommitment?: string
  quizAnswers?: Array<{ questionId: string; answer: string }>
}): PaywallVariant {

  const { goal, dietaryPreference, timeCommitment, quizAnswers } = userData

  const biggestChallengeAnswer = quizAnswers?.find((answer) => answer.questionId === 'biggest-challenge')?.answer
  const morningRoutineDisciplineAnswer = quizAnswers?.find((answer) => answer.questionId === 'morning-routine-discipline')?.answer
  const doingForThemselfAnswer = REASON_FOR_DOING_MAP.includes(quizAnswers?.find((answer) => answer.questionId === 'reason-for-doing')?.answer as string) || false;
  
  const goalType = GOAL_MAP[goal as keyof typeof GOAL_MAP]
  const dietaryPreferenceType = DIETARY_PREFERENCE_MAP[dietaryPreference as keyof typeof DIETARY_PREFERENCE_MAP]
  const timeCommitmentType = TIME_COMMITMENT_MAP[timeCommitment as keyof typeof TIME_COMMITMENT_MAP]
  
  
  const isBusySchedule = biggestChallengeAnswer === "busy-schedule";
  const isDisciplined = morningRoutineDisciplineAnswer === "yes";
  const hasIntrinsicMotivation = doingForThemselfAnswer;

  const hasSpecificGoal = goalType === "specific";
  const hasSpecificDietaryPreference = dietaryPreferenceType === "specific";
  const hasSpecificTimeCommitment = timeCommitmentType === "specific";
  

  // VARIANT B: STRUCUTURE

  if (
    (isBusySchedule &&
      (isDisciplined || hasIntrinsicMotivation)) ||
    (hasSpecificGoal &&
      (hasSpecificDietaryPreference || hasSpecificTimeCommitment))
  ) {
    // Highly motivated and knows what they want
    return 'B'
  }

  // VARIANT A: MOTIVATION

  if (
    (!isBusySchedule &&
      (!isDisciplined || !hasIntrinsicMotivation)) ||
    (!hasSpecificGoal &&
      (!hasSpecificDietaryPreference || !hasSpecificTimeCommitment))
  ) {
    // Need Help with Habit Formation
    return "A";
  }

  return 'C'
}

export function variantHash(userId: string) {
  const str = String(userId);
  let hash = 5381;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }

  // Convert to unsigned 32-bit integer
  return (hash >>> 0) % 2;

}