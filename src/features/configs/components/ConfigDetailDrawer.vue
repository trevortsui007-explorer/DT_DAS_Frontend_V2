<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
  DTCard,
  DTDrawer,
  DTEmpty,
  DTLoading,
  DTTable,
  DTTag
} from '@/shared/components'

import type {
  DTTableColumn,
  DTTableRow
} from '@/shared/components'

import {
  fetchConfigById,
  type FileConfigDetail,
  type FileConfigFieldMappingJson,
  type FileConfigItem
} from '@/api'

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

type FieldMappingDetailRow = {
  id: string
  sourceField: string
  targetField: string
}

const loading = ref(false)
const detail = ref<FileConfigDetail | null>(null)

const displayConfig = computed<FileConfigDetail | FileConfigItem | null>(() => {
  return detail.value || props.config
})

const statusText = computed(() => {
  if (!displayConfig.value) return '-'

  return displayConfig.value.isEnabled ? '启用' : '禁用'
})

const statusType = computed(() => {
  if (!displayConfig.value) return 'info'

  return displayConfig.value.isEnabled ? 'success' : 'info'
})

const postProcessingText = computed(() => {
  const type = Number(detail.value?.postProcessingType ?? 0)

  if (type === 1) return '存储过程'
  if (type === 2) return '服务处理'

  return '不启用'
})

const postProcessingTagType = computed(() => {
  const type = Number(detail.value?.postProcessingType ?? 0)

  if (type === 1) return 'primary'
  if (type === 2) return 'success'

  return 'info'
})

const fieldMappingRows = computed<FieldMappingDetailRow[]>(() => {
  return fieldMappingJsonToRows(detail.value?.fieldMappings)
})

const hasFieldMappings = computed(() => {
  return fieldMappingRows.value.length > 0
})

const fieldMappingColumns: DTTableColumn[] = [
  {
    key: 'sourceField',
    title: '源字段',
    minWidth: 180
  },
  {
    key: 'targetField',
    title: '目标字段',
    minWidth: 180
  }
]

watch(
  () => [props.open, props.config?.id],
  () => {
    if (props.open && props.config?.id) {
      loadDetail(props.config.id)
    }

    if (!props.open) {
      detail.value = null
    }
  },
  {
    immediate: true
  }
)

async function loadDetail(id: number | string) {
  loading.value = true

  try {
    detail.value = await fetchConfigById(id)
  } finally {
    loading.value = false
  }
}

function fieldMappingJsonToRows(
  mapping?: FileConfigFieldMappingJson
): FieldMappingDetailRow[] {
  if (!mapping) {
    return []
  }

  return Object.entries(mapping).map(([sourceField, targetField], index) => {
    return {
      id: `${sourceField}-${targetField}-${index}`,
      sourceField,
      targetField
    }
  })
}

function handleClose(value: boolean) {
  emit('update:open', value)
}

function handleEdit() {
  if (!displayConfig.value) return

  emit('edit', displayConfig.value)
}
</script>

<template>
  <DTDrawer
    :open="open"
    title="配置详情"
    width="760px"
    @update:open="handleClose"
  >
    <template #description>
      查看当前采集配置的基础信息、高级配置、字段映射与后处理设置。
    </template>

    <div
      v-if="displayConfig"
      class="config-detail"
    >
      <div class="detail-loading-wrap">
        <DTLoading
          v-if="loading"
          overlay
          text="正在加载详情..."
        />

        <DTCard title="基础信息">
          <div class="detail-list">
            <div class="detail-row">
              <span class="detail-label">配置名称</span>
              <strong class="detail-value">{{ displayConfig.name }}</strong>
            </div>

            <div class="detail-row">
              <span class="detail-label">状态</span>
              <DTTag :type="statusType">
                {{ statusText }}
              </DTTag>
            </div>

            <div class="detail-row">
              <span class="detail-label">目标表</span>
              <strong class="detail-value">{{ displayConfig.targetTable || '-' }}</strong>
            </div>

            <div class="detail-row detail-row--column">
              <span class="detail-label">源路径</span>
              <code class="detail-code">{{ displayConfig.sourcePath || '-' }}</code>
            </div>
          </div>
        </DTCard>

        <DTCard title="高级配置">
          <div class="detail-list">
            <div class="detail-row">
              <span class="detail-label">文件名规则</span>
              <strong class="detail-value">{{ displayConfig.fileNamePattern || '-' }}</strong>
            </div>

            <div class="detail-row">
              <span class="detail-label">文件类型</span>
              <strong class="detail-value">{{ displayConfig.fileType || '-' }}</strong>
            </div>

            <div class="detail-row">
              <span class="detail-label">表头行</span>
              <strong class="detail-value">{{ displayConfig.headerRow ?? '-' }}</strong>
            </div>

            <div class="detail-row">
              <span class="detail-label">起始行</span>
              <strong class="detail-value">{{ displayConfig.startRow ?? '-' }}</strong>
            </div>
          </div>
        </DTCard>

        <DTCard title="字段映射">
          <DTTable
            v-if="hasFieldMappings"
            :columns="fieldMappingColumns"
            :data="fieldMappingRows as DTTableRow[]"
            row-key="id"
            empty-text="暂无字段映射"
          />

          <DTEmpty
            v-else
            size="sm"
            title="暂无字段映射"
            description="当前配置还没有返回字段映射信息。"
          />
        </DTCard>

        <DTCard title="后处理配置">
          <div class="detail-list">
            <div class="detail-row">
              <span class="detail-label">后处理方式</span>
              <DTTag :type="postProcessingTagType">
                {{ postProcessingText }}
              </DTTag>
            </div>

            <template v-if="Number(detail?.postProcessingType ?? 0) !== 0">
              <div class="detail-row">
                <span class="detail-label">后处理目标表</span>
                <strong class="detail-value">{{ detail?.postTableName || '-' }}</strong>
              </div>

              <div
                v-if="Number(detail?.postProcessingType ?? 0) === 1"
                class="detail-row"
              >
                <span class="detail-label">存储过程名称</span>
                <strong class="detail-value">{{ detail?.procedureName || '-' }}</strong>
              </div>

              <div
                v-if="Number(detail?.postProcessingType ?? 0) === 2"
                class="detail-row"
              >
                <span class="detail-label">服务名称</span>
                <strong class="detail-value">{{ detail?.serviceName || '-' }}</strong>
              </div>

              <div class="detail-row">
                <span class="detail-label">标识字段名</span>
                <strong class="detail-value">{{ detail?.flagName || '-' }}</strong>
              </div>

              <div class="detail-row">
                <span class="detail-label">标识字段值</span>
                <strong class="detail-value">{{ detail?.flag || '-' }}</strong>
              </div>
            </template>

            <div
              v-else
              class="detail-empty-line"
            >
              当前配置未启用后处理。
            </div>
          </div>
        </DTCard>

        <DTCard title="描述信息">
          <p class="detail-description">
            {{ displayConfig.description || '暂无描述' }}
          </p>
        </DTCard>

        <DTCard title="时间信息">
          <div class="detail-list">
            <div class="detail-row">
              <span class="detail-label">创建时间</span>
              <strong class="detail-value">{{ displayConfig.createTime || '-' }}</strong>
            </div>

            <div class="detail-row">
              <span class="detail-label">更新时间</span>
              <strong class="detail-value">{{ displayConfig.updateTime || '-' }}</strong>
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

.detail-loading-wrap {
  position: relative;
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

.detail-empty-line {
  display: flex;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  color: var(--dt-text-muted);
  background: var(--dt-bg-muted);
  font-size: 13px;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--dt-space-3);
}
</style>