<script setup lang="ts">
import { DTCard, DTTag } from '@/shared/components'

defineProps<{
  totalTasks?: number
  successRate?: number
  runningCount?: number
  failedCount?: number
}>()
</script>

<template>
  <div class="dashboard-stats">
    <DTCard title="今日采集任务">
      <div class="metric-value">{{ totalTasks ?? 0 }}</div>
      <DTTag type="success">正常</DTTag>
    </DTCard>

    <DTCard title="执行成功率">
      <div class="metric-value">{{ successRate ?? 0 }}%</div>
      <DTTag type="success">稳定</DTTag>
    </DTCard>

    <DTCard title="执行中任务">
      <div class="metric-value">{{ runningCount ?? 0 }}</div>
      <DTTag type="primary">运行中</DTTag>
    </DTCard>

    <DTCard title="失败任务">
      <div class="metric-value">{{ failedCount ?? 0 }}</div>
      <DTTag :type="failedCount ? 'danger' : 'success'">
        {{ failedCount ? '需关注' : '正常' }}
      </DTTag>
    </DTCard>
  </div>
</template>

<style scoped lang="scss">
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--dt-space-4);
}

@media (max-width: 1200px) {
  .dashboard-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}
</style>