<script setup lang="ts">
import {
  DTCard,
  DTDrawer,
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

const props = withDefaults(
  defineProps<{
    open: boolean
    group: ConfigGroupItem | null
  }>(),
  {
    open: false,
    group: null
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  edit: [row: ConfigGroupItem]
  configView: [payload: { group: ConfigGroupItem; config: ConfigGroupAssociatedConfig }]
}>()

type AssociatedConfigRow = ConfigGroupAssociatedConfig & {
  rowId: string
  index: number
}

const associatedColumns: DTTableColumn[] = [
  {
    key: 'index',
    title: '序号',
    width: 90,
    align: 'center'
  },
  {
    key: 'eqName',
    title: '配置名称',
    minWidth: 150,
    showOverflowTooltip: true
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

function getAssociatedConfigRows(group: ConfigGroupItem): AssociatedConfigRow[] {
  return group.associatedConfigs.map((config, index) => {
    return {
      ...config,
      rowId: `${group.id}-${config.id}-${index}`,
      index: index + 1
    }
  })
}

function getConfigEnabled(config: ConfigGroupAssociatedConfig) {
  return Number(config.isEnabled ?? 1) === 1
}

function handleClose(value: boolean) {
  emit('update:open', value)
}

function handleEdit() {
  if (!props.group) return

  emit('edit', props.group)
}

function handleConfigView(row: DTTableRow) {
  if (!props.group) return

  emit('configView', {
    group: props.group,
    config: row as ConfigGroupAssociatedConfig
  })
}
</script>

<template>
  <DTDrawer
    :open="open"
    title="分组详情"
    width="720px"
    @update:open="handleClose"
  >
    <template #description>
      查看当前配置分组的基础信息和关联配置。
    </template>

    <div
      v-if="group"
      class="group-detail"
    >
      <DTCard title="基础信息">
        <div class="detail-list">
          <div class="detail-row">
            <span class="detail-label">分组名称</span>
            <strong class="detail-value">{{ group.groupName }}</strong>
          </div>

          <div class="detail-row">
            <span class="detail-label">分组类别</span>
            <DTTag type="info">
              {{ group.groupCategory || '未分类' }}
            </DTTag>
          </div>

          <div class="detail-row">
            <span class="detail-label">分组类型</span>
            <strong class="detail-value">{{ group.groupType || '-' }}</strong>
          </div>

          <div class="detail-row">
            <span class="detail-label">状态</span>
            <DTTag :type="Number(group.isEnabled) === 1 ? 'success' : 'info'">
              {{ Number(group.isEnabled) === 1 ? '启用' : '禁用' }}
            </DTTag>
          </div>

          <div class="detail-row">
            <span class="detail-label">关联配置数</span>
            <DTTag type="primary">
              {{ group.configCount || 0 }}
            </DTTag>
          </div>
        </div>
      </DTCard>

      <DTCard title="关联配置">
        <DTTable
          v-if="group.associatedConfigs.length"
          :columns="associatedColumns"
          :data="getAssociatedConfigRows(group) as DTTableRow[]"
          row-key="rowId"
          border
          empty-text="暂无关联配置"
        >
          <template #cell-isEnabled="{ row }">
            <DTTag :type="getConfigEnabled(row as ConfigGroupAssociatedConfig) ? 'success' : 'info'">
              {{ getConfigEnabled(row as ConfigGroupAssociatedConfig) ? '启用' : '禁用' }}
            </DTTag>
          </template>

          <template #cell-actions="{ row }">
            <button
              class="detail-icon-button"
              type="button"
              title="查看配置"
              @click.stop="handleConfigView(row)"
            >
              查看
            </button>
          </template>
        </DTTable>

        <DTEmpty
          v-else
          size="sm"
          title="暂无关联配置"
          description="当前分组还没有绑定任何配置。"
        />
      </DTCard>

      <div class="detail-actions">
        <button
          class="dt-button dt-button--default dt-button--md"
          type="button"
          @click="handleClose(false)"
        >
          关闭
        </button>

        <button
          class="dt-button dt-button--primary dt-button--md"
          type="button"
          @click="handleEdit"
        >
          编辑分组
        </button>
      </div>
    </div>

    <DTEmpty
      v-else
      title="未选择分组"
      description="请选择一条分组记录后查看详情。"
    />
  </DTDrawer>
</template>

<style scoped lang="scss">
.group-detail {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-3);
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
}

.detail-label {
  flex: 0 0 auto;
  color: var(--dt-text-secondary);
  font-size: 13px;
}

.detail-value {
  min-width: 0;
  color: var(--dt-text-primary);
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  word-break: break-word;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--dt-space-3);
}

.detail-icon-button {
  padding: 4px 10px;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-sm);
  color: var(--dt-color-primary);
  background: var(--dt-bg-surface);
  cursor: pointer;
  font-size: 13px;
}

.detail-icon-button:hover {
  border-color: var(--dt-color-primary);
}
</style>