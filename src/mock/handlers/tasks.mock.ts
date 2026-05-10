import type { AxiosRequestConfig } from 'axios'

import { mockTasksData } from '../mockData'

const mockTaskDetails = mockTasksData.map((item) => ({
  ...item,
  groupIds: item.id === 1 ? [1, 2] : item.id === 4 ? [3] : [],
  groupNames: item.id === 1 ? ['电测自动配置组', '麦逊电测配置组_第二组'] : item.id === 4 ? ['组测试'] : []
}))

function getIdFromUrl(url: string) {
  const matched = url.match(/\/api\/data-acquisition\/tasks\/([^/?]+)/)

  return matched?.[1]
}

export function mockTasks(config: AxiosRequestConfig) {
  const url = config.url || ''
  const method = (config.method || 'get').toLowerCase()

  if (!url.includes('/api/data-acquisition/tasks')) {
    return null
  }

  if (method === 'get') {
    const modeMatched = url.match(/\/api\/data-acquisition\/tasks\/mode\/([^/?]+)/)

    if (modeMatched) {
      return mockTasksData.filter((item) => Number(item.taskMode) === Number(modeMatched[1]))
    }

    const id = getIdFromUrl(url)

    if (id) {
      return mockTaskDetails.find((item) => String(item.id) === String(id)) || mockTaskDetails[0]
    }

    return mockTasksData
  }

  if (method === 'post') {
    return {
      code: 1,
      info: '创建成功',
      data: true
    }
  }

  if (method === 'put') {
    return {
      code: 1,
      info: '保存成功',
      data: true
    }
  }

  if (method === 'patch' && url.includes('/api/data-acquisition/tasks/status')) {
    return {
      code: 1,
      info: '状态更新成功',
      data: true
    }
  }

  if (method === 'delete') {
    return {
      code: 1,
      info: '删除成功',
      data: true
    }
  }

  return null
}
