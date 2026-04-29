export type ApiResponse<T = unknown> = {
  code?: number
  info?: string
  data: T
}

export type PageQuery = {
  pageNo?: number
  pageSize?: number
}

export type PageResult<T> = {
  items: T[]
  total: number
  pageNo: number
  pageSize: number
}

export type IdValue = string | number

export type EnabledStatus = boolean

export type DateRangeQuery = {
  startTime?: string
  endTime?: string
}

export type ProcessDateQuery = {
  processDate?: string
}