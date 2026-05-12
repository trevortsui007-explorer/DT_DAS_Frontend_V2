import type { AxiosRequestConfig } from 'axios'

import { buildDashboardActivities, buildDashboardTrend } from '../mockData'

export function mockDashboard(config: AxiosRequestConfig) {
  const url = config.url || ''

  if (url.includes('/api/dashboard/trend')) {
    return buildDashboardTrend()
  }

  if (url.includes('/api/dashboard/activities')) {
    return buildDashboardActivities()
  }

  return null
}
