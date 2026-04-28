import request from '@/api/request'

export type ConfigItem = {
  id: number
  name: string
  sourcePath: string
  targetTable: string
  isEnabled: boolean
}

export function fetchConfigs() {
  return request.get<ConfigItem[]>('/api/file-configs?all=true')
}