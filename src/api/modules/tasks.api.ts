import request from '@/api/request'

import type {
  CreateTaskPayload,
  SetTaskStatusPayload,
  TaskDetail,
  TaskItem,
  TaskMode,
  UpdateTaskPayload
} from '@/api/types/task.types'

export function fetchTasks() {
  return request.get<TaskItem[]>('/api/data-acquisition/tasks')
}

export function fetchTaskById(id: number | string) {
  return request.get<TaskDetail>(`/api/data-acquisition/tasks/${id}`)
}

export function fetchTasksByMode(mode: TaskMode) {
  return request.get<TaskItem[]>(`/api/data-acquisition/tasks/mode/${mode}`)
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
  return request.get(`/api/data-acquisition/tasks/${taskId}/groups`)
}

export function assignTaskGroups(taskId: number | string, ids: Array<number | string>) {
  return request.post(`/api/data-acquisition/tasks/${taskId}/groups`, null, {
    params: {
      ids: ids.join(',')
    }
  })
}