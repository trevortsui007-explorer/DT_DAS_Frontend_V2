import type { DateRangeQuery, PageQuery } from './common.types'
import type { ExecutionStatus } from './execution.types'

export type TaskLogQuery = PageQuery &
  DateRangeQuery & {
    status?: ExecutionStatus
    taskId?: number
  }

export type TaskLogItem = {
  taskLogId?: string
  id?: string
  taskId?: number
  taskCode?: string
  triggerType?: string
  startTime?: string
  endTime?: string
  status?: ExecutionStatus
  totalConfigs?: number
  successCount?: number
  failureCount?: number
  processedCount?: number
  progress?: number
  message?: string
}

export type AcquisitionLogPayload = {
  TaskLogId?: string
  ConfigId?: number
  FileName?: string
  StartRow?: number
  ProcessedRows?: number
  StartTime?: string
  EndTime?: string | null
  Status?: string
  ErrorMessage?: string | null
}

export type TaskLogPayload = {
  TaskId?: number
  StartTime?: string
  EndTime?: string | null
  Status?: string
  TotalConfigs?: number
  SuccessCount?: number
  FailureCount?: number
  ProcessedCount?: number
  Progress?: number
  Message?: string
}

export type UpdateTaskLogPayload = Partial<TaskLogPayload>

export type NextStartRowResult = number