<script setup lang="ts">
import { onMounted } from 'vue'

import { deleteGroup, type ConfigGroupItem } from '@/api'

import { DTCard } from '@/shared/components'
import { confirm, message } from '@/shared/composables'

import {
  GroupsTable,
  GroupsToolbar,
  useGroupsList
} from '@/features/groups'

const {
  loading,
  keyword,
  status,
  statusOptions,
  filteredGroups,
  loadGroups,
  toggleGroupStatus,
  resetFilters
} = useGroupsList()

onMounted(() => {
  handleLoadGroups()
})

async function handleLoadGroups() {
  try {
    await loadGroups()
  } catch (error) {
    console.error(error)
    message.error('分组列表加载失败')
  }
}

function handleCreate() {
  message.info('新增分组功能将在 4.2 接入')
}

function handleView(row: ConfigGroupItem) {
  message.info(`查看分组：${row.groupName}`)
}

function handleEdit(row: ConfigGroupItem) {
  message.info(`编辑分组：${row.groupName}`)
}

async function handleToggle(row: ConfigGroupItem) {
  const ok = await confirm({
    title: row.isEnabled === 1 ? '确认禁用分组' : '确认启用分组',
    content: `分组：${row.groupName}`,
    type: row.isEnabled === 1 ? 'warning' : 'success',
    confirmText: row.isEnabled === 1 ? '禁用' : '启用'
  })

  if (!ok) return

  try {
    await toggleGroupStatus(row)
    message.success('分组状态更新成功')
  } catch (error) {
    console.error(error)
    message.error('分组状态更新失败')
  }
}

async function handleDelete(row: ConfigGroupItem) {
  const ok = await confirm({
    title: '确认删除分组',
    content: `分组：${row.groupName}\n删除后不可恢复，是否继续？`,
    type: 'danger',
    confirmText: '删除'
  })

  if (!ok) return

  try {
    await deleteGroup(row.id)
    message.success('分组删除成功')
    await handleLoadGroups()
  } catch (error) {
    console.error(error)
    message.error('分组删除失败')
  }
}

function handleReset() {
  resetFilters()
  message.info('筛选条件已重置')
}
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <div>
        <h2>分组管理</h2>
        <p>用于管理采集配置分组，后续支持绑定配置、批量执行和任务关联。</p>
      </div>
    </div>

    <DTCard>
      <GroupsToolbar
        v-model:keyword="keyword"
        v-model:status="status"
        :status-options="statusOptions"
        @search="handleLoadGroups"
        @reset="handleReset"
        @refresh="handleLoadGroups"
        @create="handleCreate"
      />
    </DTCard>

    <DTCard>
      <GroupsTable
        :data="filteredGroups"
        :loading="loading"
        @view="handleView"
        @edit="handleEdit"
        @toggle="handleToggle"
        @delete="handleDelete"
      />
    </DTCard>
  </div>
</template>