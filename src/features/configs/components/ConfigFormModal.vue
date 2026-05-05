<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import {
  DTCard,
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

  // ++++ 3.7.1 高级基础字段
  fileNamePattern: string
  fileType: DTSelectValue | ''
  headerRow: string
  startRow: string
}

const form = reactive<ConfigFormState>({
  name: '',
  sourcePath: '',
  targetTable: '',
  isEnabled: true,
  description: '',

  // ++++ 3.7.1 高级基础字段
  fileNamePattern: '',
  fileType: 'xlsx',
  headerRow: '',
  startRow: ''
})

const touched = reactive({
  name: false,
  sourcePath: false,
  targetTable: false,
  headerRow: false,
  startRow: false
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

// ++++ 3.7.1 文件类型选项
const fileTypeOptions: DTSelectOption[] = [
  {
    label: 'Excel 2007+（.xlsx）',
    value: 'xlsx'
  },
  {
    label: 'Excel 97-2003（.xls）',
    value: 'xls'
  },
  {
    label: 'CSV（.csv）',
    value: 'csv'
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

// ++++ 3.7.1 行号校验：允许为空；不为空时必须是正整数
const headerRowError = computed(() => {
  if (!touched.headerRow) return ''
  if (!form.headerRow.trim()) return ''

  return isPositiveInteger(form.headerRow) ? '' : '表头行必须是正整数'
})

const startRowError = computed(() => {
  if (!touched.startRow) return ''
  if (!form.startRow.trim()) return ''

  return isPositiveInteger(form.startRow) ? '' : '起始行必须是正整数'
})

const hasError = computed(() => {
  return Boolean(
    !form.name.trim() ||
    !form.sourcePath.trim() ||
    !form.targetTable.trim() ||
    headerRowError.value ||
    startRowError.value
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

  // ++++ 3.7.1 高级基础字段回填
  form.fileNamePattern = props.config?.fileNamePattern || ''
  form.fileType = props.config?.fileType || 'xlsx'
  form.headerRow = props.config?.headerRow === undefined || props.config?.headerRow === null
    ? ''
    : String(props.config.headerRow)
  form.startRow = props.config?.startRow === undefined || props.config?.startRow === null
    ? ''
    : String(props.config.startRow)

  resetTouched()
}

function resetTouched() {
  touched.name = false
  touched.sourcePath = false
  touched.targetTable = false
  touched.headerRow = false
  touched.startRow = false
}

function markAllTouched() {
  touched.name = true
  touched.sourcePath = true
  touched.targetTable = true
  touched.headerRow = true
  touched.startRow = true
}

function isPositiveInteger(value: string) {
  return /^[1-9]\d*$/.test(value.trim())
}

function toOptionalNumber(value: string) {
  const normalized = value.trim()

  if (!normalized) {
    return undefined
  }

  return Number(normalized)
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
    description: form.description.trim(),

    // ++++ 3.7.1 高级基础字段提交
    fileNamePattern: form.fileNamePattern.trim(),
    fileType: String(form.fileType || 'xlsx'),
    headerRow: toOptionalNumber(form.headerRow),
    startRow: toOptionalNumber(form.startRow)
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
    width="760px"
    :confirm-text="confirmText"
    :loading="loading"
    @update:open="handleClose"
    @confirm="handleConfirm"
    @cancel="emit('cancel')"
  >
    <div class="config-form">
      <DTCard title="基础信息">
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
      </DTCard>

      <DTCard title="高级配置">
        <DTForm label-position="top">
          <DTFormItem
            label="文件名规则"
            help="用于匹配采集文件，例如：MES_*.xlsx。"
          >
            <DTInput
              v-model="form.fileNamePattern"
              placeholder="请输入文件名匹配规则"
              clearable
            />
          </DTFormItem>

          <DTFormItem
            label="文件类型"
            help="用于后续文件解析策略判断。"
          >
            <DTSelect
              v-model="form.fileType"
              :options="fileTypeOptions"
              placeholder="请选择文件类型"
            />
          </DTFormItem>

          <div class="form-grid">
            <DTFormItem
              label="表头行"
              :error="headerRowError"
              help="可为空；不为空时必须是正整数。"
            >
              <DTInput
                v-model="form.headerRow"
                placeholder="例如：1"
                clearable
                :error="Boolean(headerRowError)"
                @blur="touched.headerRow = true"
              />
            </DTFormItem>

            <DTFormItem
              label="起始行"
              :error="startRowError"
              help="可为空；不为空时必须是正整数。"
            >
              <DTInput
                v-model="form.startRow"
                placeholder="例如：2"
                clearable
                :error="Boolean(startRowError)"
                @blur="touched.startRow = true"
              />
            </DTFormItem>
          </div>
        </DTForm>
      </DTCard>
    </div>
  </DTModal>
</template>

<style scoped lang="scss">
.config-form {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--dt-space-4);
}

@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>