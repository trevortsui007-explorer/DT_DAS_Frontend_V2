<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => route.meta.title || 'DT DAS')
</script>

<template>
  <header class="app-header">
    <div>
      <h1 class="app-header__title">{{ title }}</h1>
      <p class="app-header__desc">工业数据采集与执行监控平台</p>
    </div>

    <div class="app-header__actions">
      <span class="app-header__status">System Online</span>
    </div>
  </header>
</template>