import request from '@/api/request'

export type TaskItem = {
  id: number
  taskName: string
  isEnabled: boolean
  cron?: string
}

export function fetchTasks() {
  return request.get<TaskItem[]>('/api/data-acquisition/tasks')
}