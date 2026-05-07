<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import {
  DTForm,
  DTFormItem,
  DTInput,
  DTModal,
  DTSelect
} from '@/shared/components'

import type {
  CreateTaskPayload,
  TaskItem,
  UpdateTaskPayload
} from '@/api'

import type {
  DTSelectOption,
  DTSelectValue
} from '@/shared/components'

export type TaskFormMode = 'create' | 'edit'

const props = withDefaults(
  defineProps<{
    open: boolean
    mode: TaskFormMode
    task?: TaskItem | null
    loading?: boolean
  }>(),
  {
    open: false,
    mode: 'create',
    task: null,
    loading: false
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [payload: CreateTaskPayload | UpdateTaskPayload]
  cancel: []
}>()

type TaskFormState = {
  taskName: string
  taskMode: DTSelectValue | ''
  cronExpression: string
  isEnabled: DTSelectValue | ''
  description: string
}

const form = reactive<TaskFormState>({
  taskName: '',
  taskMode: '',
  cronExpression: '',
  isEnabled: 1,
  description: ''
})

const touched = reactive({
  taskName: false,
  taskMode: false,
  cronExpression: false
})

const taskModeOptions: DTSelectOption[] = [
  {
    label: '手动任务',
    value: 0
  },
  {
    label: '定时任务',
    value: 1
  }
]

const enabledOptions: DTSelectOption[] = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '禁用',
    value: 0
  }
]

const modalTitle = computed(() => {
  return props.mode === 'create' ? '新增任务' : '编辑任务'
})

const confirmText = computed(() => {
  return props.mode === 'create' ? '创建' : '保存'
})

const taskNameError = computed(() => {
  if (!touched.taskName) return ''

  return form.taskName.trim() ? '' : '任务名称不能为空'
})

const taskModeError = computed(() => {
  if (!touched.taskMode) return ''

  return form.taskMode !== '' ? '' : '任务类型不能为空'
})

const cronExpressionError = computed(() => {
  if (!touched.cronExpression) return ''

  return form.cronExpression.trim() ? '' : 'Cron 表达式不能为空'
})

const hasError = computed(() => {
  return Boolean(
    !form.taskName.trim() ||
    form.taskMode === '' ||
    !form.cronExpression.trim()
  )
})

watch(
  () => props.open,
  (value) => {
    if (value) {
      initForm()
    }
  }
)

watch(
  () => props.task,
  () => {
    if (props.open) {
      initForm()
    }
  }
)

function initForm() {
  form.taskName = props.task?.taskName || ''
  form.taskMode = props.task?.taskMode ?? ''
  form.cronExpression = props.task?.cronExpression || ''
  form.isEnabled = props.task?.isEnabled ?? 1
  form.description = props.task?.description || ''

  resetTouched()
}

function resetTouched() {
  touched.taskName = false
  touched.taskMode = false
  touched.cronExpression = false
}

function markAllTouched() {
  touched.taskName = true
  touched.taskMode = true
  touched.cronExpression = true
}

function handleClose(value: boolean) {
  emit('update:open', value)

  if (!value) {
    emit('cancel')
  }
}

function handleTaskModeChange() {
  touched.taskMode = true
}

function buildPayload(): CreateTaskPayload | UpdateTaskPayload {
  return {
    taskName: form.taskName.trim(),
    taskMode: Number(form.taskMode) === 1 ? 1 : 0,
    cronExpression: form.cronExpression.trim(),
    isEnabled: Number(form.isEnabled) === 1 ? 1 : 0,
    description: form.description.trim()
  }
}

function handleConfirm() {
  markAllTouched()

  if (hasError.value) {
    return
  }

  emit('submit', buildPayload())
}
</script>

<template>
  <DTModal
    :open="open"
    :title="modalTitle"
    width="680px"
    :confirm-text="confirmText"
    :loading="loading"
    @update:open="handleClose"
    @confirm="handleConfirm"
    @cancel="emit('cancel')"
  >
    <DTForm label-position="top">
      <DTFormItem
        label="任务名称"
        required
        :error="taskNameError"
      >
        <DTInput
          v-model="form.taskName"
          placeholder="请输入任务名称"
          clearable
          :error="Boolean(taskNameError)"
          @blur="touched.taskName = true"
        />
      </DTFormItem>

      <DTFormItem
        label="任务类型"
        required
        :error="taskModeError"
      >
        <DTSelect
          v-model="form.taskMode"
          :options="taskModeOptions"
          placeholder="请选择任务类型"
          clearable
          @change="handleTaskModeChange"
        />
      </DTFormItem>

      <DTFormItem
        label="Cron 表达式"
        required
        :error="cronExpressionError"
        help="例如：17 16 * * * 表示每天 16:17 执行。"
      >
        <DTInput
          v-model="form.cronExpression"
          placeholder="请输入 Cron 表达式"
          clearable
          :error="Boolean(cronExpressionError)"
          @blur="touched.cronExpression = true"
        />
      </DTFormItem>

      <DTFormItem
        label="状态"
        help="禁用后该任务不会自动执行。"
      >
        <DTSelect
          v-model="form.isEnabled"
          :options="enabledOptions"
          placeholder="请选择状态"
        />
      </DTFormItem>

      <DTFormItem label="描述">
        <DTInput
          v-model="form.description"
          placeholder="请输入任务描述"
          clearable
        />
      </DTFormItem>
    </DTForm>
  </DTModal>
</template>