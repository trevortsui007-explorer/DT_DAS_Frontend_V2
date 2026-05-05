<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { DTCard } from '@/shared/components'
import { confirm, message } from '@/shared/composables'

import {
  ConfigDetailDrawer,
  ConfigsTable,
  ConfigsToolbar,
  useConfigsList
} from '@/features/configs'

import type { FileConfigItem } from '@/api'

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
const currentConfig = ref<FileConfigItem | null>(null)

onMounted(() => {
  loadConfigs()
})

function handleCreate() {
  message.info('新增配置功能将在下一阶段迁移')
}

function handleView(row: FileConfigItem) {
  message.info(`查看配置：${row.name}`)
  currentConfig.value = row
  detailOpen.value = true
}

function handleEdit(row: FileConfigItem) {
  message.info(`编辑配置：${row.name}`)
}

async function handleToggle(row: FileConfigItem) {
  const ok = await confirm({
    title: row.isEnabled ? '确认禁用配置' : '确认启用配置',
    content: `配置：${row.name}`,
    type: row.isEnabled ? 'warning' : 'success',
    confirmText: row.isEnabled ? '禁用' : '启用'
  })

  if (!ok) return

  await toggleConfigStatus(row)

  message.success('状态更新成功')
}

function handleReset() {
  resetFilters()
  message.info('筛选条件已重置')
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
        :loading="loading"
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
  </div>
</template>