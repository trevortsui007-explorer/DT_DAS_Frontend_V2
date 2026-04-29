export type ConfigGroupItem = {
  id?: number
  Id?: number

  groupName?: string
  name?: string

  GroupName?: string
  GroupCategory?: string
  GroupType?: string
  SortOrder?: number
  IsEnabled?: boolean | number

  description?: string
  isEnabled?: boolean
  createTime?: string
  updateTime?: string
}

export type ConfigGroupDetail = ConfigGroupItem & {
  configs?: number[]
}

export type CreateGroupPayload = Partial<ConfigGroupDetail>

export type UpdateGroupPayload = Partial<ConfigGroupDetail>

export type SetGroupStatusPayload = {
  ids: Array<number | string>
  isEnabled: boolean
}

export type GroupStatusQuery = {
  ids: Array<number | string> | string
}

export type GroupStatusResult = Record<string, boolean>