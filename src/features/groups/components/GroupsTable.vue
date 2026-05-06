<script setup lang="ts">
import { computed } from 'vue'

import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
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
  ConfigGroupAssociatedConfig,
  ConfigGroupItem
} from '@/api'

const props = defineProps<{
  data: ConfigGroupItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  view: [row: ConfigGroupItem]
  edit: [row: ConfigGroupItem]
  toggle: [row: ConfigGroupItem]
  delete: [row: ConfigGroupItem]
  selectionChange: [rows: ConfigGroupItem[]]

  configView: [payload: { group: ConfigGroupItem; config: ConfigGroupAssociatedConfig }]
  configToggle: [payload: { group: ConfigGroupItem; config: ConfigGroupAssociatedConfig }]
}>()

type AssociatedConfigRow = ConfigGroupAssociatedConfig & {
  rowId: string
  index: number
  group: ConfigGroupItem
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
    key: 'groupName',
    title: '分组名称',
    minWidth: 180,
    fixed: 'left',
    showOverflowTooltip: true
  },
  {
    key: 'groupCategory',
    title: '分组类别',
    minWidth: 140,
    align: 'center'
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
    align: 'center',
    sortable: true
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
    width: 190,
    align: 'center',
    fixed: 'right'
  }
]

const associatedColumns: DTTableColumn[] = [
  {
    key: 'index',
    title: '序号',
    width: 100,
    align: 'center'
  },
  {
    key: 'eqName',
    title: '配置名称',
    minWidth: 260,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    key: 'actions',
    title: '操作',
    width: 120,
    align: 'center'
  }
]

const totalConfigCount = computed(() => {
  return props.data.reduce((sum, group) => {
    return sum + (group.configCount || 0)
  }, 0)
})

function getAssociatedConfigText(row: ConfigGroupItem) {
  if (!row.associatedConfigs.length) {
    return '-'
  }

  return row.associatedConfigs
    .map((config) => config.eqName)
    .filter(Boolean)
    .join('、')
}

function getAssociatedConfigRows(row: ConfigGroupItem): AssociatedConfigRow[] {
  return row.associatedConfigs.map((config, index) => {
    return {
      ...config,
      rowId: `${row.id}-${config.id}-${index}`,
      index: index + 1,
      group: row
    }
  })
}

function getConfigEnabled(config: ConfigGroupAssociatedConfig) {
  return Number(config.isEnabled ?? 1) === 1
}

function handleSelectionChange(rows: DTTableRow[]) {
  emit('selectionChange', rows as ConfigGroupItem[])
}

function handleAction(type: 'view' | 'edit' | 'toggle' | 'delete', row: DTTableRow) {
  const actions = {
    view: () => emit('view', row as ConfigGroupItem),
    edit: () => emit('edit', row as ConfigGroupItem),
    toggle: () => emit('toggle', row as ConfigGroupItem),
    delete: () => emit('delete', row as ConfigGroupItem)
  }

  actions[type]()
}

function handleConfigAction(type: 'view' | 'toggle', row: DTTableRow) {
  const configRow = row as AssociatedConfigRow

  const actions = {
    view: () => emit('configView', {
      group: configRow.group,
      config: configRow
    }),
    toggle: () => emit('configToggle', {
      group: configRow.group,
      config: configRow
    })
  }

  actions[type]()
}
</script>

<template>
  <div class="groups-table">
    <div class="groups-table__summary">
      <div class="groups-table__summary-item groups-table__summary-item--primary">
        <span>分组数量</span>
        <strong>{{ data.length }}</strong>
      </div>

      <div class="groups-table__summary-item groups-table__summary-item--soft">
        <span>关联配置总数</span>
        <strong>{{ totalConfigCount }}</strong>
      </div>
    </div>

    <DTTable
      :columns="columns"
      :data="data as DTTableRow[]"
      row-key="id"
      :loading="loading"
      height="560px"
      border
      @selection-change="handleSelectionChange"
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

      <template #cell-associatedConfigs="{ row }">
        <span class="associated-preview">
          {{ getAssociatedConfigText(row as ConfigGroupItem) }}
        </span>
      </template>

      <template #cell-isEnabled="{ value }">
        <DTTag :type="Number(value) === 1 ? 'success' : 'info'">
          {{ Number(value) === 1 ? '启用' : '禁用' }}
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
            :type="Number((row as ConfigGroupItem).isEnabled) === 1 ? 'warning' : 'success'"
            :title="Number((row as ConfigGroupItem).isEnabled) === 1 ? '禁用' : '启用'"
            @click.stop="handleAction('toggle', row)"
          >
            <StopOutlined v-if="Number((row as ConfigGroupItem).isEnabled) === 1" />
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
        <div class="group-expand">
          <DTTable
            v-if="(row as ConfigGroupItem).associatedConfigs.length"
            :columns="associatedColumns"
            :data="getAssociatedConfigRows(row as ConfigGroupItem) as DTTableRow[]"
            row-key="rowId"
            empty-text="暂无关联配置"
            border
          >
            <template #cell-actions="{ row: configRow }">
              <div class="table-actions table-actions--child">
                <DTButton
                  size="sm"
                  title="查看配置"
                  @click.stop="handleConfigAction('view', configRow)"
                >
                  <EyeOutlined />
                </DTButton>

                <DTButton
                  size="sm"
                  :type="getConfigEnabled(configRow as AssociatedConfigRow) ? 'warning' : 'success'"
                  :title="getConfigEnabled(configRow as AssociatedConfigRow) ? '禁用配置' : '启用配置'"
                  @click.stop="handleConfigAction('toggle', configRow)"
                >
                  <StopOutlined v-if="getConfigEnabled(configRow as AssociatedConfigRow)" />
                  <CheckCircleOutlined v-else />
                </DTButton>
              </div>
            </template>
          </DTTable>

          <DTEmpty
            v-else
            size="sm"
            title="暂无关联配置"
            description="当前分组还没有绑定任何配置。"
          />
        </div>
      </template>
    </DTTable>
  </div>
</template>

<style scoped lang="scss">
.groups-table {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-3);
}

.groups-table__summary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-3);
}

.groups-table__summary-item {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-2);
  padding: 8px 12px;
  border-radius: var(--dt-radius-md);
  font-size: 13px;
}

.groups-table__summary-item strong {
  font-size: 15px;
  font-weight: 700;
}

.groups-table__summary-item--primary {
  border: 1px solid color-mix(in srgb, var(--dt-color-primary) 40%, transparent);
  color: var(--dt-color-primary);
  background: color-mix(in srgb, var(--dt-color-primary) 14%, var(--dt-bg-surface));
}

.groups-table__summary-item--soft {
  border: 1px solid color-mix(in srgb, var(--dt-color-primary) 22%, transparent);
  color: var(--dt-text-secondary);
  background: color-mix(in srgb, var(--dt-color-primary) 7%, var(--dt-bg-surface));
}

.groups-table__summary-item--soft strong {
  color: var(--dt-color-primary);
}

.associated-preview {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  color: var(--dt-text-secondary);
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
}

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

.group-expand {
  padding: var(--dt-space-3) var(--dt-space-4);
  border-top: 1px solid var(--dt-border-subtle);
  border-bottom: 1px solid var(--dt-border-subtle);
  background: color-mix(in srgb, var(--dt-bg-muted) 68%, transparent);
}
</style>