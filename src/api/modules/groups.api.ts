import request from '@/api/request'

import type {
  ConfigGroupDetail,
  ConfigGroupItem,
  CreateGroupPayload,
  GroupStatusQuery,
  GroupStatusResult,
  SetGroupStatusPayload,
  UpdateGroupPayload
} from '@/api/types/group.types'

function normalizeIds(value?: Array<number | string> | string) {
  if (!value) return undefined
  return Array.isArray(value) ? value.join(',') : value
}

export function fetchGroups() {
  return request.get<ConfigGroupItem[]>('/api/file-configs/group')
}

export function fetchGroupById(id: number | string) {
  return request.get<ConfigGroupDetail>(`/api/file-configs/group/${id}`)
}

export function createGroup(data: CreateGroupPayload) {
  return request.post('/api/file-configs/group', data)
}

export function updateGroup(id: number | string, data: UpdateGroupPayload) {
  return request.put(`/api/file-configs/group/${id}`, data)
}

export function deleteGroup(id: number | string) {
  return request.delete(`/api/file-configs/group/${id}`)
}

export function setGroupStatus(payload: SetGroupStatusPayload) {
  const formData = new FormData()

  formData.append('ids', payload.ids.join(','))
  formData.append('isEnabled', String(payload.isEnabled))

  return request.patch('/api/file-configs/group/status/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function fetchGroupStatus(query: GroupStatusQuery) {
  return request.get<GroupStatusResult>('/api/file-configs/group/status/', {
    params: {
      ids: normalizeIds(query.ids)
    }
  })
}

export function bindConfigsToGroup(groupId: number | string, ids: Array<number | string>) {
  const params = new URLSearchParams()

  ids.forEach((id) => {
    params.append('ids', String(id))
  })

  return request.post(`/api/file-configs/group/${groupId}/configs`, null, {
    params
  })
}

export function removeConfigsFromGroup(groupId: number | string, ids: Array<number | string>) {
  const params = new URLSearchParams()

  ids.forEach((id) => {
    params.append('ids', String(id))
  })

  return request.delete(`/api/file-configs/group/${groupId}/configs`, {
    params
  })
}