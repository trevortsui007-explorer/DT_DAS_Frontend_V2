export type TaskMode = number | string

export type TaskItem = {
  id?: number
  Id?: number

  taskName?: string
  name?: string

  TaskName?: string
  TaskMode?: number
  CronExpression?: string
  IsEnabled?: boolean | number
  Description?: string

  cron?: string
  cronExpression?: string
  description?: string
  isEnabled?: boolean
  createTime?: string
  updateTime?: string
}

export type TaskDetail = TaskItem & {
  groupIds?: number[]
}

export type CreateTaskPayload = Partial<TaskDetail>

export type UpdateTaskPayload = Partial<TaskDetail>

export type SetTaskStatusPayload = {
  ids: Array<number | string>
  isEnabled: boolean
}