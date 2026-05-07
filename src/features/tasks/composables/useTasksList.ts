import { computed, ref } from 'vue'

import {
  fetchTasks,
  setTaskStatus,
  type TaskItem
} from '@/api'

import type { DTSelectOption, DTSelectValue } from '@/shared/components'

import { getTaskModeText } from '../utils/task-mode'

export function useTasksList() {
  const loading = ref(false)
  const keyword = ref('')
  const status = ref<DTSelectValue | ''>('')
  const taskMode = ref<DTSelectValue | ''>('')

  const tasks = ref<TaskItem[]>([])

  const statusOptions: DTSelectOption[] = [
    {
      label: '全部状态',
      value: 'all'
    },
    {
      label: '启用',
      value: 'enabled'
    },
    {
      label: '禁用',
      value: 'disabled'
    }
  ]

  const taskModeOptions: DTSelectOption[] = [
    {
      label: '全部类型',
      value: 'all'
    },
    {
      label: '普通任务',
      value: 0
    },
    {
      label: '定时任务',
      value: 1
    }
  ]

  const filteredTasks = computed(() => {
    const keywordValue = keyword.value.trim().toLowerCase()

    return tasks.value.filter((item) => {
      const taskName = item.taskName.toLowerCase()
      const modeText = getTaskModeText(item.taskMode).toLowerCase()
      const cronExpression = item.cronExpression.toLowerCase()
      const description = String(item.description || '').toLowerCase()

      const keywordMatched =
        !keywordValue ||
        taskName.includes(keywordValue) ||
        modeText.includes(keywordValue) ||
        cronExpression.includes(keywordValue) ||
        description.includes(keywordValue)

      const statusMatched =
        status.value === '' ||
        status.value === 'all' ||
        (status.value === 'enabled' && Number(item.isEnabled) === 1) ||
        (status.value === 'disabled' && Number(item.isEnabled) === 0)

      const modeMatched =
        taskMode.value === '' ||
        taskMode.value === 'all' ||
        Number(taskMode.value) === Number(item.taskMode)

      return keywordMatched && statusMatched && modeMatched
    })
  })

  async function loadTasks() {
    loading.value = true

    try {
      tasks.value = await fetchTasks()
    } finally {
      loading.value = false
    }
  }

  async function toggleTaskStatus(row: TaskItem) {
    await setTaskStatus({
      ids: [row.id],
      isEnabled: Number(row.isEnabled) !== 1
    })

    await loadTasks()
  }

  function resetFilters() {
    keyword.value = ''
    status.value = ''
    taskMode.value = ''
  }

  return {
    loading,
    keyword,
    status,
    taskMode,
    statusOptions,
    taskModeOptions,
    tasks,
    filteredTasks,
    loadTasks,
    toggleTaskStatus,
    resetFilters
  }
}