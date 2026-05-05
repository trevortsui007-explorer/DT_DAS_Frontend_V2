import { computed, ref } from 'vue'

import {
  fetchTasks,
  setTaskStatus,
  type TaskItem
} from '@/api'

export function useTasksList() {
  const loading = ref(false)
  const keyword = ref('')

  const tasks = ref<TaskItem[]>([])

  const filteredTasks = computed(() => {
    return tasks.value.filter((item) => {
      const name = item.name || item.taskName || ''

      return !keyword.value || name.includes(keyword.value)
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
    if (row.id === undefined || row.id === null) {
        return
    }

    await setTaskStatus({
        ids: [row.id],
        isEnabled: !row.isEnabled
    })

    await loadTasks()
  }

  return {
    loading,
    keyword,
    tasks,
    filteredTasks,
    loadTasks,
    toggleTaskStatus
  }
}