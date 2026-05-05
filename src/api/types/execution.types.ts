export type ExecutionStatus =
  | 'Pending'
  | 'Running'
  | 'Success'
  | 'Failed'
  | 'Cancelled'
  | 'Completed'
  | string

export type StartExecutionByIdsPayload = {
  ids?: Array<number | string>
  groupIds?: Array<number | string>
  taskIds?: Array<number | string>
  processDate?: string
}

export type StartExecutionByRangePayload = {
  id: number | string
  startDate?: string
  endDate?: string
}

export type StartExecutionConfigsRangePayload = {
  ids?: Array<number | string>
  groupIds?: Array<number | string>
  taskIds?: Array<number | string>
  tableName?: string
  databaseName?: string
  startDate?: string
  endDate?: string
}

export type ExecutionStatusResult = {
  taskLogId: string
  status: ExecutionStatus
  progress?: number
  message?: string
  startTime?: string
  endTime?: string
}

export type ExecutionDetailItem = {
  id?: string | number
  configId?: number
  configName?: string
  status?: ExecutionStatus
  message?: string
  startTime?: string
  endTime?: string
}