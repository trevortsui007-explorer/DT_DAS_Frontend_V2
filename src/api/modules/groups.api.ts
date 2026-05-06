import request from '@/api/request'

import type {
  ConfigGroupDetail,
  ConfigGroupItem,
  CreateGroupPayload,
  SetGroupStatusPayload,
  UpdateGroupPayload
} from '@/api/types/group.types'

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
  return request.patch('/api/file-configs/group/status', payload)
}

export function bindConfigsToGroup(
  groupId: number | string,
  ids: Array<number | string>
) {
  return request.post(`/api/file-configs/group/${groupId}/configs`, {
    ids
  })
}

export function removeConfigsFromGroup(
  groupId: number | string,
  ids: Array<number | string>
) {
  return request.delete(`/api/file-configs/group/${groupId}/configs`, {
    params: {
      ids
    }
  })
}