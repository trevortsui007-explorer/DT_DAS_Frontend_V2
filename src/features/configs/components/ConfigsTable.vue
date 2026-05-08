<script setup lang="ts">
import { computed } from 'vue'

import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  StopOutlined
} from '@ant-design/icons-vue'

import { DTButton, DTTable, DTTag } from '@/shared/components'
import type { DTTableColumn, DTTableRow } from '@/shared/components'

import type { FileConfigItem } from '@/api'

const props = withDefaults(
  defineProps<{
    data: FileConfigItem[]
    loading?: boolean
    selectable?: boolean
  }>(),
  {
    loading: false,
    selectable: false
  }
)

const emit = defineEmits<{
  view: [row: FileConfigItem]
  edit: [row: FileConfigItem]
  toggle: [row: FileConfigItem]
  selectionChange: [rows: FileConfigItem[]]
}>()

const columns = computed<DTTableColumn[]>(() => {
  const baseColumns: DTTableColumn[] = [
    {
      key: 'name',
      title: '配置名称',
      minWidth: 180,
      fixed: 'left',
      showOverflowTooltip: true
    },
    {
      key: 'sourcePath',
      title: '源路径',
      minWidth: 240,
      showOverflowTooltip: true
    },
    {
      key: 'targetTable',
      title: '目标表',
      minWidth: 160,
      showOverflowTooltip: true
    },
    {
      key: 'isEnabled',
      title: '状态',
      width: 100,
      align: 'center'
    },
    {
      key: 'updateTime',
      title: '更新时间',
      minWidth: 180,
      showOverflowTooltip: true
    },
    {
      key: 'actions',
      title: '操作',
      width: 150,
      align: 'center',
      fixed: 'right'
    }
  ]

  if (!props.selectable) {
    return baseColumns
  }

  return [
    {
      key: 'selection',
      type: 'selection',
      width: 52,
      align: 'center',
      fixed: 'left'
    },
    ...baseColumns
  ]
})

function handleSelectionChange(rows: DTTableRow[]) {
  emit('selectionChange', rows as FileConfigItem[])
}

function handleAction(
  type: 'view' | 'edit' | 'toggle',
  row: DTTableRow
) {
  const actions = {
    view: () => emit('view', row as FileConfigItem),
    edit: () => emit('edit', row as FileConfigItem),
    toggle: () => emit('toggle', row as FileConfigItem)
  }

  actions[type]()
}
</script>

<template>
  <DTTable
    :columns="columns"
    :data="data as DTTableRow[]"
    row-key="id"
    :loading="loading"
    border
    @selection-change="handleSelectionChange"
  >
    <template #cell-isEnabled="{ value }">
      <DTTag :type="value ? 'success' : 'info'">
        {{ value ? '启用' : '禁用' }}
      </DTTag>
    </template>

    <template #cell-updateTime="{ value }">
      {{ value || '-' }}
    </template>

    <template #cell-actions="{ row }">
      <div class="table-actions">
        <DTButton
          size="sm"
          title="查看"
          @click.stop="handleAction('view', row)"
        >
          <EyeOutlined />
        </DTButton>

        <DTButton
          size="sm"
          type="primary"
          title="编辑"
          @click.stop="handleAction('edit', row)"
        >
          <EditOutlined />
        </DTButton>

        <DTButton
          size="sm"
          :type="(row as FileConfigItem).isEnabled ? 'warning' : 'success'"
          :title="(row as FileConfigItem).isEnabled ? '禁用' : '启用'"
          @click.stop="handleAction('toggle', row)"
        >
          <StopOutlined v-if="(row as FileConfigItem).isEnabled" />
          <CheckCircleOutlined v-else />
        </DTButton>
      </div>
    </template>
  </DTTable>
</template>

<style scoped lang="scss">
.table-actions {
  display: inline-flex;
  justify-content: center;
  gap: var(--dt-space-2);
  width: 100%;
}

.table-actions :deep(.dt-button) {
  width: 32px;
  padding: 0;
}

.table-actions :deep(.anticon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>