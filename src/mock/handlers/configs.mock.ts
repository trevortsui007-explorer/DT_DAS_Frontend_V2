import type { AxiosRequestConfig } from 'axios'

import { mockConfigsData } from '../mockData'

function getIdFromUrl(url: string) {
  const matched = url.match(/\/api\/file-configs\/([^/?]+)/)

  return matched?.[1]
}

function wrap<T>(data: T, info = '查询成功') {
  return {
    code: 1,
    info,
    data
  }
}

export function mockConfigs(config: AxiosRequestConfig) {
  const url = config.url || ''
  const method = (config.method || 'get').toLowerCase()

  if (!url.includes('/api/file-configs')) {
    return null
  }

  if (url.includes('/api/file-configs/group')) {
    return null
  }

  if (method === 'get') {
    const id = getIdFromUrl(url)

    if (id) {
      const detail =
        mockConfigsData.find((item) => String(item.id) === String(id)) ||
        mockConfigsData[0]

      return wrap(detail)
    }

    return wrap(mockConfigsData)
  }

  if (method === 'post') {
    return wrap(true, '创建成功')
  }

  if (method === 'put') {
    return wrap(true, '保存成功')
  }

  if (method === 'patch' && url.includes('/api/file-configs/status')) {
    return wrap(true, '状态更新成功')
  }

  return null
}
