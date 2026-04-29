import request from '@/api/request'

import type {
  CreateFileConfigPayload,
  FileConfigDetail,
  FileConfigItem,
  FileConfigQuery,
  FileConfigStatusQuery,
  FileConfigStatusResult,
  SetConfigStatusPayload,
  UpdateFileConfigPayload
} from '@/api/types/config.types'

function normalizeIds(value?: Array<number | string> | string) {
  if (!value) return undefined
  return Array.isArray(value) ? value.join(',') : value
}

export function fetchConfigs() {
  return request.get<FileConfigItem[]>('/api/file-configs', {
    params: {
      all: true
    }
  })
}

export function fetchConfigsByQuery(query: FileConfigQuery = {}) {
  return request.get<FileConfigItem[]>('/api/file-configs', {
    params: {
      all: query.all,
      ids: normalizeIds(query.ids),
      groupIds: normalizeIds(query.groupIds),
      taskIds: normalizeIds(query.taskIds)
    }
  })
}

export function fetchConfigById(id: number | string) {
  return request.get<FileConfigDetail>(`/api/file-configs/${id}`)
}

export function fetchConfigStatus(query: FileConfigStatusQuery) {
  return request.get<FileConfigStatusResult>('/api/file-configs/status', {
    params: {
      ids: normalizeIds(query.ids)
    }
  })
}

export function createConfig(data: CreateFileConfigPayload) {
  return request.post('/api/file-configs', data)
}

export function updateConfig(id: number | string, data: UpdateFileConfigPayload) {
  return request.put(`/api/file-configs/${id}`, data)
}

export function setConfigStatus(payload: SetConfigStatusPayload) {
  const formData = new FormData()

  formData.append('ids', payload.ids.join(','))
  formData.append('isEnabled', String(payload.isEnabled))

  return request.patch('/api/file-configs/status', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}