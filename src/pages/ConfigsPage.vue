<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { DTCard } from '@/shared/components'
import { confirm, message } from '@/shared/composables'

import {
  ConfigDetailDrawer,
  ConfigFormModal,
  ConfigsTable,
  ConfigsToolbar,
  useConfigsList
} from '@/features/configs'

import {
  createConfig,
  fetchConfigById,
  updateConfig,
  type CreateFileConfigPayload,
  type FileConfigDetail,
  type FileConfigItem,
  type UpdateFileConfigPayload
} from '@/api'

import type { ConfigFormMode } from '@/features/configs'

const {
  loading,
  keyword,
  status,
  statusOptions,
  filteredConfigs,
  loadConfigs,
  toggleConfigStatus,
  resetFilters
} = useConfigsList()

const detailOpen = ref(false)
const formOpen = ref(false)
const formLoading = ref(false)
const detailLoading = ref(false)

const formMode = ref<ConfigFormMode>('create')
const currentConfig = ref<FileConfigItem | FileConfigDetail | null>(null)

onMounted(() => {
  loadConfigs()
})

function handleCreate() {
  currentConfig.value = null
  formMode.value = 'create'
  formOpen.value = true
}

function handleView(row: FileConfigItem) {
  currentConfig.value = row
  detailOpen.value = true
}

async function handleEdit(row: FileConfigItem) {
  formMode.value = 'edit'
  detailLoading.value = true

  try {
    const detail = await fetchConfigById(row.id)

    currentConfig.value = detail
    formOpen.value = true
  } finally {
    detailLoading.value = false
  }
}

async function handleToggle(row: FileConfigItem) {
  const ok = await confirm({
    title: row.isEnabled ? '确认禁用配置' : '确认启用配置',
    content: `配置：${row.name}`,
    type: row.isEnabled ? 'warning' : 'success',
    confirmText: row.isEnabled ? '禁用' : '启用'
  })

  if (!ok) return

  try {
    await toggleConfigStatus(row)
    message.success(`${row.isEnabled ? '已启用' : '已禁用'}：${row.name}`)
  } catch (error) {
    message.error('状态更新失败')
  }
}

function handleReset() {
  resetFilters()
  message.info('筛选条件已重置')
}

async function handleSubmitConfig(
  payload: CreateFileConfigPayload | UpdateFileConfigPayload
) {
  formLoading.value = true

  try {
    if (formMode.value === 'create') {
      await createConfig(payload as CreateFileConfigPayload)
      message.success('配置创建成功')
    } else {
      if (!currentConfig.value) {
        message.error('未选择要编辑的配置')
        return
      }

      await updateConfig(currentConfig.value.id, payload as UpdateFileConfigPayload)
      message.success('配置保存成功')
    }

    formOpen.value = false
    await loadConfigs()
  } finally {
    formLoading.value = false
  }
}

function handleFormOpenChange(value: boolean) {
  formOpen.value = value

  if (!value) {
    currentConfig.value = null
  }
}
</script>

<template>
  <div class="page">

    <DTCard>
      <ConfigsToolbar
        v-model:keyword="keyword"
        v-model:status="status"
        :status-options="statusOptions"
        @search="loadConfigs"
        @reset="handleReset"
        @refresh="loadConfigs"
        @create="handleCreate"
      />
    </DTCard>

    <DTCard>
      <ConfigsTable
        :data="filteredConfigs"
        :loading="loading || detailLoading"
        @view="handleView"
        @edit="handleEdit"
        @toggle="handleToggle"
      />
    </DTCard>

    <ConfigDetailDrawer
      v-model:open="detailOpen"
      :config="currentConfig"
      @edit="handleEdit"
    />

    <ConfigFormModal
      :open="formOpen"
      :mode="formMode"
      :config="currentConfig"
      :loading="formLoading"
      @update:open="handleFormOpenChange"
      @submit="handleSubmitConfig"
    />
  </div>
</template>