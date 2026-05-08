import request from '@/api/request'

import type {
  ConfigGroupDetail,
  ConfigGroupItem,
  CreateGroupPayload,
  SetGroupStatusPayload,
  UpdateGroupPayload
} from '@/api/types/group.types'

function buildIdsQuery(ids: Array<number | string>) {
  const params = new URLSearchParams()

  ids.forEach((id) => {
    params.append('ids', String(id))
  })

  return params.toString()
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
  const idsQuery = buildIdsQuery(payload.ids)

  return request.patch(
    `/api/file-configs/group/status/?${idsQuery}&isEnabled=${payload.isEnabled}`
  )
}

export function bindConfigsToGroup(
  groupId: number | string,
  ids: Array<number | string>
) {
  const idsQuery = buildIdsQuery(ids)

  return request.post(`/api/file-configs/group/${groupId}/configs?${idsQuery}`)
}

export function removeConfigsFromGroup(
  groupId: number | string,
  ids: Array<number | string>
) {
  const idsQuery = buildIdsQuery(ids)

  return request.delete(`/api/file-configs/group/${groupId}/configs?${idsQuery}`)
}