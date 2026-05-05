import { onBeforeUnmount, ref } from 'vue'

import {
  fetchExecutionStatus,
  type ExecutionStatusResult
} from '@/api'

export function useExecutionPolling() {
  const polling = ref(false)
  const currentStatus = ref<ExecutionStatusResult | null>(null)

  let timer: number | null = null

  function stopPolling() {
    polling.value = false

    if (timer) {
      window.clearInterval(timer)
      timer = null
    }
  }

  async function pollOnce(taskLogId: string) {
    currentStatus.value = await fetchExecutionStatus(taskLogId)

    const status = currentStatus.value.status

    if (status === 'Success' || status === 'Failed' || status === 'Cancelled') {
      stopPolling()
    }
  }

  function startPolling(taskLogId: string, interval = 2000) {
    stopPolling()

    polling.value = true

    pollOnce(taskLogId)

    timer = window.setInterval(() => {
      pollOnce(taskLogId)
    }, interval)
  }

  onBeforeUnmount(() => {
    stopPolling()
  })

  return {
    polling,
    currentStatus,
    startPolling,
    stopPolling,
    pollOnce
  }
}