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
  ConfigGroupItem,
  CreateGroupPayload,
  UpdateGroupPayload
} from '@/api'

import type {
  DTSelectOption,
  DTSelectValue
} from '@/shared/components'

export type GroupFormMode = 'create' | 'edit'

const props = withDefaults(
  defineProps<{
    open: boolean
    mode: GroupFormMode
    group?: ConfigGroupItem | null
    loading?: boolean
  }>(),
  {
    open: false,
    mode: 'create',
    group: null,
    loading: false
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [payload: CreateGroupPayload | UpdateGroupPayload]
  cancel: []
}>()

type GroupFormState = {
  groupName: string
  groupCategory: string
  groupType: DTSelectValue | ''
  isEnabled: DTSelectValue | ''
}

const form = reactive<GroupFormState>({
  groupName: '',
  groupCategory: '',
  groupType: '',
  isEnabled: 1
})

const touched = reactive({
  groupName: false,
  groupCategory: false,
  groupType: false
})

const groupTypeOptions: DTSelectOption[] = [
  {
    label: '默认执行组',
    value: '默认执行组'
  },
  {
    label: '默认周期执行组',
    value: '默认周期执行组'
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
  return props.mode === 'create' ? '新增分组' : '编辑分组'
})

const confirmText = computed(() => {
  return props.mode === 'create' ? '创建' : '保存'
})

const groupNameError = computed(() => {
  if (!touched.groupName) return ''

  return form.groupName.trim() ? '' : '分组名称不能为空'
})

const groupCategoryError = computed(() => {
  if (!touched.groupCategory) return ''

  return form.groupCategory.trim() ? '' : '分组类别不能为空'
})

const groupTypeError = computed(() => {
  if (!touched.groupType) return ''

  return form.groupType ? '' : '分组类型不能为空'
})

const hasError = computed(() => {
  return Boolean(
    !form.groupName.trim() ||
    !form.groupCategory.trim() ||
    !form.groupType
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
  () => props.group,
  () => {
    if (props.open) {
      initForm()
    }
  }
)

function initForm() {
  form.groupName = props.group?.groupName || ''
  form.groupCategory = props.group?.groupCategory || ''
  form.groupType = props.group?.groupType || ''
  form.isEnabled = props.group?.isEnabled ?? 1

  resetTouched()
}

function resetTouched() {
  touched.groupName = false
  touched.groupCategory = false
  touched.groupType = false
}

function markAllTouched() {
  touched.groupName = true
  touched.groupCategory = true
  touched.groupType = true
}

function handleClose(value: boolean) {
  emit('update:open', value)

  if (!value) {
    emit('cancel')
  }
}

function buildPayload(): CreateGroupPayload | UpdateGroupPayload {
  return {
    groupName: form.groupName.trim(),
    groupCategory: form.groupCategory.trim(),
    groupType: String(form.groupType),
    isEnabled: Number(form.isEnabled) === 1 ? 1 : 0
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
    width="620px"
    :confirm-text="confirmText"
    :loading="loading"
    @update:open="handleClose"
    @confirm="handleConfirm"
    @cancel="emit('cancel')"
  >
    <DTForm label-position="top">
      <DTFormItem
        label="分组名称"
        required
        :error="groupNameError"
      >
        <DTInput
          v-model="form.groupName"
          placeholder="请输入分组名称"
          clearable
          :error="Boolean(groupNameError)"
          @blur="touched.groupName = true"
        />
      </DTFormItem>

      <DTFormItem
        label="分组类别"
        required
        :error="groupCategoryError"
        help="例如：麦逊、二厂。"
      >
        <DTInput
          v-model="form.groupCategory"
          placeholder="请输入分组类别"
          clearable
          :error="Boolean(groupCategoryError)"
          @blur="touched.groupCategory = true"
        />
      </DTFormItem>

      <DTFormItem
        label="分组类型"
        required
        :error="groupTypeError"
      >
        <DTSelect
          v-model="form.groupType"
          :options="groupTypeOptions"
          placeholder="请选择分组类型"
          clearable
          @blur="touched.groupType = true"
        />
      </DTFormItem>

      <DTFormItem
        label="状态"
        help="禁用后该分组不会参与相关执行逻辑。"
      >
        <DTSelect
          v-model="form.isEnabled"
          :options="enabledOptions"
          placeholder="请选择状态"
        />
      </DTFormItem>
    </DTForm>
  </DTModal>
</template>