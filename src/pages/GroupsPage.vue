<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import {
  createGroup,
  deleteGroup,
  setGroupStatus,
  updateGroup,
  type ConfigGroupAssociatedConfig,
  type ConfigGroupItem,
  type CreateGroupPayload,
  type FileConfigItem,
  type UpdateGroupPayload
} from '@/api'

import { DTButton, DTCard, DTTag } from '@/shared/components'
import { confirm, message } from '@/shared/composables'

import {
  GroupBindConfigsDrawer,
  GroupDetailDrawer,
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

const detailOpen = ref(false)
const formOpen = ref(false)
const formLoading = ref(false)
const bindOpen = ref(false)
const batchLoading = ref(false)

const formMode = ref<GroupFormMode>('create')
const currentGroup = ref<ConfigGroupItem | null>(null)
const selectedGroups = ref<ConfigGroupItem[]>([])

const selectedCount = computed(() => {
  return selectedGroups.value.length
})

const selectedNames = computed(() => {
  return selectedGroups.value.map((group) => group.groupName).join('、')
})

onMounted(() => {
  handleLoadGroups()
})

function handleBind(row: ConfigGroupItem) {
  currentGroup.value = row
  bindOpen.value = true
}

function handleBindOpenChange(value: boolean) {
  bindOpen.value = value

  if (!value && !detailOpen.value && !formOpen.value) {
    currentGroup.value = null
  }
}

async function handleBindSuccess() {
  await handleLoadGroups()

  if (currentGroup.value) {
    const latest = filteredGroups.value.find((group) => {
      return group.id === currentGroup.value?.id
    })

    if (latest) {
      currentGroup.value = latest
    }
  }
}

async function handleLoadGroups() {
  try {
    await loadGroups()
    selectedGroups.value = []
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
  currentGroup.value = row
  detailOpen.value = true
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
  selectedGroups.value = rows
}

function handleConfigView(payload: {
  group: ConfigGroupItem
  config: ConfigGroupAssociatedConfig
}) {
  message.info(`查看配置：${payload.config.eqName}`)
}

function handleBindConfigView(config: FileConfigItem | ConfigGroupAssociatedConfig) {
  const name = 'eqName' in config
    ? config.eqName
    : config.name

  message.info(`查看配置：${name}`)
}

function handleConfigToggle(payload: {
  group: ConfigGroupItem
  config: ConfigGroupAssociatedConfig
}) {
  message.info(`切换配置状态：${payload.config.eqName}`)
}

function handleReset() {
  resetFilters()
  selectedGroups.value = []
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

  if (!value && !detailOpen.value && !bindOpen.value) {
    currentGroup.value = null
  }
}

function handleDetailOpenChange(value: boolean) {
  detailOpen.value = value

  if (!value && !formOpen.value && !bindOpen.value) {
    currentGroup.value = null
  }
}

async function handleBatchSetStatus(isEnabled: 0 | 1) {
  if (!selectedGroups.value.length) {
    message.warning('请先选择分组')
    return
  }

  const actionText = isEnabled === 1 ? '启用' : '禁用'

  const ok = await confirm({
    title: `确认批量${actionText}分组`,
    content: `已选择 ${selectedGroups.value.length} 个分组：\n${selectedNames.value}`,
    type: isEnabled === 1 ? 'success' : 'warning',
    confirmText: actionText
  })

  if (!ok) return

  batchLoading.value = true

  try {
    await setGroupStatus({
      ids: selectedGroups.value.map((group) => group.id),
      isEnabled
    })

    message.success(`批量${actionText}成功`)
    await handleLoadGroups()
  } catch (error) {
    console.error(error)
    message.error(`批量${actionText}失败`)
  } finally {
    batchLoading.value = false
  }
}

function handleBatchEnable() {
  return handleBatchSetStatus(1)
}

function handleBatchDisable() {
  return handleBatchSetStatus(0)
}

async function handleBatchDelete() {
  if (!selectedGroups.value.length) {
    message.warning('请先选择分组')
    return
  }

  const ok = await confirm({
    title: '确认批量删除分组',
    content: `已选择 ${selectedGroups.value.length} 个分组：\n${selectedNames.value}\n删除后不可恢复，是否继续？`,
    type: 'danger',
    confirmText: '删除'
  })

  if (!ok) return

  batchLoading.value = true

  try {
    await Promise.all(
      selectedGroups.value.map((group) => {
        return deleteGroup(group.id)
      })
    )

    message.success('批量删除成功')
    await handleLoadGroups()
  } catch (error) {
    console.error(error)
    message.error('批量删除失败')
  } finally {
    batchLoading.value = false
  }
}
</script>

<template>
  <div class="page">

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

    <DTCard v-if="selectedCount">
      <div class="batch-bar">
        <div class="batch-bar__info">
          <span>已选择</span>
          <DTTag type="primary">
            {{ selectedCount }}
          </DTTag>
          <span>个分组</span>
        </div>

        <div class="batch-bar__actions">
          <DTButton
            type="success"
            :loading="batchLoading"
            @click="handleBatchEnable"
          >
            批量启用
          </DTButton>

          <DTButton
            type="warning"
            :loading="batchLoading"
            @click="handleBatchDisable"
          >
            批量禁用
          </DTButton>

          <DTButton
            type="danger"
            :loading="batchLoading"
            @click="handleBatchDelete"
          >
            批量删除
          </DTButton>
        </div>
      </div>
    </DTCard>

    <DTCard>
      <GroupsTable
        :data="filteredGroups"
        :loading="loading || batchLoading"
        @view="handleView"
        @edit="handleEdit"
        @toggle="handleToggle"
        @delete="handleDelete"
        @selection-change="handleSelectionChange"
        @config-view="handleConfigView"
        @config-toggle="handleConfigToggle"
        @bind="handleBind"
      />
    </DTCard>

    <GroupDetailDrawer
      :open="detailOpen"
      :group="currentGroup"
      @update:open="handleDetailOpenChange"
      @edit="handleEdit"
      @config-view="handleConfigView"
    />

    <GroupFormModal
      :open="formOpen"
      :mode="formMode"
      :group="currentGroup"
      :loading="formLoading"
      @update:open="handleFormOpenChange"
      @submit="handleSubmitGroup"
    />

    <GroupBindConfigsDrawer
      :open="bindOpen"
      :group="currentGroup"
      @update:open="handleBindOpenChange"
      @success="handleBindSuccess"
      @config-view="handleBindConfigView"
    />
  </div>
</template>

<style scoped lang="scss">
.batch-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-3);
  align-items: center;
  justify-content: space-between;
}

.batch-bar__info {
  display: inline-flex;
  gap: var(--dt-space-2);
  align-items: center;
  color: var(--dt-text-secondary);
  font-size: 14px;
}

.batch-bar__actions {
  display: inline-flex;
  gap: var(--dt-space-2);
  align-items: center;
}
</style>