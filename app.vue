<template>
  <div id="app">
    <!-- Header with logout button - client-only to avoid hydration mismatch -->
    <ClientOnly>
      <header v-if="isAuthenticated()" class="app-header">
        <div class="header-content">
          <div class="spacer"></div>
          <button @click="handleLogout" class="logout-button">
            Logout
          </button>
        </div>
      </header>
    </ClientOnly>

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

// Authentication
const { logout, isAuthenticated } = useSupabase()

// Handle logout
const handleLogout = () => {
  logout()
  navigateTo('/')
}
</script>

<style>
#app {
  min-height: 100vh;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logout-button {
  background: #000000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.logout-button:hover {
  background: #374151;
}
</style>

