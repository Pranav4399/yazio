<template>
  <div id="app">
    <!-- Header with logout button -->
    <header v-if="isAuthenticated()" class="app-header">
      <div class="header-content">
        <div class="spacer"></div>
        <button @click="handleLogout" class="logout-button">
          Logout
        </button>
      </div>
    </header>

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
  padding-top: 4rem; /* Account for fixed header */
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

