<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
  DTCard,
  DTDrawer,
  DTEmpty,
  DTLoading,
  DTTag
} from '@/shared/components'

import {
  fetchTaskById,
  type TaskDetail,
  type TaskItem
} from '@/api'

import {
  formatCronText,
  formatDateTime
} from '../utils/task-cron-format'

import {
  getTaskModeTagType,
  getTaskModeText
} from '../utils/task-mode'

const props = withDefaults(
  defineProps<{
    open: boolean
    task: TaskItem | null
  }>(),
  {
    open: false,
    task: null
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  edit: [row: TaskItem]
}>()

const loading = ref(false)
const detail = ref<TaskDetail | null>(null)

const displayTask = computed<TaskDetail | TaskItem | null>(() => {
  return detail.value || props.task
})

const enabled = computed(() => {
  if (!displayTask.value) return false

  return Number(displayTask.value.isEnabled) === 1
})

const associatedGroups = computed(() => {
  return displayTask.value?.associatedGroups || []
})

watch(
  () => [props.open, props.task?.id],
  () => {
    if (props.open && props.task?.id) {
      loadDetail(props.task.id)
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
    detail.value = await fetchTaskById(id)
  } finally {
    loading.value = false
  }
}

function handleClose(value: boolean) {
  emit('update:open', value)
}

function handleEdit() {
  if (!displayTask.value) return

  emit('edit', displayTask.value)
}
</script>

<template>
  <DTDrawer
    :open="open"
    title="任务详情"
    width="680px"
    @update:open="handleClose"
  >
    <template #description>
      查看当前采集任务的基础信息和绑定信息。
    </template>

    <div v-if="displayTask" class="task-detail">
      <div class="detail-loading-wrap">
        <DTLoading
          v-if="loading"
          overlay
          text="正在加载详情..."
        />

        <DTCard title="基础信息">
          <div class="detail-list">
            <div class="detail-row">
              <span class="detail-label">任务名称</span>
              <strong class="detail-value">{{ displayTask.taskName }}</strong>
            </div>

            <div class="detail-row">
              <span class="detail-label">任务类型</span>
              <DTTag :type="getTaskModeTagType(displayTask.taskMode)">
                {{ getTaskModeText(displayTask.taskMode) }}
              </DTTag>
            </div>

            <div class="detail-row">
              <span class="detail-label">状态</span>
              <DTTag :type="enabled ? 'success' : 'info'">
                {{ enabled ? '启用' : '禁用' }}
              </DTTag>
            </div>

            <div class="detail-row detail-row--column">
              <span class="detail-label">Cron 表达式</span>

              <code class="detail-code">
                {{ displayTask.cronExpression || '-' }}
              </code>

              <p class="detail-cron-text">
                {{ formatCronText(displayTask.cronExpression) }}
              </p>
            </div>
          </div>
        </DTCard>

        <DTCard title="绑定分组">
          <div
            v-if="associatedGroups.length"
            class="group-list"
          >
            <div
              v-for="group in associatedGroups"
              :key="group.id"
              class="group-item"
            >
              <div>
                <strong>{{ group.groupName }}</strong>
                <p>{{ group.groupCategory }} / {{ group.groupType }}</p>
              </div>

              <div class="group-item__meta">
                <DTTag type="primary">
                  {{ group.configCount }} 个配置
                </DTTag>

                <DTTag :type="Number(group.isEnabled) === 1 ? 'success' : 'info'">
                  {{ Number(group.isEnabled) === 1 ? '启用' : '禁用' }}
                </DTTag>
              </div>
            </div>
          </div>

          <DTEmpty
            v-else
            size="sm"
            title="暂无绑定分组"
            description="当前任务还没有绑定任何配置分组。"
          />
        </DTCard>

        <DTCard title="描述信息">
          <p class="detail-description">
            {{ displayTask.description || '暂无描述' }}
          </p>
        </DTCard>

        <DTCard title="时间信息">
          <div class="detail-list">
            <div class="detail-row">
              <span class="detail-label">创建时间</span>
              <strong class="detail-value">
                {{ formatDateTime(displayTask.createTime) }}
              </strong>
            </div>

            <div class="detail-row">
              <span class="detail-label">更新时间</span>
              <strong class="detail-value">
                {{ formatDateTime(displayTask.updateTime) }}
              </strong>
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
            编辑任务
          </button>
        </div>
      </div>
    </div>

    <DTEmpty
      v-else
      title="未选择任务"
      description="请选择一条任务记录后查看详情。"
    />
  </DTDrawer>
</template>

<style scoped lang="scss">
.task-detail,
.detail-loading-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.detail-loading-wrap {
  position: relative;
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

.detail-cron-text {
  margin: 0;
  color: var(--dt-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-3);
}

.group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  background: var(--dt-bg-surface);
}

.group-item strong {
  color: var(--dt-text-primary);
  font-size: 14px;
}

.group-item p {
  margin: 4px 0 0;
  color: var(--dt-text-muted);
  font-size: 12px;
}

.group-item__meta {
  display: flex;
  flex: 0 0 auto;
  gap: var(--dt-space-2);
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