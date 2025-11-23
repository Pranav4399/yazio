<template>
  <div class="payment-container">
    <button @click="goToPreviousPage" class="back-to-previous">← Back</button>

    <div class="progress-wrapper">
      <ProgressIndicator :current-step="'payment'" :steps="progressSteps" />
    </div>

    <div class="payment-content">
      <div class="header">
        <h1 class="title">{{ currentVariant.headline }}</h1>
        <p class="subtitle">{{ currentVariant.subheadline }}</p>
      </div>

      <!-- Personalized Message -->
      <div class="personal-message">
        <p>Based on what you've shared, we think you'll love our approach to making healthy eating feel natural and achievable.</p>
      </div>

      <!-- Conditional Personalized Sections -->
      <div class="personalized-sections">
        <!-- Goal-Specific Encouragement -->
        <div class="conditional-message" v-if="userProfile?.goal === 'lose-weight'">
          <p>Every successful weight loss journey starts with consistency over perfection.</p>
        </div>
        <div class="conditional-message" v-else-if="userProfile?.goal === 'build-muscle'">
          <p>Fueling your body right is the foundation of building strength.</p>
        </div>
        <div class="conditional-message" v-else-if="userProfile?.goal === 'maintain-weight'">
          <p>Healthy maintenance is about balance and enjoying the foods you love.</p>
        </div>

        <!-- Discipline Level Support -->
        <div class="conditional-message" v-if="isLowDisciplineUser">
          <p>Remember: progress happens one positive choice at a time.</p>
        </div>

        <!-- Challenge-Specific Motivation -->
        <div class="conditional-message" v-if="userBiggestChallenge === 'busy-schedule'">
          <p class="message-title">Here's a quick recipe as a token of appreciation for the great habits you've built till now - this one's quite popular in our app!</p>
          <div class="recipe-preview">
            <div class="recipe-header">
              <h4>15-Minute Chicken Stir-Fry</h4>
              <button
                @click="toggleRecipe('stir-fry')"
                class="recipe-toggle"
              >
                {{ isRecipeExpanded('stir-fry') ? 'Hide Recipe' : 'Show Recipe' }}
              </button>
            </div>
            <div
              class="recipe-details"
              :class="{ expanded: isRecipeExpanded('stir-fry') }"
            >
              <div class="ingredients">
                <strong>Ingredients:</strong>
                <ul>
                  <li>200g chicken breast, sliced</li>
                  <li>2 cups mixed vegetables (broccoli, bell peppers, carrots)</li>
                  <li>2 tbsp low-sodium soy sauce</li>
                  <li>1 tbsp olive oil</li>
                  <li>1 tsp ginger, minced</li>
                </ul>
              </div>
              <div class="method">
                <strong>Method:</strong>
                <ol>
                  <li>Heat oil in a wok or large pan over medium-high heat</li>
                  <li>Add chicken and stir-fry for 5 minutes until cooked</li>
                  <li>Add vegetables and ginger, stir-fry for 3-4 minutes</li>
                  <li>Add soy sauce and cook for 2 more minutes</li>
                  <li>Serve immediately</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="conditional-message" v-else-if="userBiggestChallenge === 'cravings'">
          <p class="message-title">Cravings happen to everyone - even the most disciplined eaters. Try this healthier alternative that satisfies your sweet tooth:</p>
          <div class="recipe-preview">
            <div class="recipe-header">
              <h4>Dark Chocolate Avocado Mousse</h4>
              <button
                @click="toggleRecipe('mousse')"
                class="recipe-toggle"
              >
                {{ isRecipeExpanded('mousse') ? 'Hide Recipe' : 'Show Recipe' }}
              </button>
            </div>
            <div
              class="recipe-details"
              :class="{ expanded: isRecipeExpanded('mousse') }"
            >
              <div class="ingredients">
                <strong>Ingredients:</strong>
                <ul>
                  <li>1 ripe avocado</li>
                  <li>3 tbsp unsweetened cocoa powder</li>
                  <li>2 tbsp maple syrup or honey</li>
                  <li>1 tsp vanilla extract</li>
                  <li>Pinch of salt</li>
                </ul>
              </div>
              <div class="method">
                <strong>Method:</strong>
                <ol>
                  <li>Scoop avocado into a blender or food processor</li>
                  <li>Add cocoa powder, sweetener, vanilla, and salt</li>
                  <li>Blend until smooth and creamy (about 1-2 minutes)</li>
                  <li>Chill for 15-30 minutes before serving</li>
                  <li>Enjoy with fresh berries on top</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Commitment Acknowledgment -->
        <div class="conditional-message" v-if="userProfile?.timeCommitment === '15min'">
          <p>Perfect - our 15-minute meal ideas will fit seamlessly into your routine.</p>
        </div>
        <div class="conditional-message" v-else-if="userProfile?.timeCommitment === '30min'">
          <p>Our 30-minute recipes balance nutrition with your available time.</p>
        </div>
      </div>
      
      <!-- Plan Selection -->
      <div class="plans-section">
        <!-- Premium Plan -->
        <div
          class="plan-card premium"
          :class="{ selected: selectedPlan === 'premium' }"
        >
          <div class="plan-header">
            <h3 class="plan-name">Premium Plan</h3>
            <div class="plan-price">
              <span class="price">$9.99</span>
              <span class="period">/month</span>
            </div>
          </div>

          <div class="plan-benefits">
            <p class="benefit-intro">Everything you need to succeed:</p>
            <ul>
              <li v-for="benefit in currentVariant.benefits" :key="benefit">
                {{ benefit }}
              </li>
            </ul>
          </div>

          <button
            @click="selectPlan('premium')"
            class="select-plan-button primary"
          >
            {{ currentVariant.cta }}
          </button>
        </div>

        <!-- Basic Plan -->
        <div
          class="plan-card basic"
          :class="{ selected: selectedPlan === 'basic' }"
        >
          <div class="plan-header">
            <h3 class="plan-name">Basic Plan</h3>
            <div class="plan-price">
              <span class="price">$4.99</span>
              <span class="period">/month</span>
            </div>
          </div>

          <div class="plan-benefits">
            <p class="benefit-intro">A simpler start:</p>
            <ul>
              <li>Essential meal tracking</li>
              <li>Basic progress insights</li>
              <li>Email support</li>
              <li>Cancel anytime</li>
            </ul>
          </div>

          <button
            @click="selectPlan('basic')"
            class="select-plan-button secondary"
          >
            Start with Basic
          </button>
        </div>
      </div>

      <!-- Action Section -->
      <div class="action-section">
        <button @click="payWithStripe" class="stripe-button">
          Pay with Stripe
        </button>
      </div>

      <div class="payment-footer">
        <p class="security-note">Your payment information is secure and encrypted.</p>
        <p class="terms">
          By continuing, you agree to our
          <a href="#" @click.prevent>Terms of Service</a> and
          <a href="#" @click.prevent>Privacy Policy</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Route protection middleware
definePageMeta({
  middleware: "route-protection",
});

import { computed, onMounted, ref } from "vue";
import ProgressIndicator from "~/components/ProgressIndicator.vue";
import { usePageAnalytics } from "~/composables/useAnalytics";
import { useGlobalUser, useQuizManagement } from "~/composables/useWelcomeFlow";
import { PROGRESS_STEPS } from "~/schemas/common";
import {
  PAYWALL_VARIANTS,
  type PaywallVariant,
  selectPaywallVariant,
} from "~/schemas/paywall";
import "~/styles/payment.css";

const progressSteps = PROGRESS_STEPS;

// Analytics
const analytics = usePageAnalytics("payment");

// Global state
const userProfile = useGlobalUser();
const { quizResponses } = useQuizManagement();

// Paywall variant selection
const selectedVariant = computed<PaywallVariant>(() => {
  return selectPaywallVariant({
    goal: userProfile.value?.goal || 'lose-weight',
    dietaryPreference: userProfile.value?.dietaryPreference,
    timeCommitment: userProfile.value?.timeCommitment,
    quizAnswers: quizResponses.value.answers,
  });
});

const currentVariant = computed(() => PAYWALL_VARIANTS[selectedVariant.value]);

// Reactive data
const selectedPlan = ref<string>("");
const isProcessing = ref(false);
const expandedRecipes = ref<string[]>([]);

const paymentData = ref({
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardName: "",
});

// Computed properties
const isFormValid = computed(() => {
  const cardNumberValid =
    paymentData.value.cardNumber.replace(/\s/g, "").length >= 13;
  const expiryValid = /^\d{2}\/\d{2}$/.test(paymentData.value.expiryDate);
  const cvvValid = paymentData.value.cvv.length >= 3;
  const nameValid = paymentData.value.cardName.trim().length > 0;

  return (
    cardNumberValid &&
    expiryValid &&
    cvvValid &&
    nameValid &&
    selectedPlan.value
  );
});

const trialEndDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

// Conditional display logic
const isLowDisciplineUser = computed(() => {
  const disciplineAnswer = quizResponses.value.answers?.find(
    (answer) => answer.questionId === 'morning-routine-discipline'
  )?.answer;
  return disciplineAnswer === 'no';
});

const userBiggestChallenge = computed(() => {
  return quizResponses.value.answers?.find(
    (answer) => answer.questionId === 'biggest-challenge'
  )?.answer;
});

// Methods
const selectPlan = (plan: string) => {
  selectedPlan.value = plan;
  analytics.trackInteraction("click", "select_plan_button", { plan });
};

const goToPreviousPage = () => {
  navigateTo("/summary");
};

const toggleRecipe = (recipeId: string) => {
  const index = expandedRecipes.value.indexOf(recipeId);
  if (index > -1) {
    expandedRecipes.value.splice(index, 1);
  } else {
    expandedRecipes.value.push(recipeId);
  }
};

const isRecipeExpanded = (recipeId: string) => {
  return expandedRecipes.value.includes(recipeId);
};

const formatCardNumber = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  // Add spaces every 4 digits
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatExpiryDate = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  // Add slash after 2 digits
  if (digits.length >= 2) {
    return digits.slice(0, 2) + "/" + digits.slice(2, 4);
  }
  return digits;
};

// Watchers for auto-formatting
watch(
  () => paymentData.value.cardNumber,
  (newValue) => {
    paymentData.value.cardNumber = formatCardNumber(newValue);
  }
);

watch(
  () => paymentData.value.expiryDate,
  (newValue) => {
    paymentData.value.expiryDate = formatExpiryDate(newValue);
  }
);

const processPayment = async () => {
  if (!isFormValid.value) return;

  isProcessing.value = true;
  analytics.trackInteraction("click", "payment_button", {
    plan: selectedPlan.value,
  });

  try {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    analytics.trackFormSubmit("payment_form", true, {
      plan: selectedPlan.value,
      amount: selectedPlan.value === "premium" ? 9.99 : 4.99,
    });

    // In a real app, this would integrate with Stripe, PayPal, etc.
    // For now, simulate success and redirect
    navigateTo("/success");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Payment failed:", error);
      analytics.trackError("payment_failed", {
        plan: selectedPlan.value,
        error: error.message,
      });
    } else {
      console.error("Payment failed:", error);
      analytics.trackError("payment_failed", {
        plan: selectedPlan.value,
        error: "Unknown error",
      });
    }
    // Show error message in real app
  } finally {
    isProcessing.value = false;
  }
};

const payWithStripe = () => {
  analytics.trackInteraction("click", "stripe_button", {
    plan: selectedPlan.value,
  });
  alert("Payment logic here");
};

// Lifecycle
onMounted(() => {
  // Print analytics data to console for debugging
  console.log("📊 Analytics Data Summary:", analytics.getAnalyticsData());

  // Auto-select premium plan for better conversion
  setTimeout(() => {
    if (!selectedPlan.value) {
      selectPlan("premium");
    }
  }, 1000);
});
</script>
