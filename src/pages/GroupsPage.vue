<script setup lang="ts">
import { onMounted, ref } from 'vue'

import {
  createGroup,
  deleteGroup,
  updateGroup,
  type ConfigGroupAssociatedConfig,
  type ConfigGroupItem,
  type CreateGroupPayload,
  type UpdateGroupPayload
} from '@/api'

import { DTCard } from '@/shared/components'
import { confirm, message } from '@/shared/composables'

import {
  GroupFormModal,
  GroupsTable,
  GroupsToolbar,
  useGroupsList
} from '@/features/groups'

import type { GroupFormMode } from '@/features/groups'

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

const formOpen = ref(false)
const formLoading = ref(false)
const formMode = ref<GroupFormMode>('create')
const currentGroup = ref<ConfigGroupItem | null>(null)

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
  currentGroup.value = null
  formMode.value = 'create'
  formOpen.value = true
}

function handleView(row: ConfigGroupItem) {
  message.info(`查看分组：${row.groupName}`)
}

function handleEdit(row: ConfigGroupItem) {
  currentGroup.value = row
  formMode.value = 'edit'
  formOpen.value = true
}

async function handleToggle(row: ConfigGroupItem) {
  const enabled = row.isEnabled === 1

  const ok = await confirm({
    title: enabled ? '确认禁用分组' : '确认启用分组',
    content: `分组：${row.groupName}`,
    type: enabled ? 'warning' : 'success',
    confirmText: enabled ? '禁用' : '启用'
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

function handleSelectionChange(rows: ConfigGroupItem[]) {
  console.log('选中的分组：', rows)
}

function handleConfigView(payload: {
  group: ConfigGroupItem
  config: ConfigGroupAssociatedConfig
}) {
  message.info(`查看配置：${payload.config.eqName}`)
}

function handleConfigToggle(payload: {
  group: ConfigGroupItem
  config: ConfigGroupAssociatedConfig
}) {
  message.info(`切换配置状态：${payload.config.eqName}`)
}

function handleReset() {
  resetFilters()
  message.info('筛选条件已重置')
}

async function handleSubmitGroup(payload: CreateGroupPayload | UpdateGroupPayload) {
  formLoading.value = true

  try {
    if (formMode.value === 'create') {
      await createGroup(payload as CreateGroupPayload)
      message.success('分组创建成功')
    } else {
      if (!currentGroup.value) {
        message.error('未选择要编辑的分组')
        return
      }

      await updateGroup(currentGroup.value.id, payload as UpdateGroupPayload)
      message.success('分组保存成功')
    }

    formOpen.value = false
    currentGroup.value = null

    await handleLoadGroups()
  } catch (error) {
    console.error(error)
    message.error(formMode.value === 'create' ? '分组创建失败' : '分组保存失败')
  } finally {
    formLoading.value = false
  }
}

function handleFormOpenChange(value: boolean) {
  formOpen.value = value

  if (!value) {
    currentGroup.value = null
  }
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
        @selection-change="handleSelectionChange"
        @config-view="handleConfigView"
        @config-toggle="handleConfigToggle"
      />
    </DTCard>

    <GroupFormModal
      :open="formOpen"
      :mode="formMode"
      :group="currentGroup"
      :loading="formLoading"
      @update:open="handleFormOpenChange"
      @submit="handleSubmitGroup"
    />
  </div>
</template>