<script setup lang="ts">
import { DTButton, DTTable, DTTag } from '@/shared/components'
import type { DTTableColumn, DTTableRow } from '@/shared/components'

import type { TaskLogItem } from '@/api'

defineProps<{
  data: TaskLogItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  view: [row: TaskLogItem]
}>()

const columns: DTTableColumn[] = [
  {
    key: 'taskCode',
    title: '执行编号',
    minWidth: 180
  },
  {
    key: 'taskName',
    title: '任务',
    minWidth: 140
  },
  {
    key: 'status',
    title: '状态',
    width: 110,
    align: 'center'
  },
  {
    key: 'progress',
    title: '进度',
    width: 150
  },
  {
    key: 'counts',
    title: '配置结果',
    minWidth: 150
  },
  {
    key: 'startTime',
    title: '开始时间',
    minWidth: 170
  },
  {
    key: 'endTime',
    title: '结束时间',
    minWidth: 170
  },
  {
    key: 'message',
    title: '消息',
    minWidth: 240
  }
]

function getStatusType(status: unknown) {
  if (status === 'Success') return 'success'
  if (status === 'Failed') return 'danger'
  if (status === 'Running') return 'primary'
  if (status === 'Pending') return 'warning'

  return 'info'
}

function getStatusText(status: unknown) {
  const map: Record<string, string> = {
    Success: '成功',
    Failed: '失败',
    Running: '运行中',
    Pending: '等待中',
    Cancelled: '已取消'
  }

  return map[String(status)] || String(status || '-')
}

function handleView(row: DTTableRow) {
  emit('view', row as TaskLogItem)
}
</script>

<template>
  <DTTable
    :columns="columns"
    :data="data as DTTableRow[]"
    row-key="taskLogId"
    :loading="loading"
    empty-text="暂无执行记录"
  >
    <template #cell-status="{ value }">
      <DTTag :type="getStatusType(value)">
        {{ getStatusText(value) }}
      </DTTag>
    </template>

    <template #cell-progress="{ value }">
      <div class="log-progress">
        <span class="log-progress__bar">
          <i :style="{ width: `${Number(value ?? 0)}%` }" />
        </span>
        <span>{{ value ?? 0 }}%</span>
      </div>
    </template>

    <template #cell-counts="{ row }">
      <span class="counts">
        成功 {{ row.successCount ?? 0 }} / 失败 {{ row.failureCount ?? 0 }} / 总数 {{ row.totalConfigs ?? 0 }}
      </span>
    </template>

    <template #cell-endTime="{ value }">
      {{ value || '进行中' }}
    </template>

    <template #actions="{ row }">
      <DTButton
        size="sm"
        type="primary"
        @click.stop="handleView(row)"
      >
        详情
      </DTButton>
    </template>
  </DTTable>
</template>

<style scoped lang="scss">
.log-progress {
  display: grid;
  grid-template-columns: 72px auto;
  gap: var(--dt-space-2);
  align-items: center;
}

.log-progress__bar {
  display: block;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dt-bg-muted);
}

.log-progress__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--dt-color-primary);
}

.counts {
  color: var(--dt-text-secondary);
  font-size: 13px;
}
</style>
