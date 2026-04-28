import request from '@/api/request'

export type TaskLogStatus = 'Pending' | 'Running' | 'Success' | 'Failed' | 'Cancelled'

export type TaskLogQuery = {
  pageNo?: number
  pageSize?: number
  status?: TaskLogStatus
  taskId?: number
  startTime?: string
  endTime?: string
}

export type TaskLogItem = {
  taskLogId: string
  taskId: number
  startTime: string
  endTime?: string
  status: TaskLogStatus
  progress: number
  message?: string
}

export type PageResult<T> = {
  items: T[]
  total: number
  pageNo: number
  pageSize: number
}

export function fetchTaskLogs(params: TaskLogQuery = {}) {
  return request.get<PageResult<TaskLogItem>>('/api/data-acquisition/execution/task-logs', {
    params: {
      pageNo: params.pageNo ?? 1,
      pageSize: params.pageSize ?? 10,
      status: params.status,
      taskId: params.taskId,
      startTime: params.startTime,
      endTime: params.endTime
    }
  })
}

export function fetchTaskLogStatus(taskLogId: string) {
  return request.get(`/api/data-acquisition/execution/${taskLogId}/status`)
}

export function fetchTaskLogDetails(taskLogId: string) {
  return request.get(`/api/data-acquisition/execution/${taskLogId}/details`)
}