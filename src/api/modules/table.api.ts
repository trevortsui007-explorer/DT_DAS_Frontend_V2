import request from '@/api/request'

import type {
  AcquisitionTableFieldsResult,
  CreateAcquisitionTablePayload
} from '@/api/types/table.types'

export function createAcquisitionTable(data: CreateAcquisitionTablePayload) {
  return request.post('/api/data-acquisition/create-table', data)
}

export function fetchAcquisitionTableFields(tableName: string) {
  return request.get<AcquisitionTableFieldsResult>(`/api/data-acquisition/fields/${tableName}`)
}

export function checkTableExists(tableName: string) {
  return request.get<boolean>('/api/table/check', {
    params: {
      tableName
    }
  })
}

export function getTableSchema(tableName: string) {
  return request.get('/api/table/schema', {
    params: {
      tableName
    }
  })
}

export function createTable(tableName: string, columns: unknown[]) {
  return request.post('/api/table/create', {
    tableName,
    columns
  })
}