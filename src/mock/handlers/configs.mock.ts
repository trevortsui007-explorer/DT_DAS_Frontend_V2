import type { AxiosRequestConfig } from 'axios'

export function mockConfigs(config: AxiosRequestConfig) {
  const url = config.url || ''

  if (url.includes('/api/file-configs')) {
    return [
      {
        id: 22,
        name: 'MES 数据采集配置',
        sourcePath: '\\\\server\\data',
        targetTable: 'DA_MES_Data',
        isEnabled: true
      }
    ]
  }

  return null
}