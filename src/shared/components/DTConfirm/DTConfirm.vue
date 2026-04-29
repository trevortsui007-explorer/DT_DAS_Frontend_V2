<script setup lang="ts">
import { computed, ref } from 'vue'

import DTModal from '@/shared/components/DTModal'

export type DTConfirmType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export type DTConfirmOptions = {
  title?: string
  content?: string
  type?: DTConfirmType
  width?: string | number
  confirmText?: string
  cancelText?: string
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
}

export type DTConfirmResult = boolean

type ConfirmTask = Required<Omit<DTConfirmOptions, 'width'>> & {
  id: string
  width: string | number
  resolve: (value: DTConfirmResult) => void
}

const DEFAULT_OPTIONS: Required<DTConfirmOptions> = {
  title: '确认操作',
  content: '',
  type: 'default',
  width: '460px',
  confirmText: '确认',
  cancelText: '取消',
  closeOnOverlay: false,
  closeOnEsc: true
}

const open = ref(false)
const currentTask = ref<ConfirmTask | null>(null)

const iconTextMap: Record<DTConfirmType, string> = {
  default: '?',
  primary: 'i',
  success: '✓',
  warning: '!',
  danger: '!',
  info: 'i'
}

const currentType = computed(() => {
  return currentTask.value?.type || 'default'
})

function createTaskId() {
  return `dt-confirm-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function ask(options: DTConfirmOptions = {}) {
  return new Promise<DTConfirmResult>((resolve) => {
    const task: ConfirmTask = {
      ...DEFAULT_OPTIONS,
      ...options,
      id: createTaskId(),
      resolve
    }

    currentTask.value = task
    open.value = true
  })
}

function resolveCurrent(value: DTConfirmResult) {
  if (!currentTask.value) return

  const task = currentTask.value

  open.value = false
  currentTask.value = null

  task.resolve(value)
}

function handleConfirm() {
  resolveCurrent(true)
}

function handleCancel() {
  resolveCurrent(false)
}

function handleClose() {
  resolveCurrent(false)
}

defineExpose({
  ask
})
</script>

<template>
  <DTModal
    v-model:open="open"
    :title="currentTask?.title"
    :width="currentTask?.width"
    :confirm-text="currentTask?.confirmText"
    :cancel-text="currentTask?.cancelText"
    :close-on-overlay="currentTask?.closeOnOverlay"
    :close-on-esc="currentTask?.closeOnEsc"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <div
      v-if="currentTask"
      class="dt-confirm"
      :class="`dt-confirm--${currentType}`"
    >
      <div class="dt-confirm__icon">
        {{ iconTextMap[currentType] }}
      </div>

      <div class="dt-confirm__content">
        <slot>
          <p class="dt-confirm__text">
            {{ currentTask.content }}
          </p>
        </slot>
      </div>
    </div>
  </DTModal>
</template>

<style scoped lang="scss">
.dt-confirm {
  display: flex;
  gap: var(--dt-space-4);
  align-items: flex-start;
}

.dt-confirm__icon {
  display: inline-grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  color: var(--dt-text-inverse);
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
}

.dt-confirm__content {
  min-width: 0;
  flex: 1;
}

.dt-confirm__text {
  margin: 6px 0 0;
  color: var(--dt-text-secondary);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

.dt-confirm--default .dt-confirm__icon,
.dt-confirm--info .dt-confirm__icon {
  background: var(--dt-color-info);
}

.dt-confirm--primary .dt-confirm__icon {
  background: var(--dt-color-primary);
}

.dt-confirm--success .dt-confirm__icon {
  background: var(--dt-color-success);
}

.dt-confirm--warning .dt-confirm__icon {
  background: var(--dt-color-warning);
}

.dt-confirm--danger .dt-confirm__icon {
  background: var(--dt-color-danger);
}
</style>