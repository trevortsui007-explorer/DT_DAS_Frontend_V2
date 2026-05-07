<script setup lang="ts">
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined
} from '@ant-design/icons-vue'

import {
  DTButton,
  DTTable,
  DTTag
} from '@/shared/components'

import type {
  DTTableColumn,
  DTTableRow
} from '@/shared/components'

import type { TaskItem } from '@/api'

import { getTaskModeTagType, getTaskModeText } from '../utils/task-mode'
import { formatCronText, formatDateTime } from '../utils/task-cron-format'

defineProps<{
  data: TaskItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  view: [row: TaskItem]
  edit: [row: TaskItem]
  toggle: [row: TaskItem]
  delete: [row: TaskItem]
  execute: [row: TaskItem]
  selectionChange: [rows: TaskItem[]]
}>()

const columns: DTTableColumn[] = [
  {
    key: 'selection',
    type: 'selection',
    width: 52,
    align: 'center',
    fixed: 'left'
  },
  {
    key: 'taskName',
    title: '任务名称',
    minWidth: 220,
    fixed: 'left',
    showOverflowTooltip: true
  },
  {
    key: 'taskMode',
    title: '任务类型',
    width: 120,
    align: 'center',
    sortable: true
  },
  {
    key: 'cronExpression',
    title: 'Cron 表达式',
    minWidth: 180,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    key: 'isEnabled',
    title: '状态',
    width: 100,
    align: 'center',
    sortable: true
  },
  {
    key: 'updateTime',
    title: '更新时间',
    minWidth: 220,
    showOverflowTooltip: true
  },
  {
    key: 'actions',
    title: '操作',
    width: 220,
    align: 'center',
    fixed: 'right'
  }
]

function getEnabled(row: TaskItem) {
  return Number(row.isEnabled) === 1
}

function handleAction(
  type: 'view' | 'edit' | 'toggle' | 'delete' | 'execute',
  row: DTTableRow
) {
  const actions = {
    view: () => emit('view', row as TaskItem),
    edit: () => emit('edit', row as TaskItem),
    toggle: () => emit('toggle', row as TaskItem),
    delete: () => emit('delete', row as TaskItem),
    execute: () => emit('execute', row as TaskItem)
  }

  actions[type]()
}

function handleSelectionChange(rows: DTTableRow[]) {
  emit('selectionChange', rows as TaskItem[])
}
</script>

<template>
  <DTTable
    :columns="columns"
    :data="data as DTTableRow[]"
    row-key="id"
    :loading="loading"
    height="520px"
    border
    @selection-change="handleSelectionChange"
  >
    <template #cell-taskMode="{ value }">
      <DTTag :type="getTaskModeTagType(value)">
        {{ getTaskModeText(value) }}
      </DTTag>
    </template>

    <template #cell-cronExpression="{ value }">
      <div class="cron-cell">
        <span class="cron-cell__raw">{{ value || '-' }}</span>
        <span class="cron-cell__text">{{ formatCronText(String(value || '')) }}</span>
      </div>
    </template>

    <template #cell-updateTime="{ value }">
      {{ formatDateTime(String(value || '')) }}
    </template>

    <template #cell-isEnabled="{ row }">
      <DTTag :type="getEnabled(row as TaskItem) ? 'success' : 'info'">
        {{ getEnabled(row as TaskItem) ? '启用' : '禁用' }}
      </DTTag>
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
          type="success"
          title="执行"
          @click.stop="handleAction('execute', row)"
        >
          <PlayCircleOutlined />
        </DTButton>

        <DTButton
          size="sm"
          :type="getEnabled(row as TaskItem) ? 'warning' : 'success'"
          :title="getEnabled(row as TaskItem) ? '禁用' : '启用'"
          @click.stop="handleAction('toggle', row)"
        >
          <StopOutlined v-if="getEnabled(row as TaskItem)" />
          <CheckCircleOutlined v-else />
        </DTButton>

        <DTButton
          size="sm"
          type="danger"
          title="删除"
          @click.stop="handleAction('delete', row)"
        >
          <DeleteOutlined />
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

.cron-cell {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.cron-cell__text {
  color: var(--dt-text-primary);
  font-family:
    Consolas,
    Monaco,
    'Courier New',
    monospace;
  font-size: 13px;
  font-weight: 600;
}

.cron-cell__raw {
  color: var(--dt-text-muted);
  font-size: 12px;
}
</style>