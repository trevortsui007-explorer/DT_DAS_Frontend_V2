import type { AxiosRequestConfig } from 'axios'

export function mockLogs(config: AxiosRequestConfig) {
  const url = config.url || ''

  if (url.includes('/api/data-acquisition/execution/task-logs')) {
    return {
      items: [
        {
          taskLogId: '22D44448-D42B-41F4-940D-0090F4A11703',
          taskId: 0,
          startTime: '2026-04-23 17:29:06',
          endTime: '2026-04-23 17:29:08',
          status: 'Success',
          progress: 100,
          message: '任务完成'
        }
      ],
      total: 1,
      pageNo: 1,
      pageSize: 10
    }
  }

  return null
}