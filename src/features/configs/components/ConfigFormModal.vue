<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import {
  DTButton,
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

import {
  createEmptyFieldMappingRow,
  fieldMappingJsonToRows,
  rowsToFieldMappingJson,
  validateFieldMappingRows,
  type FieldMappingRow
} from '../utils/field-mapping.utils'

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

  fileNamePattern: string
  fileType: DTSelectValue | ''
  headerRow: string
  startRow: string

  // ++++ 3.7.3 后处理配置
  postProcessingType: DTSelectValue | ''
  postTableName: string
  procedureName: string
  serviceName: string
  flag: string
  flagName: string
}

const form = reactive<ConfigFormState>({
  name: '',
  sourcePath: '',
  targetTable: '',
  isEnabled: true,
  description: '',

  fileNamePattern: '',
  fileType: 'xlsx',
  headerRow: '',
  startRow: '',

  // ++++ 3.7.3 后处理配置
  postProcessingType: 0,
  postTableName: '',
  procedureName: '',
  serviceName: '',
  flag: '',
  flagName: ''
})

const fieldMappingRows = ref<FieldMappingRow[]>([])
const fieldMappingErrors = ref<string[]>([])

const touched = reactive({
  name: false,
  sourcePath: false,
  targetTable: false,
  headerRow: false,
  startRow: false,

  // ++++ 3.7.3 后处理校验
  procedureName: false,
  serviceName: false
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

// ++++ 3.7.3 后处理类型
const postProcessingTypeOptions: DTSelectOption[] = [
  {
    label: '不启用',
    value: 0
  },
  {
    label: '存储过程',
    value: 1
  },
  {
    label: '服务处理',
    value: 2
  }
]

const modalTitle = computed(() => {
  return props.mode === 'create' ? '新增配置' : '编辑配置'
})

const confirmText = computed(() => {
  return props.mode === 'create' ? '创建' : '保存'
})

const postProcessingTypeValue = computed(() => {
  return Number(form.postProcessingType || 0)
})

const isProcedureMode = computed(() => {
  return postProcessingTypeValue.value === 1
})

const isServiceMode = computed(() => {
  return postProcessingTypeValue.value === 2
})

const isPostProcessingEnabled = computed(() => {
  return postProcessingTypeValue.value !== 0
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

// ++++ 3.7.3 存储过程模式下必填
const procedureNameError = computed(() => {
  if (!touched.procedureName) return ''
  if (!isProcedureMode.value) return ''

  return form.procedureName.trim() ? '' : '存储过程名称不能为空'
})

// ++++ 3.7.3 服务处理模式下必填
const serviceNameError = computed(() => {
  if (!touched.serviceName) return ''
  if (!isServiceMode.value) return ''

  return form.serviceName.trim() ? '' : '服务名称不能为空'
})

const hasError = computed(() => {
  return Boolean(
    !form.name.trim() ||
    !form.sourcePath.trim() ||
    !form.targetTable.trim() ||
    headerRowError.value ||
    startRowError.value ||
    (isProcedureMode.value && !form.procedureName.trim()) ||
    (isServiceMode.value && !form.serviceName.trim())
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

// ++++ 3.7.3 切换后处理类型时，清理不相关校验状态
watch(
  () => form.postProcessingType,
  () => {
    touched.procedureName = false
    touched.serviceName = false
  }
)

function initForm() {
  form.name = props.config?.name || ''
  form.sourcePath = props.config?.sourcePath || ''
  form.targetTable = props.config?.targetTable || ''
  form.isEnabled = props.config?.isEnabled ?? true
  form.description = props.config?.description || ''

  form.fileNamePattern = props.config?.fileNamePattern || ''
  form.fileType = props.config?.fileType || 'xlsx'
  form.headerRow =
    props.config?.headerRow === undefined || props.config?.headerRow === null
      ? ''
      : String(props.config.headerRow)

  form.startRow =
    props.config?.startRow === undefined || props.config?.startRow === null
      ? ''
      : String(props.config.startRow)

  fieldMappingRows.value = fieldMappingJsonToRows(props.config?.fieldMappings)
  fieldMappingErrors.value = []

  // ++++ 3.7.3 后处理配置回填
  form.postProcessingType = props.config?.postProcessingType ?? 0
  form.postTableName = props.config?.postTableName || ''
  form.procedureName = props.config?.procedureName || ''
  form.serviceName = props.config?.serviceName || ''
  form.flag = props.config?.flag || ''
  form.flagName = props.config?.flagName || ''

  resetTouched()
}

function resetTouched() {
  touched.name = false
  touched.sourcePath = false
  touched.targetTable = false
  touched.headerRow = false
  touched.startRow = false
  touched.procedureName = false
  touched.serviceName = false
}

function markAllTouched() {
  touched.name = true
  touched.sourcePath = true
  touched.targetTable = true
  touched.headerRow = true
  touched.startRow = true
  touched.procedureName = true
  touched.serviceName = true
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

function handleAddFieldMapping() {
  fieldMappingRows.value.push(createEmptyFieldMappingRow())
  fieldMappingErrors.value = []
}

function handleRemoveFieldMapping(index: number) {
  fieldMappingRows.value.splice(index, 1)

  if (!fieldMappingRows.value.length) {
    fieldMappingRows.value.push(createEmptyFieldMappingRow())
  }

  fieldMappingErrors.value = []
}

function handleFieldMappingInput() {
  fieldMappingErrors.value = []
}

function validateFieldMappings() {
  const errors = validateFieldMappingRows(fieldMappingRows.value)

  fieldMappingErrors.value = errors

  return errors.length === 0
}

function buildPayload(): CreateFileConfigPayload | UpdateFileConfigPayload {
  return {
    name: form.name.trim(),
    sourcePath: form.sourcePath.trim(),
    targetTable: form.targetTable.trim(),
    isEnabled: Boolean(form.isEnabled),
    description: form.description.trim(),

    fileNamePattern: form.fileNamePattern.trim(),
    fileType: String(form.fileType || 'xlsx'),
    headerRow: toOptionalNumber(form.headerRow),
    startRow: toOptionalNumber(form.startRow),

    fieldMappings: rowsToFieldMappingJson(fieldMappingRows.value),

    // ++++ 3.7.3 后处理配置提交
    postProcessingType: postProcessingTypeValue.value,
    postTableName: form.postTableName.trim(),
    procedureName: form.procedureName.trim(),
    serviceName: form.serviceName.trim(),
    flag: form.flag.trim(),
    flagName: form.flagName.trim()
  }
}

function handleConfirm() {
  markAllTouched()

  if (hasError.value) {
    return
  }

  if (!validateFieldMappings()) {
    return
  }

  emit('submit', buildPayload())
}
</script>

<template>
  <DTModal
    :open="open"
    :title="modalTitle"
    width="900px"
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

      <DTCard title="字段映射">
        <div class="field-mapping">
          <div class="field-mapping__header">
            <div>
              <p class="field-mapping__desc">
                用于配置源文件字段与目标表字段之间的对应关系。
              </p>

              <div
                v-if="fieldMappingErrors.length"
                class="field-mapping__errors"
              >
                <p
                  v-for="error in fieldMappingErrors"
                  :key="error"
                >
                  {{ error }}
                </p>
              </div>
            </div>

            <DTButton
              size="sm"
              type="primary"
              @click="handleAddFieldMapping"
            >
              新增字段
            </DTButton>
          </div>

          <div class="field-mapping__list">
            <div
              v-for="(row, index) in fieldMappingRows"
              :key="row.id"
              class="field-mapping__row"
            >
              <div class="field-mapping__index">
                #{{ index + 1 }}
              </div>

              <DTInput
                v-model="row.sourceField"
                placeholder="源字段，例如：批次号"
                clearable
                @input="handleFieldMappingInput"
              />

              <div class="field-mapping__arrow">
                →
              </div>

              <DTInput
                v-model="row.targetField"
                placeholder="目标字段，例如：LotNo"
                clearable
                @input="handleFieldMappingInput"
              />

              <DTButton
                size="sm"
                type="danger"
                @click="handleRemoveFieldMapping(index)"
              >
                删除
              </DTButton>
            </div>
          </div>
        </div>
      </DTCard>

      <DTCard title="后处理配置">
        <DTForm label-position="top">
          <DTFormItem
            label="后处理方式"
            help="不启用时，下面配置可以为空。"
          >
            <DTSelect
              v-model="form.postProcessingType"
              :options="postProcessingTypeOptions"
              placeholder="请选择后处理方式"
            />
          </DTFormItem>

          <div
            v-if="isPostProcessingEnabled"
            class="post-processing-panel"
          >
            <DTFormItem
              label="后处理目标表"
              help="可选。用于记录后处理结果或中间数据的目标表。"
            >
              <DTInput
                v-model="form.postTableName"
                placeholder="请输入后处理目标表"
                clearable
              />
            </DTFormItem>

            <DTFormItem
              v-if="isProcedureMode"
              label="存储过程名称"
              required
              :error="procedureNameError"
            >
              <DTInput
                v-model="form.procedureName"
                placeholder="例如：pr_DA_PostProcess"
                clearable
                :error="Boolean(procedureNameError)"
                @blur="touched.procedureName = true"
              />
            </DTFormItem>

            <DTFormItem
              v-if="isServiceMode"
              label="服务名称"
              required
              :error="serviceNameError"
            >
              <DTInput
                v-model="form.serviceName"
                placeholder="请输入服务名称"
                clearable
                :error="Boolean(serviceNameError)"
                @blur="touched.serviceName = true"
              />
            </DTFormItem>

            <div class="form-grid">
              <DTFormItem
                label="标识字段名"
                help="例如：ProcessFlag。"
              >
                <DTInput
                  v-model="form.flagName"
                  placeholder="请输入标识字段名"
                  clearable
                />
              </DTFormItem>

              <DTFormItem
                label="标识字段值"
                help="例如：Y / 1 / DONE。"
              >
                <DTInput
                  v-model="form.flag"
                  placeholder="请输入标识字段值"
                  clearable
                />
              </DTFormItem>
            </div>
          </div>

          <div
            v-else
            class="post-processing-empty"
          >
            当前未启用后处理。
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

.field-mapping {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.field-mapping__header {
  display: flex;
  gap: var(--dt-space-4);
  align-items: flex-start;
  justify-content: space-between;
}

.field-mapping__desc {
  margin: 0;
  color: var(--dt-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.field-mapping__errors {
  margin-top: var(--dt-space-2);
  color: var(--dt-color-danger);
  font-size: 13px;
  line-height: 1.6;
}

.field-mapping__errors p {
  margin: 0;
}

.field-mapping__list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-3);
}

.field-mapping__row {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 24px minmax(0, 1fr) auto;
  gap: var(--dt-space-3);
  align-items: center;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-lg);
  background: var(--dt-bg-muted);
}

.field-mapping__index {
  color: var(--dt-text-muted);
  font-size: 13px;
  text-align: center;
}

.field-mapping__arrow {
  color: var(--dt-text-muted);
  text-align: center;
}

.post-processing-panel {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.post-processing-empty {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--dt-border-subtle);
  border-radius: var(--dt-radius-lg);
  color: var(--dt-text-muted);
  background: var(--dt-bg-muted);
  font-size: 14px;
}

@media (max-width: 860px) {
  .field-mapping__row {
    grid-template-columns: 1fr;
  }

  .field-mapping__index,
  .field-mapping__arrow {
    text-align: left;
  }
}

@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>