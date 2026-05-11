<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  AppstoreOutlined,
  ClusterOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  FileSearchOutlined,
  ScheduleOutlined
} from '@ant-design/icons-vue'

import { useAppStore } from '@/app/stores/app.store'

const route = useRoute()
const appStore = useAppStore()

const menus = [
  { title: '总览', path: '/overview', icon: DashboardOutlined },
  { title: '配置管理', path: '/configs', icon: AppstoreOutlined },
  { title: '分组管理', path: '/groups', icon: ClusterOutlined },
  { title: '任务管理', path: '/tasks', icon: ScheduleOutlined },
  { title: '执行日志', path: '/task-logs', icon: FileSearchOutlined },
  { title: '组件示例', path: '/playground', icon: ExperimentOutlined },
]

const activePath = computed(() => route.path)
const isDarkMode = computed(() => appStore.theme === 'dark')
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
        <span class="app-sidebar__icon">
          <component :is="item.icon" />
        </span>
        <span>{{ item.title }}</span>
      </RouterLink>
    </nav>

    <div class="app-sidebar__footer">
      <button
        class="app-sidebar__theme"
        type="button"
        :aria-label="isDarkMode ? '切换到白天模式' : '切换到暗夜模式'"
        :title="isDarkMode ? '当前暗夜模式，点击切换白天模式' : '当前白天模式，点击切换暗夜模式'"
        @click="appStore.toggleTheme"
      >
        <span
          class="app-sidebar__theme-icon"
          aria-hidden="true"
        >
          {{ isDarkMode ? '☾' : '☀' }}
        </span>
        <span>{{ isDarkMode ? '暗夜模式' : '白天模式' }}</span>
      </button>
    </div>
  </aside>
</template>
