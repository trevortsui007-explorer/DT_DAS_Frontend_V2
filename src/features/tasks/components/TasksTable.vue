<script setup lang="ts">
import { DTButton, DTTable, DTTag } from '@/shared/components'
import type { DTTableColumn, DTTableRow } from '@/shared/components'

import type { TaskItem } from '@/api'

defineProps<{
  data: TaskItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'view', row: TaskItem): void
  (e: 'edit', row: TaskItem): void
  (e: 'toggle', row: TaskItem): void
}>()

const columns: DTTableColumn[] = [
  {
    key: 'name',
    title: '任务名称',
    minWidth: 180
  },
  {
    key: 'cron',
    title: 'Cron 表达式',
    minWidth: 180
  },
  {
    key: 'isEnabled',
    title: '状态',
    width: 100,
    align: 'center'
  }
]

function getDisplayName(row: TaskItem) {
  return row.name || row.taskName || '-'
}

function getCron(row: TaskItem) {
  return row.cron || row.cronExpression || '-'
}

function handleAction(
  type: 'view' | 'edit' | 'toggle',
  row: DTTableRow
) {
  const task = row as TaskItem

  if (type === 'view') {
    emit('view', task)
    return
  }

  if (type === 'edit') {
    emit('edit', task)
    return
  }

  emit('toggle', task)
}
</script>

<template>
  <DTTable
    :columns="columns"
    :data="data as DTTableRow[]"
    row-key="id"
    :loading="loading"
  >
    <template #cell-name="{ row }">
      {{ getDisplayName(row as TaskItem) }}
    </template>

    <template #cell-cron="{ row }">
      {{ getCron(row as TaskItem) }}
    </template>

    <template #cell-isEnabled="{ value }">
      <DTTag :type="value ? 'success' : 'info'">
        {{ value ? '启用' : '禁用' }}
      </DTTag>
    </template>

    <template #actions="{ row }">
      <div class="table-actions">
        <DTButton size="sm" @click.stop="handleAction('view', row)">
          查看
        </DTButton>

        <DTButton size="sm" type="primary" @click.stop="handleAction('edit', row)">
          编辑
        </DTButton>

        <DTButton
          size="sm"
          :type="row.isEnabled ? 'warning' : 'success'"
          @click.stop="handleAction('toggle', row)"
        >
          {{ row.isEnabled ? '禁用' : '启用' }}
        </DTButton>
      </div>
    </template>
  </DTTable>
</template>

<style scoped lang="scss">
.table-actions {
  display: inline-flex;
  gap: var(--dt-space-2);
  justify-content: flex-end;
}
</style>