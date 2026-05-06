import type { AxiosRequestConfig } from 'axios'

const mockTaskList = [
  {
    id: 1,
    taskName: '每日 MES 数据采集任务',
    taskMode: '周期执行任务',
    cronExpression: '0 0 8 * * ?',
    isEnabled: 1,
    description: '每天 8 点执行 MES 文件采集。',
    createTime: '2026-04-20 08:00:00',
    updateTime: '2026-04-28 09:30:00'
  },
  {
    id: 2,
    taskName: 'WIP Lot 数据同步任务',
    taskMode: '周期执行任务',
    cronExpression: '0 0/30 * * * ?',
    isEnabled: 1,
    description: '每 30 分钟同步 WIP Lot 数据。',
    createTime: '2026-04-21 08:00:00',
    updateTime: '2026-04-28 10:15:00'
  },
  {
    id: 3,
    taskName: 'Scrap 手动采集任务',
    taskMode: '手动执行任务',
    cronExpression: '0 0 0 * * ?',
    isEnabled: 0,
    description: '用于手动触发 Scrap 数据采集。',
    createTime: '2026-04-22 08:00:00',
    updateTime: '2026-04-28 11:20:00'
  }
]

const mockTaskDetails = mockTaskList.map((item) => {
  return {
    ...item,
    groupIds: [1, 2],
    groupNames: ['电测自动配置组', '麦逊电测配置组_第二组']
  }
})

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
    const id = getIdFromUrl(url)

    if (id) {
      return mockTaskDetails.find((item) => String(item.id) === String(id)) || mockTaskDetails[0]
    }

    return mockTaskList
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