import { nextTick, onMounted, onUnmounted, readonly, ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

// Analytics event types
export interface AnalyticsEvent {
  event: string
  page?: string
  timestamp: number
  data?: Record<string, any>
  sessionId: string
  userId?: string
}

// User flow analytics
export interface PageVisit {
  page: string
  enteredAt: number
  leftAt?: number
  duration?: number
  durationFormatted?: string
  fromPage?: string
}

// Quiz analytics
export interface QuizAnswerEvent {
  questionId: string
  questionIndex: number
  answer: string
  timeSpent: number
  skipped: boolean
  timestamp: number
}

// Analytics data store
const analyticsEvents = ref<AnalyticsEvent[]>([])
const pageVisits = ref<PageVisit[]>([])
const currentPage = ref<string>('')
const pageEntryTime = ref<number>(0)
const lastVisitedPage = ref<string>('')
const sessionId = ref<string>('')

// Generate session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Initialize session
const initSession = () => {
  if (!sessionId.value) {
    sessionId.value = generateSessionId()
  }
}

// Format duration in human readable format
const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

// Track page visit
const trackPageVisit = (page: string, fromPage?: string) => {
  // Determine fromPage before completing the previous visit
  let actualFromPage = fromPage

  if (!actualFromPage) {
    // First check if we have internal tracking
    if (currentPage.value) {
      actualFromPage = currentPage.value
    } else if (lastVisitedPage.value) {
      actualFromPage = lastVisitedPage.value
    }
  }

  // Complete previous page visit if exists
  if (currentPage.value && pageEntryTime.value) {
    const visitIndex = pageVisits.value.findIndex(v => v.page === currentPage.value && !v.leftAt)
    if (visitIndex >= 0) {
      pageVisits.value[visitIndex].leftAt = Date.now()
      pageVisits.value[visitIndex].duration = pageVisits.value[visitIndex].leftAt - pageVisits.value[visitIndex].enteredAt
      pageVisits.value[visitIndex].durationFormatted = formatDuration(pageVisits.value[visitIndex].duration!)
    }
  }

  // Update tracking state
  lastVisitedPage.value = currentPage.value || lastVisitedPage.value
  currentPage.value = page
  pageEntryTime.value = Date.now()

  const visit: PageVisit = {
    page,
    enteredAt: pageEntryTime.value,
    fromPage: actualFromPage || undefined
  }

  pageVisits.value.push(visit)

  // Track page visit event (fire-and-forget)
  trackEvent('page_visit', page, { fromPage: actualFromPage })
}

// Track generic events - save immediately to Supabase (fire-and-forget)
const trackEvent = (event: string, page: string, data?: Record<string, any>) => {
  try {
    const { analytics: supabaseAnalytics, getCurrentUser } = useSupabase()
    const currentUser = getCurrentUser()

    if (!currentUser) {
      console.warn('Cannot track analytics event: User not authenticated')
      return
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      page,
      timestamp: Date.now(),
      data: data || {},
      sessionId: sessionId.value,
      userId: currentUser.id
    }

    // Save event immediately to Supabase (fire-and-forget - no await, no error handling)
    supabaseAnalytics.saveSessionEvent(currentUser.id, sessionId.value, analyticsEvent)

    // Keep local tracking for immediate access if needed
    analyticsEvents.value.push(analyticsEvent)
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.warn('Analytics tracking failed:', error)
  }
}

// Track quiz answers
const trackQuizAnswer = (questionId: string, questionIndex: number, answer: string, timeSpent: number, skipped: boolean = false) => {
  const quizEvent: QuizAnswerEvent = {
    questionId,
    questionIndex,
    answer,
    timeSpent,
    skipped,
    timestamp: Date.now()
  }

  trackEvent('quiz_answer', 'quiz', quizEvent)
}

// Track user interactions
const trackInteraction = (interaction: string, element: string, data?: Record<string, any>) => {
  trackEvent('user_interaction', currentPage.value, {
    interaction,
    element,
    ...data
  })
}

// Track form submissions
const trackFormSubmit = (formName: string, success: boolean, data?: Record<string, any>) => {
  trackEvent('form_submit', currentPage.value, {
    formName,
    success,
    ...data
  })
}

// Track errors
const trackError = (error: string, context?: Record<string, any>) => {
  trackEvent('error', currentPage.value, {
    error,
    ...context
  })
}

// Get analytics data (for debugging or exporting)
const getAnalyticsData = () => {
  return {
    events: analyticsEvents.value,
    pageVisits: pageVisits.value,
    sessionId: sessionId.value,
    currentPage: currentPage.value
  }
}

// Clear analytics data (useful for testing)
const clearAnalyticsData = () => {
  analyticsEvents.value = []
  pageVisits.value = []
  currentPage.value = ''
  pageEntryTime.value = 0
}


// Vue composable
export const useAnalytics = () => {
  // Initialize session on first use
  initSession()

  // Track page leave when component unmounts
  onUnmounted(() => {
    if (currentPage.value && pageEntryTime.value) {
      const visitIndex = pageVisits.value.findIndex(v => v.page === currentPage.value && !v.leftAt)
      if (visitIndex >= 0) {
        pageVisits.value[visitIndex].leftAt = Date.now()
        pageVisits.value[visitIndex].duration = pageVisits.value[visitIndex].leftAt - pageVisits.value[visitIndex].enteredAt
        pageVisits.value[visitIndex].durationFormatted = formatDuration(pageVisits.value[visitIndex].duration!)
      }
    }
  })

  return {
    // Page tracking
    trackPageVisit,

    // Event tracking
    trackEvent,
    trackInteraction,
    trackFormSubmit,
    trackError,

    // Quiz specific
    trackQuizAnswer,

    // Data management
    getAnalyticsData,
    clearAnalyticsData,

    // Reactive data for components that need it
    currentPage: readonly(currentPage),
    sessionId: readonly(sessionId)
  }
}

// Page-level composable for automatic page tracking
export const usePageAnalytics = (pageName: string) => {
  const analytics = useAnalytics()

  onMounted(() => {
    // Wait for next tick to ensure route is available
    nextTick().then(() => {
      // Let analytics system determine fromPage internally
      analytics.trackPageVisit(pageName)
    })
  })

  return analytics
}
