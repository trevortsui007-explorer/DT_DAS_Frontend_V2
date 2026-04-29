import request from '@/api/request'

import type { PageResult } from '@/api/types/common.types'
import type {
  AcquisitionLogPayload,
  NextStartRowResult,
  TaskLogItem,
  TaskLogPayload,
  TaskLogQuery,
  UpdateTaskLogPayload
} from '@/api/types/log.types'

export function fetchNextStartRow(configId: number | string) {
  return request.get<NextStartRowResult>(`/api/data-acquisition/next-row/${configId}`)
}

export function createLog(data: AcquisitionLogPayload) {
  return request.post('/api/data-acquisition/log', data)
}

export function createTaskLog(data: TaskLogPayload) {
  return request.post('/api/data-acquisition/task-log', data)
}

export function updateTaskLog(id: number | string, data: UpdateTaskLogPayload) {
  return request.put(`/api/data-acquisition/task-log/${id}`, data)
}

export function fetchTaskLogs(params: TaskLogQuery = {}) {
  return request.get<PageResult<TaskLogItem>>('/api/data-acquisition/execution/task-logs', {
    params: {
      pageNo: params.pageNo ?? 1,
      pageSize: params.pageSize ?? 10,
      status: params.status || undefined,
      taskId: params.taskId || undefined,
      startTime: params.startTime || undefined,
      endTime: params.endTime || undefined
    }
  })
}