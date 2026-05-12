<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { DTButton, DTCard } from '@/shared/components'
import { confirm, message } from '@/shared/composables'
import { deferInitialLoad } from '@/shared/utils/defer'

import {
  TaskBindGroupsDrawer,
  TaskDetailDrawer,
  TaskFormModal,
  TasksTable,
  TasksToolbar,
  useTasksList
} from '@/features/tasks'

import {
  createTask,
  deleteTasks,
  startExecutionByTasks,
  updateTask,
  type CreateTaskPayload,
  type TaskAssociatedGroup,
  type TaskItem,
  type TaskStartResponse,
  type UpdateTaskPayload
} from '@/api'

const {
  loading,
  keyword,
  status,
  taskMode,
  statusOptions,
  taskModeOptions,
  filteredTasks,
  loadTasks,
  toggleTaskStatus,
  resetFilters
} = useTasksList()

const detailOpen = ref(false)
const formOpen = ref(false)
const formLoading = ref(false)

const bindGroupsOpen = ref(false)
const bindGroupsLoading = ref(false)

const formMode = ref<'create' | 'edit'>('create')
const currentTask = ref<TaskItem | null>(null)
const selectedTasks = ref<TaskItem[]>([])

const executingTaskIds = ref<Array<number | string>>([])
const batchExecuting = ref(false)

onMounted(() => {
  deferInitialLoad(loadTasks)
})

function handleCreate() {
  currentTask.value = null
  formMode.value = 'create'
  formOpen.value = true
}

function handleView(row: TaskItem) {
  currentTask.value = row
  detailOpen.value = true
}

function handleEdit(row: TaskItem) {
  currentTask.value = row
  formMode.value = 'edit'
  formOpen.value = true
}

async function handleToggle(row: TaskItem) {
  const isEnabled = Number(row.isEnabled) === 1

  const ok = await confirm({
    title: isEnabled ? '确认禁用任务' : '确认启用任务',
    content: `任务：${row.taskName}`,
    type: isEnabled ? 'warning' : 'success',
    confirmText: isEnabled ? '禁用' : '启用'
  })

  if (!ok) return

  await toggleTaskStatus(row)

  message.success('状态更新成功')
}

async function handleDelete(row: TaskItem) {
  const ok = await confirm({
    title: '确认删除任务',
    content: `任务：${row.taskName}\n删除后不可恢复，是否继续？`,
    type: 'danger',
    confirmText: '删除'
  })

  if (!ok) return

  await deleteTasks([row.id])
  message.success('任务删除成功')

  await loadTasks()
}

function isTaskExecuting(row: TaskItem) {
  return executingTaskIds.value.includes(row.id)
}

function showExecutionSuccess(result?: TaskStartResponse) {
  if (result?.taskCode) {
    message.success(`任务已提交执行，任务编号：${result.taskCode}`)
    return
  }

  if (result?.taskLogId) {
    message.success(`任务已提交执行，日志ID：${result.taskLogId}`)
    return
  }

  message.success(result?.message || '任务已提交执行')
}

async function handleExecute(row: TaskItem) {
  if (isTaskExecuting(row)) return

  const ok = await confirm({
    title: '确认执行任务',
    content: `任务：${row.taskName}\n执行后系统将立即启动该采集任务，是否继续？`,
    type: 'primary',
    confirmText: '执行'
  })

  if (!ok) return

  executingTaskIds.value = [...executingTaskIds.value, row.id]

  try {
    const result = await startExecutionByTasks({
      taskIds: [row.id]
    })

    showExecutionSuccess(result)
  } finally {
    executingTaskIds.value = executingTaskIds.value.filter((id) => id !== row.id)
  }
}

async function handleBatchExecute() {
  if (!selectedTasks.value.length) {
    message.warning('请先选择要执行的任务')
    return
  }

  const ok = await confirm({
    title: '确认批量执行任务',
    content: `已选择 ${selectedTasks.value.length} 个任务，是否立即执行？`,
    type: 'primary',
    confirmText: '批量执行'
  })

  if (!ok) return

  batchExecuting.value = true

  try {
    const result = await startExecutionByTasks({
      taskIds: selectedTasks.value.map((item) => item.id)
    })

    showExecutionSuccess(result)
  } finally {
    batchExecuting.value = false
  }
}

function handleBindGroups(row: TaskItem) {
  currentTask.value = row
  bindGroupsOpen.value = true
}

function handleGroupView(payload: { task: TaskItem; group: TaskAssociatedGroup }) {
  message.info(`查看任务「${payload.task.taskName}」关联分组：${payload.group.groupName}`)
}

function handleReset() {
  resetFilters()
  message.info('筛选条件已重置')
}

function handleSelectionChange(rows: TaskItem[]) {
  selectedTasks.value = rows
}

async function handleSubmitTask(
  payload: CreateTaskPayload | UpdateTaskPayload
) {
  formLoading.value = true

  try {
    if (formMode.value === 'create') {
      await createTask(payload as CreateTaskPayload)
      message.success('任务创建成功')
    } else {
      if (!currentTask.value) {
        message.error('未选择要编辑的任务')
        return
      }

      await updateTask(currentTask.value.id, payload as UpdateTaskPayload)
      message.success('任务保存成功')
    }

    formOpen.value = false
    detailOpen.value = false
    bindGroupsOpen.value = false
    currentTask.value = null

    await loadTasks()
  } finally {
    formLoading.value = false
  }
}

async function handleBindGroupsSuccess() {
  message.success('任务配置组绑定成功')

  bindGroupsOpen.value = false
  detailOpen.value = false
  formOpen.value = false
  currentTask.value = null

  await loadTasks()
}

function handleFormOpenChange(value: boolean) {
  formOpen.value = value

  if (!value && !detailOpen.value && !bindGroupsOpen.value) {
    currentTask.value = null
  }
}

function handleDetailOpenChange(value: boolean) {
  detailOpen.value = value

  if (!value && !formOpen.value && !bindGroupsOpen.value) {
    currentTask.value = null
  }
}

function handleBindGroupsOpenChange(value: boolean) {
  bindGroupsOpen.value = value

  if (!value && !detailOpen.value && !formOpen.value) {
    currentTask.value = null
  }
}
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <div>
        <h2>任务管理</h2>
        <p>管理数据采集任务、执行周期、启用状态、关联分组和后续执行入口。</p>
      </div>

      <div class="page-toolbar__actions">
        <DTButton
          type="primary"
          :loading="batchExecuting"
          @click="handleBatchExecute"
        >
          批量执行
        </DTButton>
      </div>
    </div>

    <DTCard>
      <TasksToolbar
        v-model:keyword="keyword"
        v-model:status="status"
        v-model:task-mode="taskMode"
        :status-options="statusOptions"
        :task-mode-options="taskModeOptions"
        @search="loadTasks"
        @reset="handleReset"
        @refresh="loadTasks"
        @create="handleCreate"
      />
    </DTCard>

    <DTCard>
      <TasksTable
        :data="filteredTasks"
        :loading="loading"
        @view="handleView"
        @edit="handleEdit"
        @toggle="handleToggle"
        @delete="handleDelete"
        @execute="handleExecute"
        @bind-groups="handleBindGroups"
        @selection-change="handleSelectionChange"
        @group-view="handleGroupView"
      />
    </DTCard>

    <TaskDetailDrawer
      :open="detailOpen"
      :task="currentTask"
      @update:open="handleDetailOpenChange"
      @edit="handleEdit"
    />

    <TaskFormModal
      :open="formOpen"
      :mode="formMode"
      :task="currentTask"
      :loading="formLoading"
      @update:open="handleFormOpenChange"
      @submit="handleSubmitTask"
    />

    <TaskBindGroupsDrawer
      :open="bindGroupsOpen"
      :task="currentTask"
      :loading="bindGroupsLoading"
      @update:open="handleBindGroupsOpenChange"
      @success="handleBindGroupsSuccess"
    />
  </div>
</template>
