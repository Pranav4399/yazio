<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Global page metadata
useHead({
  title: 'YAZIO',
  meta: [
    { name: 'description', content: 'Welcome back experience' }
  ]
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>

