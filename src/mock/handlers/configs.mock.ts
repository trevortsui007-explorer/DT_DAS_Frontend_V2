import type { AxiosRequestConfig } from 'axios'

const mockConfigList = [
  {
    id: 22,
    name: 'MES 数据采集配置',
    sourcePath: '\\\\server\\mes\\data',
    targetTable: 'DA_MES_Data',
    isEnabled: true,
    description: '每日采集 MES 文件数据',
    createTime: '2026-04-20 08:00:00',
    updateTime: '2026-04-28 09:30:00'
  },
  {
    id: 23,
    name: 'WIP Lot 数据配置',
    sourcePath: '\\\\server\\wip\\lot',
    targetTable: 'QA_UBWipLot',
    isEnabled: true,
    description: 'WIP Lot 数据同步',
    createTime: '2026-04-21 08:00:00',
    updateTime: '2026-04-28 10:15:00'
  },
  {
    id: 24,
    name: 'Scrap 数据配置',
    sourcePath: '\\\\server\\scrap',
    targetTable: 'DA_Scrap_Data',
    isEnabled: false,
    description: '报废数据采集配置',
    createTime: '2026-04-22 08:00:00',
    updateTime: '2026-04-28 11:20:00'
  }
]

export function mockConfigs(config: AxiosRequestConfig) {
  const url = config.url || ''
  const method = (config.method || 'get').toLowerCase()

  if (!url.includes('/api/file-configs')) {
    return null
  }

  if (method === 'get') {
    return mockConfigList
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

  if (method === 'patch' && url.includes('/api/file-configs/status')) {
    return {
      code: 1,
      info: '状态更新成功',
      data: true
    }
  }

  return null
}