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

      <!-- Trial Notice -->
      <div class="trial-notice">
        <div class="trial-icon">🎁</div>
        <div class="trial-text">
          <strong>7-day free trial</strong> - No charges until
          {{ trialEndDate }}
        </div>
      </div>

      <!-- Plan Selection -->
      <div class="plans-section">
        <!-- Premium Plan - Featured -->
        <div
          class="plan-card premium"
          :class="{ selected: selectedPlan === 'premium' }"
        >
          <div class="plan-ribbon">Most Popular</div>
          <div class="plan-header">
            <h3 class="plan-name">Premium Plan</h3>
            <div class="plan-price">
              <div class="original-price">$19.99</div>
              <div class="discounted-price">
                <span class="price">$9.99</span>
                <span class="period">/month</span>
              </div>
              <div class="savings">Save 50%</div>
            </div>
          </div>

          <div class="plan-features">
            <div
              v-for="benefit in currentVariant.benefits"
              :key="benefit"
              class="feature"
            >
              <span class="check">✓</span>
              <span>{{ benefit }}</span>
            </div>
            <div class="feature">
              <span class="check">✓</span>
              <span>Expert nutrition guidance</span>
            </div>
            <div class="feature">
              <span class="check">✓</span>
              <span>24/7 support</span>
            </div>
            <div class="feature">
              <span class="check">✓</span>
              <span>Cancel anytime</span>
            </div>
          </div>

          <button
            @click="selectPlan('premium')"
            class="select-plan-button primary"
          >
            Start Premium Trial
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
              <div class="discounted-price">
                <span class="price">$4.99</span>
                <span class="period">/month</span>
              </div>
            </div>
          </div>

          <div class="plan-features">
            <div class="feature">
              <span class="check">✓</span>
              <span>Basic meal tracking</span>
            </div>
            <div class="feature">
              <span class="check">✓</span>
              <span>Simple progress charts</span>
            </div>
            <div class="feature">
              <span class="check">✓</span>
              <span>Email support</span>
            </div>
            <div class="feature">
              <span class="check">✓</span>
              <span>Cancel anytime</span>
            </div>
          </div>

          <button
            @click="selectPlan('basic')"
            class="select-plan-button secondary"
          >
            Start Basic Plan
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
        <div class="security-notice">
          🔒 Your payment information is encrypted and secure
        </div>
        <div class="terms">
          By continuing, you agree to our
          <a href="#" @click.prevent>Terms of Service</a> and
          <a href="#" @click.prevent>Privacy Policy</a>
        </div>
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
    goal: userProfile.value.goal,
    dietaryPreference: userProfile.value.dietaryPreference,
    timeCommitment: userProfile.value.timeCommitment,
    quizAnswers: quizResponses.value.answers,
  });
});

const currentVariant = computed(() => PAYWALL_VARIANTS[selectedVariant.value]);

// Reactive data
const selectedPlan = ref<string>("");
const isProcessing = ref(false);

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

// Methods
const selectPlan = (plan: string) => {
  selectedPlan.value = plan;
  analytics.trackInteraction("click", "select_plan_button", { plan });
};

const goToPreviousPage = () => {
  navigateTo("/summary");
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
