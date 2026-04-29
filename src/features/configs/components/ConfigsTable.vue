<script setup lang="ts">
import { DTButton, DTTable, DTTag } from '@/shared/components'
import type { DTTableColumn, DTTableRow } from '@/shared/components'

import type { FileConfigItem } from '@/api'

defineProps<{
  data: FileConfigItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'view', row: FileConfigItem): void
  (e: 'edit', row: FileConfigItem): void
  (e: 'toggle', row: FileConfigItem): void
}>()

const columns: DTTableColumn[] = [
  {
    key: 'name',
    title: '配置名称',
    minWidth: 180
  },
  {
    key: 'sourcePath',
    title: '源路径',
    minWidth: 220
  },
  {
    key: 'targetTable',
    title: '目标表',
    minWidth: 160
  },
  {
    key: 'isEnabled',
    title: '状态',
    width: 100,
    align: 'center'
  }
]

function getDisplayName(row: FileConfigItem) {
  return row.name || row.configName || '-'
}

function handleAction(
  type: 'view' | 'edit' | 'toggle',
  row: DTTableRow
) {
  const fileConfig = row as FileConfigItem

  if (type === 'view') {
    emit('view', fileConfig)
    return
  }

  if (type === 'edit') {
    emit('edit', fileConfig)
    return
  }

  emit('toggle', fileConfig)
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
      {{ getDisplayName(row as FileConfigItem) }}
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