import { ref } from 'vue'

import {
  fetchTaskLogs,
  type PageResult,
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
  const taskId = ref('')

  const logs = ref<TaskLogItem[]>([])

  const statusOptions: DTSelectOption[] = [
    {
      label: '全部状态',
      value: 'all'
    },
    {
      label: '运行中',
      value: 'Running'
    },
    {
      label: '成功',
      value: 'Success'
    },
    {
      label: '失败',
      value: 'Failed'
    },
    {
      label: '等待中',
      value: 'Pending'
    }
  ]

  function buildQuery(): TaskLogQuery {
    return {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: status.value && status.value !== 'all'
        ? String(status.value)
        : undefined,
      taskId: taskId.value
        ? Number(taskId.value)
        : undefined
    }
  }

  async function loadTaskLogs() {
    loading.value = true

    try {
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

  return {
    loading,
    pageNo,
    pageSize,
    total,
    status,
    taskId,
    statusOptions,
    logs,
    loadTaskLogs,
    handleSearch,
    handlePageChange
  }
}