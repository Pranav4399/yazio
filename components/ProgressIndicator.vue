<template>
  <div class="progress-indicator">
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">Step {{ currentStepIndex + 1 }} of {{ steps.length }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Step {
  id: string
  label: string
}

interface Props {
  currentStep: string
  steps: Step[]
}

const props = defineProps<Props>()

const currentStepIndex = computed(() => {
  return props.steps.findIndex(step => step.id === props.currentStep)
})

const progressPercentage = computed(() => {
  if (currentStepIndex.value === -1) return 0
  return ((currentStepIndex.value + 1) / props.steps.length) * 100
})
</script>

<style scoped>
.progress-indicator {
  width: 100%;
  margin: 0 auto 2rem;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #6b7280;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  letter-spacing: -0.01em;
  white-space: nowrap;
  min-width: 80px;
  text-align: right;
}

@media (max-width: 640px) {
  .progress-bar-container {
    gap: 0.75rem;
  }

  .progress-text {
    font-size: 0.8rem;
    min-width: 70px;
  }
}
</style>
