import type { AxiosRequestConfig } from 'axios'

export function mockConfigs(config: AxiosRequestConfig) {
  const url = config.url || ''

  if (url.includes('/api/file-configs')) {
    return [
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
  }

  return null
}