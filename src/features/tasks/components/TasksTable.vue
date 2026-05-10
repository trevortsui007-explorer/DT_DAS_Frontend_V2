<script setup lang="ts">
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  StopOutlined
} from '@ant-design/icons-vue'

import {
  DTButton,
  DTEmpty,
  DTTable,
  DTTag
} from '@/shared/components'

import type {
  DTTableColumn,
  DTTableRow
} from '@/shared/components'

import type {
  TaskAssociatedGroup,
  TaskItem
} from '@/api'

import {
  formatCronText,
  formatDateTime
} from '../utils/task-cron-format'

import {
  getTaskModeTagType,
  getTaskModeText
} from '../utils/task-mode'

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
  bindGroups: [row: TaskItem]
  selectionChange: [rows: TaskItem[]]
  groupView: [payload: { task: TaskItem; group: TaskAssociatedGroup }]
}>()

type AssociatedGroupRow = TaskAssociatedGroup & {
  rowId: string
  index: number
  task: TaskItem
}

const columns: DTTableColumn[] = [
  {
    key: 'selection',
    type: 'selection',
    width: 52,
    align: 'center',
    fixed: 'left'
  },
  {
    key: 'expand',
    type: 'expand',
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
    key: 'groupCount',
    title: '关联组',
    width: 100,
    align: 'center',
    sortable: true
  },
  {
    key: 'cronExpression',
    title: 'Cron 表达式',
    minWidth: 260,
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
    width: 160,
    showOverflowTooltip: true
  },
  {
    key: 'actions',
    title: '操作',
    width: 260,
    align: 'center',
    fixed: 'right'
  }
]

const associatedGroupColumns: DTTableColumn[] = [
  {
    key: 'index',
    title: '序号',
    width: 80,
    align: 'center'
  },
  {
    key: 'groupName',
    title: '分组名称',
    minWidth: 220,
    showOverflowTooltip: true
  },
  {
    key: 'groupCategory',
    title: '分组类别',
    width: 140,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    key: 'groupType',
    title: '分组类型',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    key: 'configCount',
    title: '配置数',
    width: 100,
    align: 'center'
  },
  {
    key: 'isEnabled',
    title: '状态',
    width: 100,
    align: 'center'
  },
  {
    key: 'actions',
    title: '操作',
    width: 100,
    align: 'center'
  }
]

function getEnabled(row: TaskItem) {
  return Number(row.isEnabled) === 1
}

function getGroupEnabled(row: TaskAssociatedGroup) {
  return Number(row.isEnabled) === 1
}

function getAssociatedGroupRows(row: TaskItem): AssociatedGroupRow[] {
  return row.associatedGroups.map((group, index) => {
    return {
      ...group,
      rowId: `${row.id}-${group.id}-${index}`,
      index: index + 1,
      task: row
    }
  })
}

function handleAction(
  type: 'view' | 'edit' | 'toggle' | 'delete' | 'execute' | 'bindGroups',
  row: DTTableRow
) {
  const task = row as TaskItem

  const actions = {
    view: () => emit('view', task),
    edit: () => emit('edit', task),
    toggle: () => emit('toggle', task),
    delete: () => emit('delete', task),
    execute: () => emit('execute', task),
    bindGroups: () => emit('bindGroups', task)
  }

  actions[type]()
}

function handleSelectionChange(rows: DTTableRow[]) {
  emit('selectionChange', rows as TaskItem[])
}

function handleGroupAction(type: 'view', row: DTTableRow) {
  const groupRow = row as AssociatedGroupRow

  const actions = {
    view: () => emit('groupView', {
      task: groupRow.task,
      group: groupRow
    })
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
    height="560px"
    border
    @selection-change="handleSelectionChange"
  >
    <template #cell-taskMode="{ value }">
      <DTTag :type="getTaskModeTagType(value)">
        {{ getTaskModeText(value) }}
      </DTTag>
    </template>

    <template #cell-groupCount="{ value }">
      <DTTag :type="Number(value) > 0 ? 'primary' : 'info'">
        {{ value || 0 }}
      </DTTag>
    </template>

    <template #cell-cronExpression="{ value }">
      <div class="cron-cell">
        <span class="cron-cell__raw">{{ value || '-' }}</span>
        <span class="cron-cell__text">{{ formatCronText(String(value || '')) }}</span>
      </div>
    </template>

    <template #cell-isEnabled="{ row }">
      <DTTag :type="getEnabled(row as TaskItem) ? 'success' : 'info'">
        {{ getEnabled(row as TaskItem) ? '启用' : '禁用' }}
      </DTTag>
    </template>

    <template #cell-updateTime="{ value }">
      {{ formatDateTime(String(value || '')) }}
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
          type="success"
          title="绑定分组"
          @click.stop="handleAction('bindGroups', row)"
        >
          <LinkOutlined />
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

    <template #expand="{ row }">
      <div class="task-expand">
        <DTTable
          v-if="(row as TaskItem).associatedGroups.length"
          :columns="associatedGroupColumns"
          :data="getAssociatedGroupRows(row as TaskItem) as DTTableRow[]"
          row-key="rowId"
          empty-text="暂无关联分组"
          border
        >
          <template #cell-groupCategory="{ value }">
            <DTTag type="info">
              {{ value || '未分类' }}
            </DTTag>
          </template>

          <template #cell-configCount="{ value }">
            <DTTag type="primary">
              {{ value || 0 }}
            </DTTag>
          </template>

          <template #cell-isEnabled="{ row: groupRow }">
            <DTTag :type="getGroupEnabled(groupRow as TaskAssociatedGroup) ? 'success' : 'info'">
              {{ getGroupEnabled(groupRow as TaskAssociatedGroup) ? '启用' : '禁用' }}
            </DTTag>
          </template>

          <template #cell-actions="{ row: groupRow }">
            <div class="table-actions table-actions--child">
              <DTButton
                size="sm"
                title="查看分组"
                @click.stop="handleGroupAction('view', groupRow)"
              >
                <EyeOutlined />
              </DTButton>
            </div>
          </template>
        </DTTable>

        <DTEmpty
          v-else
          size="sm"
          title="暂无关联分组"
          description="当前任务还没有绑定任何配置分组。"
        />
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

.table-actions--child :deep(.dt-button) {
  width: 30px;
}

.cron-cell {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.cron-cell__raw {
  color: var(--dt-text-primary);
  font-family:
    Consolas,
    Monaco,
    'Courier New',
    monospace;
  font-size: 13px;
  font-weight: 600;
}

.cron-cell__text {
  color: var(--dt-text-muted);
  font-size: 12px;
}

.task-expand {
  padding: var(--dt-space-3);
  border-radius: var(--dt-radius-lg);
  background: color-mix(in srgb, var(--dt-bg-muted) 42%, transparent);
}
</style>