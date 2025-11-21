# YAZIO Welcome Back Funnel - Design Document

## Table of Contents
1. [Screen Flows](#screen-flows)
2. [UI Design Principles](#ui-design-principles)
3. [Behavioral Science Integration](#behavioral-science-integration)
4. [Accessibility Considerations](#accessibility-considerations)
5. [Implementation Recommendations](#implementation-recommendations)

---

## Screen Flows

### Flow Overview

The "Welcome Back" funnel consists of 4-5 screens designed to re-engage users who previously started but didn't convert to Pro. The flow progressively collects information and personalizes the final CTA.

### Detailed Screen Flow

#### Screen 1: Welcome Back
**Purpose**: Re-establish connection and reduce friction

**Content**:
- Personalized greeting: "Welcome back, [Name]!"
- Brief acknowledgment: "We noticed you were interested in [previous goal]"
- Clear value proposition: "Let's pick up where you left off"
- Primary CTA: "Continue" button
- Secondary option: "Start fresh" (optional)

**User Actions**:
- Click "Continue" → Proceed to Screen 2
- Click "Start fresh" → Reset flow (optional)

**Data Used**:
- User name (from profile)
- Previous goal (from profile)

**Tracking Events**:
- `welcome_back_viewed`
- `continue_clicked`
- `start_fresh_clicked` (if implemented)

---

#### Screen 2: Confirm Goal
**Purpose**: Validate existing data and allow user control

**Content**:
- Pre-filled goal selection: "[Previous Goal]" (e.g., "Lose weight")
- Options to change goal:
  - Lose weight
  - Gain weight
  - Maintain weight
  - Build muscle
  - Improve health
- Progress indicator: "Step 1 of 4"
- Primary CTA: "Continue" button

**User Actions**:
- Confirm existing goal → Proceed to Screen 3
- Change goal → Update profile, proceed to Screen 3

**Data Used**:
- Previous goal (pre-filled)
- Updated goal (if changed)

**Tracking Events**:
- `goal_confirmation_viewed`
- `goal_confirmed` (with goal value)
- `goal_changed` (with old and new goal values)

---

#### Screen 3: Quiz Steps (1-3 Questions)
**Purpose**: Gather additional preferences for deeper personalization

**Question Examples**:

**Question 1: Dietary Preference**
- "What's your preferred eating style?"
- Options:
  - Balanced meals
  - Quick recipes
  - Meal prep friendly
  - Flexible/No preference

**Question 2: Time Commitment**
- "How much time can you dedicate daily?"
- Options:
  - 15 minutes or less
  - 30 minutes
  - 1 hour or more
  - Flexible

**Question 3: Motivation Style** (Optional)
- "What motivates you most?"
- Options:
  - Seeing progress
  - Community support
  - Expert guidance
  - Flexible tracking

**UI Elements**:
- Progress indicator: "Step 2 of 4" (updates per question)
- Question text (large, clear)
- Radio buttons or cards for options
- "Back" button (optional)
- "Continue" button (disabled until selection)

**User Actions**:
- Select answer → Enable "Continue" button
- Click "Continue" → Proceed to next question or Screen 4
- Click "Back" → Return to previous question (if implemented)

**Data Collected**:
- Dietary preference
- Time commitment
- Motivation style (optional)

**Tracking Events**:
- `quiz_question_viewed` (with question_id)
- `quiz_answer_selected` (with question_id and answer)
- `quiz_completed`

---

#### Screen 4: Summary
**Purpose**: Confirm collected data and build commitment

**Content**:
- Summary header: "Let's confirm your preferences"
- Display sections:
  - **Your Goal**: [Selected goal]
  - **Eating Style**: [Selected preference]
  - **Time Available**: [Selected time]
  - **What Motivates You**: [Selected motivation] (if collected)
- Edit links next to each section
- Primary CTA: "Looks good, continue" button
- Progress indicator: "Step 3 of 4"

**User Actions**:
- Review summary
- Click edit link → Return to specific screen/question
- Click "Continue" → Proceed to Screen 5 (Paywall/CTA)

**Data Displayed**:
- Combined profile data + new quiz answers

**Tracking Events**:
- `summary_viewed`
- `summary_edited` (with section edited)
- `summary_confirmed`

---

#### Screen 5: Paywall / CTA (A/B/C Variants)
**Purpose**: Convert user to Pro with personalized messaging

**Variant A: Control (Generic)**
- Generic headline: "Upgrade to Yazio Pro"
- Generic benefits list:
  - Track unlimited meals
  - Access to premium recipes
  - Advanced nutrition insights
  - Ad-free experience
- Generic CTA: "Start Pro Trial"
- Pricing display

**Variant B: Goal-Based Personalization**
- Personalized headline: "Reach your [Goal] faster with Pro"
- Goal-specific benefits:
  - For "Lose weight": "Personalized meal plans for weight loss"
  - For "Gain weight": "Calorie-dense meal suggestions"
  - For "Build muscle": "Protein-focused nutrition tracking"
- Personalized CTA: "Start my [Goal] journey"
- Pricing display

**Variant C: Deep Personalization**
- Highly personalized headline: "[Goal] with [Preference] recipes in [Time]"
- Example: "Lose weight with quick recipes in 15 minutes"
- Combined benefits:
  - Goal-specific value
  - Preference-matched content
  - Time-appropriate suggestions
- Personalized CTA: "Get my personalized plan"
- Social proof: "Join 2M+ users achieving their goals"
- Pricing display

**User Actions**:
- Click CTA → Track conversion event
- Click "Maybe later" → Track exit event (optional)
- View pricing details

**Data Used**:
- User goal
- Dietary preference
- Time commitment
- Motivation style (if collected)

**Tracking Events**:
- `paywall_viewed` (with variant_id)
- `cta_clicked` (with variant_id)
- `conversion_completed` (with variant_id and user_segment)

---

## UI Design Principles

### Visual Hierarchy
1. **Primary Actions**: Large, high-contrast buttons with clear labels
2. **Secondary Actions**: Smaller, less prominent styling
3. **Information**: Clear typography hierarchy (headings, body, captions)
4. **Progress Indicators**: Visible but non-intrusive

### Layout Guidelines
- **Mobile-first**: Responsive design prioritizing mobile experience
- **Consistent Spacing**: Use design system spacing scale (4px or 8px base)
- **Content Width**: Max-width for readability (e.g., 600px on desktop)
- **White Space**: Generous spacing to reduce cognitive load

### Color & Contrast
- **WCAG AA Compliance**: Minimum 4.5:1 contrast ratio for text
- **Primary CTA**: High-contrast, action-oriented color (e.g., brand primary)
- **Disabled States**: Clear visual distinction (reduced opacity, different color)
- **Error States**: Clear error messaging with accessible colors

### Typography
- **Headings**: Large, bold, clear hierarchy (H1: 32px, H2: 24px, H3: 20px)
- **Body Text**: Readable size (16px minimum, 18px preferred)
- **Line Height**: 1.5-1.6 for body text
- **Font Weight**: Use weight variations for emphasis, not size alone

### Component Patterns
- **Form Inputs**: Clear labels, helpful placeholders, error states
- **Buttons**: Consistent sizing, clear states (default, hover, active, disabled)
- **Cards**: Subtle shadows, rounded corners for modern feel
- **Progress Indicators**: Visual progress (steps, progress bar, percentage)

### Responsive Breakpoints
- **Mobile**: < 768px (primary focus)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## Behavioral Science Integration

### 1. **Habit Formation & Consistency**
- **Application**: Pre-fill user's previous goal to leverage consistency bias
- **Rationale**: Users are more likely to confirm existing choices than make new ones
- **Implementation**: Screen 2 pre-fills previous goal, making confirmation easier than change

### 2. **Endowed Progress Effect**
- **Application**: Show progress indicators ("Step 2 of 4") throughout the flow
- **Rationale**: Users who see progress are more likely to complete the journey
- **Implementation**: Progress bar or step indicator on each screen

### 3. **Optimal Challenge**
- **Application**: Limit quiz to 1-3 questions (not overwhelming)
- **Rationale**: Too many questions cause abandonment; too few reduce personalization value
- **Implementation**: Start with 2 questions, add third only if needed

### 4. **Stimulus Devaluation**
- **Application**: Show summary before paywall to reinforce value
- **Rationale**: Reminding users of their inputs increases perceived value of the outcome
- **Implementation**: Screen 4 summary reinforces user's investment in the process

### 5. **Choice Architecture**
- **Application**: Limit options per question (4-5 max)
- **Rationale**: Too many choices cause decision paralysis
- **Implementation**: Radio buttons or card selection with 3-5 options per question

### 6. **Cognitive Load Balancing**
- **Application**: One question per screen, clear visual hierarchy
- **Rationale**: Reducing cognitive load increases completion rates
- **Implementation**: Single question focus, large text, clear options

### 7. **Personalization & Relevance**
- **Application**: Variant C combines multiple data points for deeper personalization
- **Rationale**: More relevant content increases conversion likelihood
- **Implementation**: Merge goal + preference + time for hyper-personalized messaging

### 8. **Social Proof**
- **Application**: "Join 2M+ users" in Variant C
- **Rationale**: Social proof increases trust and conversion
- **Implementation**: Add social proof elements to premium variants

### 9. **Anchoring**
- **Application**: Show pricing with value comparison
- **Rationale**: Anchoring users to value before price reduces price sensitivity
- **Implementation**: Benefits first, then pricing

### 10. **Sunk Cost Effect**
- **Application**: Summary screen shows user's investment (time, answers)
- **Rationale**: Users who've invested time are more likely to complete
- **Implementation**: Display all collected data in summary

### 11. **Soft Incentives**
- **Application**: "Start Pro Trial" implies low commitment
- **Rationale**: Trial language reduces perceived risk
- **Implementation**: Use "trial" language, not "purchase" language

### 12. **Stopping Rules**
- **Application**: Allow skipping questions (nice-to-have)
- **Rationale**: Forcing completion increases abandonment
- **Implementation**: "Skip" option on quiz questions (optional)

### A/B Testing Strategy

**Hypothesis**: Personalized content (Variants B & C) will have higher conversion rates than generic content (Control A).

**Metrics to Track**:
- **Primary**: Conversion rate (CTA click → Pro signup)
- **Secondary**: 
  - Completion rate (users who reach paywall)
  - Time to conversion
  - Drop-off points
  - Engagement depth (questions answered)

**Allocation Strategy**:
- Deterministic assignment based on `user_id % 3`
  - 0 → Variant A (Control)
  - 1 → Variant B (Goal-based)
  - 2 → Variant C (Deep personalization)
- Ensures consistent experience per user

**Statistical Considerations**:
- Minimum sample size: 100 users per variant for statistical significance
- Track for at least 1 week to account for day-of-week effects
- Monitor for selection bias (e.g., user segment differences)

---

## Accessibility Considerations

### WCAG 2.1 Compliance (Target: Level AA)

#### 1. **Semantic HTML**
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (`<main>`, `<section>`, `<nav>`, `<form>`)
- Use `<button>` for actions, not `<div>` or `<span>`
- Use `<label>` for form inputs

**Example**:
```html
<main>
  <h1>Welcome back, Sarah!</h1>
  <section>
    <h2>Confirm your goal</h2>
    <form>
      <fieldset>
        <legend>What's your goal?</legend>
        <label>
          <input type="radio" name="goal" value="lose-weight" />
          Lose weight
        </label>
      </fieldset>
    </form>
  </section>
</main>
```

#### 2. **ARIA Attributes**
- Use `aria-label` for icon-only buttons
- Use `aria-describedby` for form help text
- Use `aria-live` for dynamic content updates
- Use `aria-current="step"` for progress indicators

**Example**:
```html
<nav aria-label="Progress">
  <ol>
    <li aria-current="step">Welcome</li>
    <li>Confirm Goal</li>
    <li>Quiz</li>
    <li>Summary</li>
  </ol>
</nav>
```

#### 3. **Keyboard Navigation**
- All interactive elements must be keyboard accessible
- Logical tab order (top to bottom, left to right)
- Visible focus indicators (2px outline, high contrast)
- Skip links for main content
- Escape key to close modals/overlays

**Focus Management**:
- Focus moves to next screen's primary CTA on navigation
- Focus trap in modals
- Focus visible on all interactive elements

#### 4. **Screen Reader Support**
- Descriptive alt text for images (if any)
- Hidden labels for icon-only buttons
- Announce dynamic content changes (e.g., progress updates)
- Form validation announcements

**Example**:
```html
<button aria-label="Continue to next step">
  <span aria-hidden="true">→</span>
  <span class="sr-only">Continue</span>
</button>
```

#### 5. **Color & Contrast**
- Text contrast: Minimum 4.5:1 for normal text, 3:1 for large text
- Interactive elements: 3:1 contrast for focus indicators
- Don't rely on color alone to convey information
- Use icons + text, not just color

**Testing Tools**:
- WebAIM Contrast Checker
- axe DevTools
- Lighthouse accessibility audit

#### 6. **Form Accessibility**
- All inputs have associated labels
- Required fields marked with `aria-required="true"`
- Error messages linked with `aria-describedby`
- Clear error messaging (not just color)

**Example**:
```html
<label for="goal">
  What's your goal?
  <span aria-label="required">*</span>
</label>
<select id="goal" aria-required="true" aria-describedby="goal-error">
  <option value="">Select a goal</option>
  <option value="lose-weight">Lose weight</option>
</select>
<div id="goal-error" role="alert" aria-live="polite"></div>
```

#### 7. **Responsive & Mobile Accessibility**
- Touch targets minimum 44x44px (iOS) or 48x48px (Android)
- Sufficient spacing between interactive elements
- Text scales up to 200% without horizontal scrolling
- Landscape and portrait orientations supported

#### 8. **Animation & Motion**
- Respect `prefers-reduced-motion` media query
- Provide option to disable animations
- No auto-playing animations longer than 3 seconds

**Example**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 9. **Error Handling**
- Clear, descriptive error messages
- Errors announced to screen readers
- Focus moved to first error field
- Errors persist until corrected

#### 10. **Testing Checklist**
- [ ] Keyboard navigation works end-to-end
- [ ] Screen reader (NVDA/JAWS/VoiceOver) tested
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible on all interactive elements
- [ ] Forms accessible and validated
- [ ] Dynamic content announced properly
- [ ] Mobile touch targets adequate size
- [ ] Reduced motion preferences respected

---

## Implementation Recommendations

### Technology Stack
- **Framework**: Nuxt 3 (Vue 3) with TypeScript
- **UI Components**: Naive UI (Vue 3 component library)
- **State Management**: `useState` composable (Nuxt 3 built-in, SSR-friendly)
- **Form Validation**: Zod (schema validation)
- **A/B Testing**: GrowthBook (feature flags & experimentation)
- **Testing**: Playwright for E2E, Vitest for unit tests
- **Styling**: TailwindCSS
- **Analytics**: Google Analytics (event tracking)
- **Error Monitoring**: Sentry (optional, for production)

### Data Structure

**User Profile (with Zod schema)**:
```typescript
import { z } from 'zod'

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  goal: z.enum(['lose-weight', 'gain-weight', 'maintain-weight', 'build-muscle', 'improve-health']),
  dietaryPreference: z.enum(['balanced', 'quick-recipes', 'meal-prep', 'flexible']).optional(),
  timeCommitment: z.enum(['15min', '30min', '1hour', 'flexible']).optional(),
  motivationStyle: z.enum(['progress', 'community', 'expert', 'tracking']).optional(),
})

export type UserProfile = z.infer<typeof userProfileSchema>
```

**Personalization Mapping**:
```typescript
interface PersonalizationContent {
  variant: 'control' | 'goal-based' | 'deep';
  headline: string;
  benefits: string[];
  cta: string;
}
```

### GrowthBook Integration

**Setup**:
```typescript
// composables/useGrowthBook.ts
import { GrowthBook } from '@growthbook/growthbook'

export const useGrowthBook = () => {
  const gb = new GrowthBook({
    apiHost: 'https://cdn.growthbook.io',
    clientKey: process.env.GROWTHBOOK_CLIENT_KEY,
    enableDevMode: true,
  })

  // Set user attributes for targeting
  gb.setAttributes({
    id: userProfile.value.id,
    goal: userProfile.value.goal,
  })

  // Get variant for A/B test
  const variant = gb.getFeatureValue('welcome-back-variant', 'control')
  
  return { gb, variant }
}
```

**Usage in Components**:
```vue
<script setup lang="ts">
const { variant } = useGrowthBook()
// variant will be 'control', 'goal-based', or 'deep'
</script>
```

### Zod Validation Example

```typescript
// schemas/quizAnswer.ts
import { z } from 'zod'

export const quizAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string().min(1, 'Please select an answer'),
})

export const userFlowSchema = z.object({
  currentStep: z.number().min(1).max(5),
  answers: z.array(quizAnswerSchema),
  profile: userProfileSchema,
})
```

### Event Tracking Schema

```typescript
interface TrackingEvent {
  event: string;
  userId: string;
  timestamp: number;
  properties: {
    screen?: string;
    variant?: string;
    goal?: string;
    // ... other contextual data
  };
}
```

### Key Implementation Files

1. **`/composables/usePersonalization.ts`**: Personalization logic
2. **`/composables/useGrowthBook.ts`**: GrowthBook integration for A/B testing
3. **`/composables/useUserFlow.ts`**: Flow state management (using `useState`)
4. **`/composables/useAnalytics.ts`**: Google Analytics event tracking
5. **`/schemas/userProfile.ts`**: Zod schemas for validation
6. **`/components/WelcomeBack.vue`**: Screen 1 component (Naive UI)
7. **`/components/ConfirmGoal.vue`**: Screen 2 component (Naive UI)
8. **`/components/QuizStep.vue`**: Screen 3 component (Naive UI)
9. **`/components/Summary.vue`**: Screen 4 component (Naive UI)
10. **`/components/PaywallCTA.vue`**: Screen 5 component with variants (Naive UI)
11. **`/tests/e2e/welcome-back-flow.spec.ts`**: E2E test suite (Playwright)
12. **`/tests/unit/composables/usePersonalization.test.ts`**: Unit tests (Vitest)

### Performance Considerations
- Lazy load components for screens not yet viewed
- Optimize images (WebP format, lazy loading)
- Minimize JavaScript bundle size
- Use server-side rendering (SSR) for initial load
- Implement proper caching strategies

### Security Considerations
- Sanitize user inputs
- Validate data on both client and server
- Use HTTPS for all data transmission
- Implement rate limiting for API calls
- Protect against XSS and CSRF attacks

---

## Success Metrics

### Primary Metrics
- **Conversion Rate**: % of users who complete flow and click CTA
- **Completion Rate**: % of users who reach paywall screen
- **Variant Performance**: Conversion rate by variant (A vs B vs C)

### Secondary Metrics
- **Drop-off Points**: Where users abandon the flow
- **Time to Complete**: Average time from start to CTA click
- **Question Completion**: % of users who answer all questions
- **Edit Rate**: % of users who edit summary screen

### Analytics Events to Track

1. `welcome_back_viewed`
2. `continue_clicked`
3. `goal_confirmed` / `goal_changed`
4. `quiz_question_viewed`
5. `quiz_answer_selected`
6. `quiz_completed`
7. `summary_viewed`
8. `summary_edited`
9. `summary_confirmed`
10. `paywall_viewed` (with variant)
11. `cta_clicked` (with variant)
12. `conversion_completed` (with variant)

---

## Additional Libraries to Consider

### Core Stack (Already in Use)
- ✅ **Nuxt 3** - Framework
- ✅ **Vue 3** - UI framework
- ✅ **TypeScript** - Type safety
- ✅ **TailwindCSS** - Styling
- ✅ **Naive UI** - Component library
- ✅ **GrowthBook** - A/B testing & feature flags
- ✅ **Zod** - Schema validation
- ✅ **Vitest** - Unit testing
- ✅ **Playwright** - E2E testing

### Recommended Additional Libraries

1. **VueUse** (`@vueuse/core`)
   - Collection of Vue Composition API utilities
   - `useLocalStorage`, `useSessionStorage` for persistence
   - `useDebounce`, `useThrottle` for performance
   - `useIntersectionObserver` for lazy loading
   - **Why**: Essential utilities, well-maintained, TypeScript support

2. **@nuxtjs/google-analytics** or **@nuxtjs/gtag**
   - Google Analytics integration for Nuxt
   - Easy event tracking setup
   - **Why**: Already using GA, this simplifies integration

3. **@nuxtjs/sentry** (optional)
   - Sentry error monitoring for Nuxt
   - Automatic error tracking
   - **Why**: Part of Yazio stack, useful for production debugging

4. **@vueuse/nuxt** (if using VueUse)
   - Auto-imports for VueUse composables
   - Better DX with Nuxt

5. **nuxt-zod-form** or **vee-validate** (optional)
   - Form validation helpers
   - Works well with Zod schemas
   - **Why**: If form validation becomes complex

### GrowthBook Integration Notes

**Yes, you can absolutely use GrowthBook!** It's perfect for this use case:

- ✅ **Feature Flags**: Control which variant users see
- ✅ **A/B Testing**: Built-in experimentation framework
- ✅ **User Targeting**: Target based on user attributes (goal, preferences)
- ✅ **Analytics Integration**: Works with Google Analytics
- ✅ **Vue/Nuxt Support**: JavaScript SDK works seamlessly

**Setup Steps**:
1. Install: `npm install @growthbook/growthbook`
2. Create composable: `composables/useGrowthBook.ts`
3. Configure in `nuxt.config.ts` or plugin
4. Use in components to get variant assignment

**Example Experiment Setup in GrowthBook**:
- Experiment: `welcome-back-personalization`
- Variants: `control`, `goal-based`, `deep`
- Targeting: All users in welcome-back flow
- Metrics: Conversion rate, CTA clicks

## Next Steps

1. **Setup Project**: Initialize Nuxt 3 project with TypeScript
2. **Install Dependencies**: Naive UI, GrowthBook, Zod, VueUse
3. **Configure GrowthBook**: Set up feature flags and experiments
4. **Create Mock Data**: Set up user profile and personalization mapping
5. **Build Components**: Implement each screen component with Naive UI
6. **Implement State Management**: Use `useState` for flow state
7. **Add Validation**: Implement Zod schemas for form validation
8. **Integrate A/B Testing**: Set up GrowthBook variant assignment
9. **Add Analytics**: Implement Google Analytics event tracking
10. **Write E2E Tests**: Cover core flow with Playwright
11. **Write Unit Tests**: Test composables with Vitest
12. **Accessibility Audit**: Test with screen readers and keyboard navigation
13. **Performance Optimization**: Optimize bundle size and loading times
14. **Documentation**: Document architecture, decisions, and AI usage

---

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Yazio Onboarding Flow](https://yazio.com/app/onboarding/welcome)
- Behavioral Science Principles (see research notes)

