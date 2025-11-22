import { createClient } from '@supabase/supabase-js'

// Global Supabase client instance to avoid multiple instances
let supabaseClient: any = null

// Mock object for when Supabase is not available
const createMockSupabase = (errorMessage: string) => ({
  supabase: null,
  login: () => ({ success: false, error: errorMessage }),
  logout: () => {},
  isAuthenticated: () => false,
  getCurrentUser: () => null,
  profiles: { getUserProfile: () => null, updateUserProfile: () => false },
  quiz: { getQuizQuestions: () => null, updateQuizQuestions: () => false, deleteQuizQuestion: () => false },
  quizResponses: { saveQuizResponse: () => false, getUserQuizResponses: () => null },
  featureFlags: { getAllFeatureFlags: () => null, updateFeatureFlag: () => false },
  analytics: { trackEvent: () => false, getUserAnalytics: () => null, saveSessionEvent: () => {} }
})

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
      sessionStorage.removeItem('yazio_session_id') // Clear analytics session on logout
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

  const updateQuizQuestions = async (questions: any[]): Promise<boolean> => {
    try {
      // First get the existing quiz questions record ID
      const { data: existingRecord, error: selectError } = await supabase
        .from('quiz_questions')
        .select('id')
        .limit(1)
        .single()

      if (selectError || !existingRecord) {
        console.error('Error finding quiz questions record:', selectError)
        return false
      }

      // Update the specific record
      const { error: updateError } = await supabase
        .from('quiz_questions')
        .update({ questions, updated_at: new Date().toISOString() })
        .eq('id', existingRecord.id)

      if (updateError) {
        console.error('Error updating quiz questions:', updateError)
        return false
      }
      return true
    } catch (error) {
      console.error('Unexpected error updating quiz questions:', error)
      return false
    }
  }

  const deleteQuizQuestion = async (questionId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId)

    if (error) {
      console.error('Error deleting quiz question:', error)
      return false
    }
    return true
  }


  return {
    getQuizQuestions,
    updateQuizQuestions,
    deleteQuizQuestion
  }
}

// Feature flags functions
export const useSupabaseFeatureFlags = (supabase: any) => {

  const getAllFeatureFlags = async (): Promise<{ key: string; value: boolean }[] | null> => {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('key, value')

    if (error) return null

    const flags = await data;
    return flags;
  }

  const updateFeatureFlag = async (key: string, value: string): Promise<boolean> => {
    const { error } = await supabase
      .from('feature_flags')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)

    if (error) {
      console.error('Error updating feature flag:', error)
      return false
    }
    return true
  }

  return {
    getAllFeatureFlags,
    updateFeatureFlag
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
    // Fire-and-forget for performance, but with better session handling
    supabase
      .from('analytics')
      .select('id, data')
      .eq('user_id', userId)
      .eq('data->>sessionId', sessionId)
      .limit(1)
      .then(({ data: existingRecords, error: selectError }: any) => {
        if (selectError) {
          console.warn('❌ Error querying analytics:', selectError)
          return
        }

        const existing = existingRecords?.[0]

        if (existing) {
          // Session exists, update it by adding the new event
          const existingData = existing.data || {}
          const existingEvents = Array.isArray(existingData.events) ? existingData.events : []

          const updatedData = {
            ...existingData,
            events: [...existingEvents, event],
            lastUpdated: Date.now()
          }

          return supabase
            .from('analytics')
            .update({ data: updatedData })
            .eq('id', existing.id)
        } else {
          // Create new session record
          const sessionData = {
            sessionId,
            events: [event],
            startedAt: event.timestamp,
            lastUpdated: Date.now()
          }

          return supabase
            .from('analytics')
            .insert([{
              user_id: userId,
              data: sessionData
            }])
        }
      })
      .then(({ error }: any) => {
        if (error) {
          console.warn('❌ Analytics save error:', error)
        }
      })
      .catch((error: any) => {
        // Silently fail - analytics shouldn't break the app
        console.warn('❌ Analytics save failed (non-critical):', error)
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
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.error('Supabase configuration missing. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.')
      return createMockSupabase('Supabase not configured')
    }

    // Use global client instance to avoid multiple GoTrueClient instances
    if (!supabaseClient) {
      supabaseClient = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
    }

    return {
      supabase: supabaseClient,
      ...useSupabaseAuth(supabaseClient),
      profiles: useSupabaseProfiles(supabaseClient),
      quiz: useSupabaseQuiz(supabaseClient),
      quizResponses: useSupabaseQuizResponses(supabaseClient),
      featureFlags: useSupabaseFeatureFlags(supabaseClient),
      analytics: useSupabaseAnalytics(supabaseClient)
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error)
    return createMockSupabase('Supabase initialization failed')
  }
}
