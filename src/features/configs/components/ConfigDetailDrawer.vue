<script setup lang="ts">
import { computed } from 'vue'

import {
  DTCard,
  DTDrawer,
  DTEmpty,
  DTTag
} from '@/shared/components'

import type { FileConfigItem } from '@/api'

const props = withDefaults(
  defineProps<{
    open: boolean
    config: FileConfigItem | null
  }>(),
  {
    open: false,
    config: null
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  edit: [row: FileConfigItem]
}>()

const statusText = computed(() => {
  if (!props.config) return '-'

  return props.config.isEnabled ? '启用' : '禁用'
})

const statusType = computed(() => {
  if (!props.config) return 'info'

  return props.config.isEnabled ? 'success' : 'info'
})

function handleClose(value: boolean) {
  emit('update:open', value)
}

function handleEdit() {
  if (!props.config) return

  emit('edit', props.config)
}
</script>

<template>
  <DTDrawer
    :open="open"
    title="配置详情"
    width="620px"
    @update:open="handleClose"
  >
    <template #description>
      查看当前采集配置的基础信息。
    </template>

    <div v-if="config" class="config-detail">
      <DTCard title="基础信息">
        <div class="detail-list">
          <div class="detail-row">
            <span class="detail-label">配置名称</span>
            <strong class="detail-value">{{ config.name }}</strong>
          </div>

          <div class="detail-row">
            <span class="detail-label">状态</span>
            <DTTag :type="statusType">
              {{ statusText }}
            </DTTag>
          </div>

          <div class="detail-row">
            <span class="detail-label">目标表</span>
            <strong class="detail-value">{{ config.targetTable || '-' }}</strong>
          </div>

          <div class="detail-row detail-row--column">
            <span class="detail-label">源路径</span>
            <code class="detail-code">{{ config.sourcePath || '-' }}</code>
          </div>
        </div>
      </DTCard>

      <DTCard title="描述信息">
        <p class="detail-description">
          {{ config.description || '暂无描述' }}
        </p>
      </DTCard>

      <DTCard title="时间信息">
        <div class="detail-list">
          <div class="detail-row">
            <span class="detail-label">创建时间</span>
            <strong class="detail-value">{{ config.createTime || '-' }}</strong>
          </div>

          <div class="detail-row">
            <span class="detail-label">更新时间</span>
            <strong class="detail-value">{{ config.updateTime || '-' }}</strong>
          </div>
        </div>
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
          编辑配置
        </button>
      </div>
    </div>

    <DTEmpty
      v-else
      title="未选择配置"
      description="请选择一条配置记录后查看详情。"
    />
  </DTDrawer>
</template>

<style scoped lang="scss">
.config-detail {
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

.detail-row--column {
  align-items: flex-start;
  flex-direction: column;
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

.detail-code {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  color: var(--dt-text-primary);
  background: var(--dt-bg-muted);
  font-family:
    Consolas,
    Monaco,
    'Courier New',
    monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.detail-description {
  margin: 0;
  color: var(--dt-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--dt-space-3);
}
</style>