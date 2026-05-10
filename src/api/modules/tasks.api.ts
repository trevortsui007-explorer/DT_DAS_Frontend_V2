import request from '@/api/request'

import type {
  AssignTaskGroupsPayload,
  CreateTaskPayload,
  SetTaskStatusPayload,
  TaskDetail,
  TaskItem,
  TaskMode,
  UpdateTaskPayload
} from '@/api/types/task.types'

export function fetchTasks() {
  return request.get<TaskItem[]>('/api/data-acquisition/tasks', {
    mockValidate: Array.isArray
  })
}

export function fetchTasksByMode(mode: TaskMode) {
  return request.get<TaskItem[]>(`/api/data-acquisition/tasks/mode/${mode}`, {
    mockValidate: Array.isArray
  })
}

export function fetchTaskById(id: number | string) {
  return request.get<TaskDetail>(`/api/data-acquisition/tasks/${id}`, {
    mockValidate: (data) => {
      return Boolean(data && typeof data === 'object' && 'id' in data)
    }
  })
}

export function createTask(data: CreateTaskPayload) {
  return request.post('/api/data-acquisition/tasks', data)
}

export function updateTask(id: number | string, data: UpdateTaskPayload) {
  return request.put(`/api/data-acquisition/tasks/${id}`, data)
}

export function deleteTasks(ids: Array<number | string>) {
  return request.delete('/api/data-acquisition/tasks', {
    params: {
      ids: ids.join(',')
    }
  })
}

export function setTaskStatus(payload: SetTaskStatusPayload) {
  return request.patch('/api/data-acquisition/tasks/status', null, {
    params: {
      ids: payload.ids.join(','),
      isEnabled: payload.isEnabled
    }
  })
}

export function fetchTaskGroups(taskId: number | string) {
  return request.get<number[]>(`/api/data-acquisition/tasks/${taskId}/groups`)
}

export function assignTaskGroups(payload: AssignTaskGroupsPayload) {
  return request.post(`/api/data-acquisition/tasks/${payload.taskId}/groups`, null, {
    params: {
      ids: payload.ids.join(',')
    }
  })
}
