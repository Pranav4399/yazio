<template>
  <div class="analytics-container">
    <div class="analytics-header">
      <h1 class="analytics-title">Analytics</h1>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="chart-title">User Flow</h2>
          <p class="chart-description">How users navigate through onboarding</p>
        </div>
        <div class="chart-container">
          <v-chart class="chart" :option="sankeyOption" />
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h2 class="chart-title">Conversion Funnel</h2>
          <p class="chart-description">User progression through steps</p>
        </div>
        <div class="chart-container">
          <v-chart class="chart" :option="funnelOption" />
        </div>
      </div>
    </div>

    <div class="metrics-section">
      <div class="metric-card">
        <h3 class="metric-value">1,247</h3>
        <p class="metric-label">Total Users</p>
      </div>

      <div class="metric-card">
        <h3 class="metric-value">78%</h3>
        <p class="metric-label">Completion Rate</p>
      </div>

      <div class="metric-card">
        <h3 class="metric-value">$15,420</h3>
        <p class="metric-label">Revenue</p>
      </div>

      <div class="metric-card">
        <h3 class="metric-value">4m 32s</h3>
        <p class="metric-label">Avg Session Time</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FunnelChart, SankeyChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'
import '~/styles/analytics.css'

use([CanvasRenderer, SankeyChart, FunnelChart, TooltipComponent])

definePageMeta({
  middleware: 'route-protection'
})

const sankeyOption = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  series: {
    type: 'sankey',
    layout: 'none',
    data: [
      { name: 'Landing' },
      { name: 'Welcome' },
      { name: 'Goal' },
      { name: 'Quiz' },
      { name: 'Summary' },
      { name: 'Payment' }
    ],
    links: [
      { source: 'Landing', target: 'Welcome', value: 100 },
      { source: 'Welcome', target: 'Goal', value: 85 },
      { source: 'Goal', target: 'Quiz', value: 80 },
      { source: 'Quiz', target: 'Summary', value: 70 },
      { source: 'Summary', target: 'Payment', value: 65 }
    ]
  }
}))

const funnelOption = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'funnel',
      data: [
        { value: 100, name: 'Landing' },
        { value: 85, name: 'Welcome' },
        { value: 80, name: 'Goal' },
        { value: 70, name: 'Quiz' },
        { value: 65, name: 'Summary' },
        { value: 60, name: 'Payment' }
      ]
    }
  ]
}))
</script>
