<script setup lang="ts">
const menus = [
  { title: '总览', path: '/overview' },
  { title: '配置管理', path: '/configs' },
  { title: '任务管理', path: '/tasks' },
  { title: '执行日志', path: '/task-logs' },
  { title: '组件示例', path: '/playground' },
]
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
        active-class="is-active"
      >
        {{ item.title }}
      </RouterLink>
    </nav>
  </aside>
</template>