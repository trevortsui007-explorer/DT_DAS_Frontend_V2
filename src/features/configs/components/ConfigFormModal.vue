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
  CreateFileConfigPayload,
  FileConfigItem,
  UpdateFileConfigPayload
} from '@/api'

import type {
  DTSelectOption,
  DTSelectValue
} from '@/shared/components'

export type ConfigFormMode = 'create' | 'edit'

const props = withDefaults(
  defineProps<{
    open: boolean
    mode: ConfigFormMode
    config?: FileConfigItem | null
    loading?: boolean
  }>(),
  {
    open: false,
    mode: 'create',
    config: null,
    loading: false
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [payload: CreateFileConfigPayload | UpdateFileConfigPayload]
  cancel: []
}>()

type ConfigFormState = {
  name: string
  sourcePath: string
  targetTable: string
  isEnabled: DTSelectValue | ''
  description: string
}

const form = reactive<ConfigFormState>({
  name: '',
  sourcePath: '',
  targetTable: '',
  isEnabled: true,
  description: ''
})

const touched = reactive({
  name: false,
  sourcePath: false,
  targetTable: false
})

const enabledOptions: DTSelectOption[] = [
  {
    label: '启用',
    value: true
  },
  {
    label: '禁用',
    value: false
  }
]

const modalTitle = computed(() => {
  return props.mode === 'create' ? '新增配置' : '编辑配置'
})

const confirmText = computed(() => {
  return props.mode === 'create' ? '创建' : '保存'
})

const nameError = computed(() => {
  if (!touched.name) return ''

  return form.name.trim() ? '' : '配置名称不能为空'
})

const sourcePathError = computed(() => {
  if (!touched.sourcePath) return ''

  return form.sourcePath.trim() ? '' : '源路径不能为空'
})

const targetTableError = computed(() => {
  if (!touched.targetTable) return ''

  return form.targetTable.trim() ? '' : '目标表不能为空'
})

const hasError = computed(() => {
  return Boolean(
    !form.name.trim() ||
    !form.sourcePath.trim() ||
    !form.targetTable.trim()
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
  () => props.config,
  () => {
    if (props.open) {
      initForm()
    }
  }
)

function initForm() {
  form.name = props.config?.name || ''
  form.sourcePath = props.config?.sourcePath || ''
  form.targetTable = props.config?.targetTable || ''
  form.isEnabled = props.config?.isEnabled ?? true
  form.description = props.config?.description || ''

  resetTouched()
}

function resetTouched() {
  touched.name = false
  touched.sourcePath = false
  touched.targetTable = false
}

function markAllTouched() {
  touched.name = true
  touched.sourcePath = true
  touched.targetTable = true
}

function handleClose(value: boolean) {
  emit('update:open', value)

  if (!value) {
    emit('cancel')
  }
}

function buildPayload(): CreateFileConfigPayload | UpdateFileConfigPayload {
  return {
    name: form.name.trim(),
    sourcePath: form.sourcePath.trim(),
    targetTable: form.targetTable.trim(),
    isEnabled: Boolean(form.isEnabled),
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
    width="720px"
    :confirm-text="confirmText"
    :loading="loading"
    @update:open="handleClose"
    @confirm="handleConfirm"
    @cancel="emit('cancel')"
  >
    <DTForm label-position="top">
      <DTFormItem
        label="配置名称"
        required
        :error="nameError"
      >
        <DTInput
          v-model="form.name"
          placeholder="请输入配置名称"
          clearable
          :error="Boolean(nameError)"
          @blur="touched.name = true"
        />
      </DTFormItem>

      <DTFormItem
        label="源路径"
        required
        :error="sourcePathError"
        help="例如：\\\\server\\mes\\data"
      >
        <DTInput
          v-model="form.sourcePath"
          placeholder="请输入文件源路径"
          clearable
          :error="Boolean(sourcePathError)"
          @blur="touched.sourcePath = true"
        />
      </DTFormItem>

      <DTFormItem
        label="目标表"
        required
        :error="targetTableError"
      >
        <DTInput
          v-model="form.targetTable"
          placeholder="请输入目标表名"
          clearable
          :error="Boolean(targetTableError)"
          @blur="touched.targetTable = true"
        />
      </DTFormItem>

      <DTFormItem
        label="状态"
        help="禁用后该配置不会参与任务执行。"
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
          placeholder="请输入描述信息"
          clearable
        />
      </DTFormItem>
    </DTForm>
  </DTModal>
</template>