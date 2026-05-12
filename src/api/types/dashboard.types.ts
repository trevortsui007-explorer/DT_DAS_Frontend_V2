export type OverviewTrendItem = {
  date: string
  successCount: number
  failureCount: number
  runningCount?: number
}

export type OverviewActivityItem = {
  id: string
  title: string
  status: string
  time: string
  message?: string
  taskCode?: string
  triggerType?: string
}

export type OverviewStats = {
  totalTasks?: number
  successRate?: number
  runningCount?: number
  failedCount?: number
  todayTasks?: number
  abnormalCount?: number
}
