import request from '@/api/request'

import type {
  CreateFileConfigPayload,
  FileConfigDetail,
  FileConfigFieldMapping,
  FileConfigItem,
  SetConfigStatusPayload,
  UpdateFileConfigPayload
} from '@/api/types/config.types'

type RawFileConfigItem = {
  id: number
  eqName?: string
  tableName?: string
  filePathPattern?: string
  fileNamePattern?: string
  fileType?: string
  headerRow?: number
  startRow?: number
  fieldMappings?: string | Record<string, string> | FileConfigFieldMapping[]
  extFields?: Record<string, unknown> | null
  isEnabled: boolean
  postProcessingType?: number
  postTableName?: string
  procedureName?: string
  serviceName?: string
  flag?: string
  flagName?: string
  createTime?: string
  updateTime?: string
}

function parseFieldMappings(
  value: RawFileConfigItem['fieldMappings']
): FileConfigFieldMapping[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as Record<string, string>

      return Object.entries(parsed).map(([sourceField, targetField]) => ({
        sourceField,
        targetField
      }))
    } catch {
      return []
    }
  }

  return Object.entries(value).map(([sourceField, targetField]) => ({
    sourceField,
    targetField
  }))
}

function normalizeConfigItem(item: RawFileConfigItem): FileConfigItem {
  return {
    id: item.id,
    name: item.eqName || '',
    sourcePath: item.filePathPattern || '',
    targetTable: item.tableName || '',
    fileType: item.fileType,
    isEnabled: item.isEnabled,
    createTime: item.createTime,
    updateTime: item.updateTime
  }
}

function normalizeConfigDetail(item: RawFileConfigItem): FileConfigDetail {
  return {
    ...normalizeConfigItem(item),
    fileNamePattern: item.fileNamePattern,
    headerRow: item.headerRow,
    startRow: item.startRow,
    fieldMappings: parseFieldMappings(item.fieldMappings),
    extFields: item.extFields ?? null,
    postProcessingType: item.postProcessingType,
    postTableName: item.postTableName,
    procedureName: item.procedureName,
    serviceName: item.serviceName,
    flag: item.flag,
    flagName: item.flagName
  }
}

function normalizeCreatePayload(data: CreateFileConfigPayload) {
  return {
    eqName: data.name,
    filePathPattern: data.sourcePath,
    tableName: data.targetTable,
    fileNamePattern: data.fileNamePattern,
    fileType: data.fileType,
    headerRow: data.headerRow,
    startRow: data.startRow,
    isEnabled: data.isEnabled,
    postProcessingType: data.postProcessingType,
    postTableName: data.postTableName,
    procedureName: data.procedureName,
    serviceName: data.serviceName,
    flag: data.flag,
    flagName: data.flagName
  }
}

function normalizeUpdatePayload(data: UpdateFileConfigPayload) {
  return normalizeCreatePayload(data as CreateFileConfigPayload)
}

export async function fetchConfigs() {
  const result = await request.get<RawFileConfigItem[]>('/api/file-configs', {
    params: {
      all: true
    }
  })

  return result.map(normalizeConfigItem)
}

export async function fetchConfigById(id: number | string) {
  const result = await request.get<RawFileConfigItem>(`/api/file-configs/${id}`)

  return normalizeConfigDetail(result)
}

export function createConfig(data: CreateFileConfigPayload) {
  return request.post('/api/file-configs', normalizeCreatePayload(data))
}

export function updateConfig(id: number | string, data: UpdateFileConfigPayload) {
  return request.put(`/api/file-configs/${id}`, normalizeUpdatePayload(data))
}

export function setConfigStatus(payload: SetConfigStatusPayload) {
  return request.patch('/api/file-configs/status', payload)
}