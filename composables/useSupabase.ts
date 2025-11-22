import { createClient } from '@supabase/supabase-js'

// Types matching our database schema
export interface User {
  id: string
  username: string
  password: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  name: string
  goal: string
  dietary_preference?: string
  time_commitment?: string
  created_at: string
  updated_at: string
}

export interface QuizQuestions {
  id: string
  questions: any[]
  created_at: string
}

export interface FeatureFlag {
  id: string
  key: string
  value: string
  created_at: string
  updated_at: string
}

export interface DatabaseAnalyticsEvent {
  user_id?: string
  data: Record<string, any>
}

// Authentication functions
export const useSupabaseAuth = (supabase: any) => {

  const login = async (username: string, password: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error || !data) {
      return { success: false, error: 'Invalid credentials' }
    }

    if (process.client) {
      localStorage.setItem('user', JSON.stringify(data))
    }

    return { success: true, user: data }
  }

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('user')
    }
  }

  const getCurrentUser = (): User | null => {
    if (!process.client) return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null
  }

  return {
    login,
    logout,
    getCurrentUser,
    isAuthenticated
  }
}

// User profile functions
export const useSupabaseProfiles = (supabase: any) => {

  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data
  }

  const updateUserProfile = async (userId: string, updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>): Promise<boolean> => {
    console.log('updates', updates)
    const { error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating user profile:', error)
      return false
    }
    return true
  }

  return {
    getUserProfile,
    updateUserProfile
  }
}

// Quiz functions
export const useSupabaseQuiz = (supabase: any) => {

  const getQuizQuestions = async (): Promise<any[] | null> => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('questions')
      .single()

    if (error) return null
    return data.questions
  }

  return {
    getQuizQuestions
  }
}

// Feature flags functions
export const useSupabaseFeatureFlags = (supabase: any) => {

  const getFeatureFlag = async (key: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('value')
      .eq('key', key)
      .single()

    if (error) return null
    return data.value
  }

  const getAllFeatureFlags = async (): Promise<Record<string, string> | null> => {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('key, value')

    if (error) return null

    const flags: Record<string, string> = {}
    data.forEach((flag: any) => {
      flags[flag.key] = flag.value
    })

    return flags
  }

  return {
    getFeatureFlag,
    getAllFeatureFlags
  }
}

// Quiz responses functions
export const useSupabaseQuizResponses = (supabase: any) => {

  const saveQuizResponse = async (
    userId: string,
    questionId: string,
    answer: string,
    skipped: boolean,
    timeSpent: number
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('quiz_responses')
        .upsert(
          {
            user_id: userId,
            question_id: questionId,
            answer,
            skipped,
            time_spent: timeSpent
          },
          { onConflict: 'user_id,question_id' }
        )
  
      if (error) {
        console.error('Error saving quiz response:', error)
        return false
      }
  
      return true
  
    } catch (err) {
      console.error('Unexpected error:', err)
      return false
    }
  }
  

  const getUserQuizResponses = async (userId: string): Promise<any[] | null> => {
    const { data, error } = await supabase
      .from('quiz_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) return null
    return data
  }

  return {
    saveQuizResponse,
    getUserQuizResponses
  }
}

// Analytics functions (page views, general events only)
export const useSupabaseAnalytics = (supabase: any) => {

  const trackEvent = async (eventData: DatabaseAnalyticsEvent): Promise<boolean> => {
    const { error } = await supabase
      .from('analytics')
      .insert([eventData])

    return !error
  }

  const saveSessionEvent = (userId: string, sessionId: string, event: any): void => {
    // Fire-and-forget: Don't await, don't handle errors
    // This prevents blocking UI for analytics
    supabase
      .from('analytics')
      .select('id, data')
      .eq('user_id', userId)
      .eq('data->>sessionId', sessionId)
      .maybeSingle()
      .then(({ data: existing, error: selectError }: any) => {
        const sessionData = {
          sessionId,
          events: [event],
          startedAt: event.timestamp,
          lastUpdated: Date.now()
        }

        if (existing && !selectError) {
          // Session exists, add to existing events
          const existingEvents = existing.data?.events || []
          sessionData.events = [...existingEvents, event]
          sessionData.startedAt = existing.data?.startedAt || event.timestamp

          // Update existing record
          return supabase
            .from('analytics')
            .update({ data: sessionData })
            .eq('id', existing.id)
        } else {
          // Create new session record
          return supabase
            .from('analytics')
            .insert([{
              user_id: userId,
              data: sessionData
            }])
        }
      })
      .catch((error: any) => {
        // Silently fail - analytics shouldn't break the app
        console.warn('Analytics save failed (non-critical):', error)
      })
  }

  const getUserAnalytics = async (userId: string, limit = 100): Promise<any[] | null> => {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return null
    return data
  }

  return {
    trackEvent,
    getUserAnalytics,
    saveSessionEvent
  }
}

// Main composable that combines everything
export const useSupabase = () => {
  try {
    const config = useRuntimeConfig()

    if (!config.public.supabase?.url || !config.public.supabase?.anonKey) {
      console.error('Supabase configuration missing. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.')
      // Return a mock object to prevent crashes
      return {
        supabase: null,
        login: () => ({ success: false, error: 'Supabase not configured' }),
        isAuthenticated: () => false,
        getCurrentUser: () => null,
        profiles: { getUserProfile: () => null, updateUserProfile: () => false },
        quiz: { getQuizQuestions: () => null },
        quizResponses: { saveQuizResponse: () => false, getUserQuizResponses: () => null },
        featureFlags: { getFeatureFlag: () => null, getAllFeatureFlags: () => null },
        analytics: { saveSessionEvent: () => {} }
      }
    }

    const supabase = createClient(config.public.supabase.url, config.public.supabase.anonKey)

    return {
      supabase,
      ...useSupabaseAuth(supabase),
      profiles: useSupabaseProfiles(supabase),
      quiz: useSupabaseQuiz(supabase),
      quizResponses: useSupabaseQuizResponses(supabase),
      featureFlags: useSupabaseFeatureFlags(supabase),
      analytics: useSupabaseAnalytics(supabase)
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error)
    // Return a mock object to prevent crashes
    return {
      supabase: null,
      login: () => ({ success: false, error: 'Supabase initialization failed' }),
      isAuthenticated: () => false,
      getCurrentUser: () => null,
      profiles: { getUserProfile: () => null, updateUserProfile: () => false },
      quiz: { getQuizQuestions: () => null },
      quizResponses: { saveQuizResponse: () => false, getUserQuizResponses: () => null },
      featureFlags: { getFeatureFlag: () => null, getAllFeatureFlags: () => null },
      analytics: { saveSessionEvent: () => {} }
    }
  }
}
