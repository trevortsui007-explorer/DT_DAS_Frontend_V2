import request from '@/api/request'

import type {
  ExecutionDetailItem,
  ExecutionStatusResult,
  StartExecutionByIdsPayload,
  StartExecutionByRangePayload,
  StartExecutionConfigsRangePayload
} from '@/api/types/execution.types'

function appendIds(params: URLSearchParams, key: string, values?: Array<number | string>) {
  values?.forEach((value) => {
    params.append(key, String(value))
  })
}

export function fetchTaskLogStatus(taskLogId: string) {
  return request.get<ExecutionStatusResult>(`/api/data-acquisition/execution/${taskLogId}/status`)
}

export function fetchTaskLogDetails(taskLogId: string) {
  return request.get<ExecutionDetailItem[]>(`/api/data-acquisition/execution/${taskLogId}/details`)
}

export const fetchExecutionStatus = fetchTaskLogStatus

export const fetchExecutionDetails = fetchTaskLogDetails

export function executeById(id: number | string, processDate?: string) {
  return request.post(`/api/data-acquisition/execute-by-id/${id}`, null, {
    params: {
      processDate
    }
  })
}

export function executeManual(id: number | string, processDate?: string) {
  return request.post(`/api/data-acquisition/execute-manual/${id}`, null, {
    params: {
      processDate
    }
  })
}

export function executeByGroup(groupIds: Array<number | string>, processDate?: string) {
  return request.post('/api/data-acquisition/execute-by-groups', null, {
    params: {
      groupIds: groupIds.join(','),
      processDate
    }
  })
}

export function executeByRange(id: number | string, startDate?: string, endDate?: string) {
  return request.post(`/api/data-acquisition/execute-by-range/${id}`, null, {
    params: {
      startDate,
      endDate
    }
  })
}

export function executeConfigsRange(ids: Array<number | string>, startDate?: string, endDate?: string) {
  return request.post('/api/data-acquisition/execute-configs-range', null, {
    params: {
      ids: ids.join(','),
      startDate,
      endDate
    }
  })
}

export function startExecution(payload: StartExecutionByIdsPayload) {
  const params = new URLSearchParams()

  appendIds(params, 'ids', payload.ids)
  appendIds(params, 'groupIds', payload.groupIds)
  appendIds(params, 'taskIds', payload.taskIds)

  if (payload.processDate) {
    params.append('processDate', payload.processDate)
  }

  return request.post('/api/data-acquisition/execution/start/by-ids', null, {
    params
  })
}

export function startExecutionByIds(ids: Array<number | string>, processDate?: string) {
  return startExecution({
    ids,
    processDate
  })
}

export function startExecutionByGroups(groupIds: Array<number | string>, processDate?: string) {
  return startExecution({
    groupIds,
    processDate
  })
}

export function startExecutionByTasks(taskIds: Array<number | string>, processDate?: string) {
  return startExecution({
    taskIds,
    processDate
  })
}

export function startExecutionByRange(payload: StartExecutionByRangePayload) {
  return request.post(`/api/data-acquisition/execution/start/by-range/${payload.id}`, null, {
    params: {
      startDate: payload.startDate,
      endDate: payload.endDate
    }
  })
}

export function startExecutionConfigsRange(payload: StartExecutionConfigsRangePayload) {
  return request.post(
    '/api/data-acquisition/execution/start/configs-range',
    {
      ids: payload.ids,
      groupIds: payload.groupIds,
      taskIds: payload.taskIds,
      tableName: payload.tableName,
      databaseName: payload.databaseName
    },
    {
      params: {
        startDate: payload.startDate,
        endDate: payload.endDate
      }
    }
  )
}