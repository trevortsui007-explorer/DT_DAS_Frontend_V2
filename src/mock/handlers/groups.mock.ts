import type { AxiosRequestConfig } from 'axios'

import { mockGroupsData } from '../mockData'

function getIds(config: AxiosRequestConfig) {
  const params = (config.params || {}) as Record<string, unknown>
  const raw = params.ids

  if (Array.isArray(raw)) {
    return raw.map((item) => Number(item))
  }

  if (raw instanceof URLSearchParams) {
    return raw.getAll('ids').map((item) => Number(item))
  }

  return String(raw || '')
    .split(',')
    .filter(Boolean)
    .map((item) => Number(item))
}

export function mockGroups(config: AxiosRequestConfig) {
  const url = config.url || ''

  if (!url.includes('/api/file-configs/group')) {
    return null
  }

  if (url.includes('/api/file-configs/group/status')) {
    const ids = getIds(config)

    return ids.reduce<Record<string, boolean>>((acc, id) => {
      const group = mockGroupsData.find((item) => Number(item.id) === id)

      acc[String(id)] = group?.isEnabled === 1
      return acc
    }, {})
  }

  const detailMatch = url.match(/\/api\/file-configs\/group\/([^/?]+)/)
  if (detailMatch && !url.includes('/configs')) {
    const id = Number(decodeURIComponent(detailMatch[1]))
    const group = mockGroupsData.find((item) => Number(item.id) === id)

    if (!group) return null

    return {
      ...group,
      configs: group.configIds || []
    }
  }

  return mockGroupsData
}
