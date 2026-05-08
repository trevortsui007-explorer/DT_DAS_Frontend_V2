<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { DTCard } from '@/shared/components'
import { confirm, message } from '@/shared/composables'

import {
  TaskDetailDrawer,
  TaskFormModal,
  TasksTable,
  TasksToolbar,
  useTasksList
} from '@/features/tasks'

import {
  createTask,
  deleteTasks,
  updateTask,
  type CreateTaskPayload,
  type TaskItem,
  type UpdateTaskPayload
} from '@/api'

import type { TaskFormMode } from '@/features/tasks'

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

const formMode = ref<TaskFormMode>('create')
const currentTask = ref<TaskItem | null>(null)
const selectedTasks = ref<TaskItem[]>([])

onMounted(() => {
  loadTasks()
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

function handleExecute(row: TaskItem) {
  message.info(`执行任务功能后续接入：${row.taskName}`)
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
    currentTask.value = null

    await loadTasks()
  } finally {
    formLoading.value = false
  }
}

function handleFormOpenChange(value: boolean) {
  formOpen.value = value

  if (!value && !detailOpen.value) {
    currentTask.value = null
  }
}

function handleDetailOpenChange(value: boolean) {
  detailOpen.value = value

  if (!value && !formOpen.value) {
    currentTask.value = null
  }
}
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <div>
        <h2>任务管理</h2>
        <p>管理数据采集任务、执行周期、启用状态和后续执行入口。</p>
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
        @selection-change="handleSelectionChange"
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
  </div>
</template>