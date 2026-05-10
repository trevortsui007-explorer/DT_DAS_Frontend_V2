export type TaskMode = 0 | 1

export type TaskEnabledStatus = 0 | 1

export type TaskAssociatedGroup = {
  id: number
  groupName: string
  groupCategory: string
  groupType: string
  configCount: number
  isEnabled: TaskEnabledStatus
}

export type TaskItem = {
  id: number
  taskName: string
  taskMode: TaskMode
  cronExpression: string
  isEnabled: TaskEnabledStatus
  description?: string
  createTime?: string
  updateTime?: string
  groupCount: number
  associatedGroups: TaskAssociatedGroup[]
  groupIds: number[]
}

export type TaskDetail = TaskItem

export type CreateTaskPayload = {
  taskName: string
  taskMode: TaskMode
  cronExpression: string
  isEnabled: TaskEnabledStatus
  description?: string
  groupIds?: number[]
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>

export type SetTaskStatusPayload = {
  ids: Array<number | string>
  isEnabled: boolean
}

export type AssignTaskGroupsPayload = {
  taskId: number | string
  ids: Array<number | string>
}