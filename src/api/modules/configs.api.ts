import request from '@/api/request'

import type {
  CreateFileConfigPayload,
  FileConfigDetail,
  FileConfigItem,
  SetConfigStatusPayload,
  UpdateFileConfigPayload
} from '@/api/types/config.types'

export function fetchConfigs() {
  return request.get<FileConfigItem[]>('/api/file-configs', {
    params: {
      all: true
    }
  })
}

export function fetchConfigById(id: number | string) {
  return request.get<FileConfigDetail>(`/api/file-configs/${id}`)
}

export function createConfig(data: CreateFileConfigPayload) {
  return request.post('/api/file-configs', data)
}

export function updateConfig(id: number | string, data: UpdateFileConfigPayload) {
  return request.put(`/api/file-configs/${id}`, data)
}

export function setConfigStatus(payload: SetConfigStatusPayload) {
  return request.patch('/api/file-configs/status', payload)
}