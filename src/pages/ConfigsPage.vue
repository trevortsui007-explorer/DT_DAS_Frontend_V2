<script setup lang="ts">
import { onMounted } from 'vue'

import { DTCard } from '@/shared/components'
import { confirm, message } from '@/shared/composables'

import {
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
  toggleConfigStatus
} = useConfigsList()

onMounted(() => {
  loadConfigs()
})

function handleCreate() {
  message.info('新增配置功能将在下一阶段迁移')
}

function handleView(row: FileConfigItem) {
  message.info(`查看配置：${row.name || row.configName || row.id}`)
}

function handleEdit(row: FileConfigItem) {
  message.info(`编辑配置：${row.name || row.configName || row.id}`)
}

async function handleToggle(row: FileConfigItem) {
  const ok = await confirm({
    title: row.isEnabled ? '确认禁用配置' : '确认启用配置',
    content: `配置：${row.name || row.configName || row.id}`,
    type: row.isEnabled ? 'warning' : 'success',
    confirmText: row.isEnabled ? '禁用' : '启用'
  })

  if (!ok) return

  await toggleConfigStatus(row)

  message.success('状态更新成功')
}
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <div>
        <h2>配置管理</h2>
        <p>当前页面已接入 features/configs 骨架，后续继续迁移新增、编辑、详情、导入等能力。</p>
      </div>
    </div>

    <DTCard>
      <ConfigsToolbar
        v-model:keyword="keyword"
        v-model:status="status"
        :status-options="statusOptions"
        @search="loadConfigs"
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
  </div>
</template>