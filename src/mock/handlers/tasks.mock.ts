import type { AxiosRequestConfig } from 'axios'

export function mockTasks(config: AxiosRequestConfig) {
  const url = config.url || ''

  if (url.includes('/api/data-acquisition/tasks')) {
    return [
      {
        id: 1,
        taskName: '每日数据采集任务',
        isEnabled: true,
        cron: '0 0 8 * * ?'
      }
    ]
  }

  return null
}