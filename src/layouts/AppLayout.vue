<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import { useAppStore, type AppTheme } from '@/app/stores/app.store'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
const appStore = useAppStore()

watchEffect(() => {
  const theme = (route.meta.theme || 'default') as AppTheme
  appStore.setTheme(theme)
})
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <main class="app-main">
      <AppHeader />

      <section class="app-content">
        <RouterView />
      </section>
    </main>
  </div>
</template>