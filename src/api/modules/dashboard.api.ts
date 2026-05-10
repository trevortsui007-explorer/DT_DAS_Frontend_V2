import request from '@/api/request'

import type {
  OverviewActivityItem,
  OverviewTrendItem
} from '@/api/types/dashboard.types'

export function fetchOverviewTrend() {
  return request.get<OverviewTrendItem[]>('/api/dashboard/trend', {
    mockValidate: Array.isArray
  })
}

export function fetchOverviewActivities() {
  return request.get<OverviewActivityItem[]>('/api/dashboard/activities', {
    mockValidate: Array.isArray
  })
}
