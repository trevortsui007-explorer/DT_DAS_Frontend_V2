import request from '@/api/request'

export type OverviewTrendItem = {
  date: string
  successCount: number
  failureCount: number
}

export type OverviewActivityItem = {
  id: string
  title: string
  status: 'Success' | 'Failed' | 'Running' | 'Pending'
  time: string
}

export function fetchOverviewTrend() {
  return request.get<OverviewTrendItem[]>('/api/dashboard/trend')
}

export function fetchOverviewActivities() {
  return request.get<OverviewActivityItem[]>('/api/dashboard/activities')
}