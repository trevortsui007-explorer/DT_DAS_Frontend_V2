import type { AxiosRequestConfig } from 'axios'

import { getTaskLogDetail, mockTaskLogsData } from '../mockData'

function getParam(config: AxiosRequestConfig, key: string) {
  const params = (config.params || {}) as Record<string, unknown>

  return params[key]
}

function normalizeDate(value: unknown) {
  if (!value) return ''

  return String(value).replace('T', ' ')
}

export function mockLogs(config: AxiosRequestConfig) {
  const url = config.url || ''

  const detailMatch = url.match(/\/api\/data-acquisition\/execution\/task-logs\/([^/?]+)/)
  if (detailMatch) {
    return getTaskLogDetail(decodeURIComponent(detailMatch[1]))
  }

  if (url.includes('/api/data-acquisition/execution/task-logs')) {
    const pageNo = Number(getParam(config, 'pageNo') || 1)
    const pageSize = Number(getParam(config, 'pageSize') || 10)
    const status = String(getParam(config, 'status') || '')
    const taskId = getParam(config, 'taskId')
    const startTime = normalizeDate(getParam(config, 'startTime'))
    const endTime = normalizeDate(getParam(config, 'endTime'))

    const filtered = mockTaskLogsData
      .filter((item) => {
        if (status && item.status !== status) return false
        if (taskId !== undefined && taskId !== '' && Number(item.taskId) !== Number(taskId)) return false
        if (startTime && String(item.startTime || '') < startTime) return false
        if (endTime && String(item.startTime || '') > endTime) return false

        return true
      })
      .sort((a, b) => String(b.startTime).localeCompare(String(a.startTime)))

    const start = (pageNo - 1) * pageSize

    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      pageNo,
      pageSize
    }
  }

  return null
}
