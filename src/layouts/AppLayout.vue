<script setup lang="ts">
import { onMounted } from 'vue'

import { useAppStore } from '@/app/stores/app.store'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
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
