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
    key: 'taskId',
    title: 'TaskId',
    width: 100
  },
  {
    key: 'startTime',
    title: '开始时间',
    minWidth: 180
  },
  {
    key: 'endTime',
    title: '结束时间',
    minWidth: 180
  },
  {
    key: 'status',
    title: '状态',
    width: 120,
    align: 'center'
  },
  {
    key: 'progress',
    title: '进度',
    width: 100,
    align: 'center'
  },
  {
    key: 'message',
    title: '消息',
    minWidth: 220
  }
]

function getStatusType(status: unknown) {
  if (status === 'Success') return 'success'
  if (status === 'Failed') return 'danger'
  if (status === 'Running') return 'primary'
  if (status === 'Pending') return 'warning'

  return 'info'
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
  >
    <template #cell-status="{ value }">
      <DTTag :type="getStatusType(value)">
        {{ value || '-' }}
      </DTTag>
    </template>

    <template #cell-progress="{ value }">
      {{ value ?? 0 }}%
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