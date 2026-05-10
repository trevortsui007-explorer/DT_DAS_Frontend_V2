<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menus = [
  { title: '总览', path: '/overview', icon: 'OV' },
  { title: '配置管理', path: '/configs', icon: 'CF' },
  { title: '分组管理', path: '/groups', icon: 'GP' },
  { title: '任务管理', path: '/tasks', icon: 'TK' },
  { title: '执行日志', path: '/task-logs', icon: 'LG' },
  { title: '组件示例', path: '/playground', icon: 'UI' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__brand">
      <div class="app-sidebar__logo">DT</div>
      <div>
        <div class="app-sidebar__title">DT DAS</div>
        <div class="app-sidebar__subtitle">Data Acquisition</div>
      </div>
    </div>

    <nav class="app-sidebar__nav">
      <RouterLink
        v-for="item in menus"
        :key="item.path"
        :to="item.path"
        class="app-sidebar__link"
        :class="{ 'is-active': activePath === item.path }"
      >
        <span class="app-sidebar__icon">{{ item.icon }}</span>
        <span>{{ item.title }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
