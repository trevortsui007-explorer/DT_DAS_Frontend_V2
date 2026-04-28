import type { AxiosRequestConfig } from 'axios'

export function mockDashboard(config: AxiosRequestConfig) {
  const url = config.url || ''

  if (url.includes('/api/dashboard/trend')) {
    return [
      { date: '2026-04-24', successCount: 42, failureCount: 1 },
      { date: '2026-04-25', successCount: 51, failureCount: 0 },
      { date: '2026-04-26', successCount: 48, failureCount: 2 }
    ]
  }

  if (url.includes('/api/dashboard/activities')) {
    return [
      {
        id: '1',
        title: '每日采集任务执行完成',
        status: 'Success',
        time: '2026-04-28 09:30:00'
      },
      {
        id: '2',
        title: '配置 22 手动触发执行中',
        status: 'Running',
        time: '2026-04-28 10:12:00'
      }
    ]
  }

  return null
}