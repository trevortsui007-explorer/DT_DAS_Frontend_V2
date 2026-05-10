import { ref } from 'vue'

import {
  fetchTaskLogs,
  fetchTasks,
  type PageResult,
  type TaskItem,
  type TaskLogItem,
  type TaskLogQuery
} from '@/api'

import type { DTSelectOption, DTSelectValue } from '@/shared/components'

export function useTaskLogsList() {
  const loading = ref(false)

  const pageNo = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  const status = ref<DTSelectValue | ''>('')
  const taskId = ref<DTSelectValue | ''>('')
  const startTime = ref('')
  const endTime = ref('')

  const logs = ref<TaskLogItem[]>([])
  const taskOptions = ref<DTSelectOption[]>([])

  const statusOptions: DTSelectOption[] = [
    { label: '全部状态', value: 'all' },
    { label: '运行中', value: 'Running' },
    { label: '成功', value: 'Success' },
    { label: '失败', value: 'Failed' },
    { label: '等待中', value: 'Pending' }
  ]

  function getTaskId(row: TaskItem) {
    return row.id ?? row.Id
  }

  function getTaskName(row: TaskItem) {
    return row.name || row.taskName || row.TaskName || `任务 ${getTaskId(row)}`
  }

  function buildQuery(): TaskLogQuery {
    return {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: status.value && status.value !== 'all'
        ? String(status.value)
        : undefined,
      taskId: taskId.value !== '' && taskId.value !== 'all'
        ? Number(taskId.value)
        : undefined,
      startTime: startTime.value || undefined,
      endTime: endTime.value || undefined
    }
  }

  async function loadTaskOptions() {
    const result = await fetchTasks()

    taskOptions.value = [
      { label: '全部任务', value: 'all' },
      { label: '手动执行', value: 0 },
      ...result
        .filter((item) => getTaskId(item) !== undefined)
        .map((item) => ({
          label: getTaskName(item),
          value: Number(getTaskId(item))
        }))
    ]
  }

  async function loadTaskLogs() {
    loading.value = true

    try {
      if (taskOptions.value.length === 0) {
        await loadTaskOptions()
      }

      const result: PageResult<TaskLogItem> = await fetchTaskLogs(buildQuery())

      logs.value = result.items
      total.value = result.total
      pageNo.value = result.pageNo
      pageSize.value = result.pageSize
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(payload: { page: number; pageSize: number }) {
    pageNo.value = payload.page
    pageSize.value = payload.pageSize

    return loadTaskLogs()
  }

  function handleSearch() {
    pageNo.value = 1

    return loadTaskLogs()
  }

  function handleReset() {
    status.value = ''
    taskId.value = ''
    startTime.value = ''
    endTime.value = ''
    pageNo.value = 1

    return loadTaskLogs()
  }

  return {
    loading,
    pageNo,
    pageSize,
    total,
    status,
    taskId,
    startTime,
    endTime,
    statusOptions,
    taskOptions,
    logs,
    loadTaskLogs,
    handleSearch,
    handleReset,
    handlePageChange
  }
}
