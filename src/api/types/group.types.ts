export type ConfigGroupAssociatedConfig = {
  id: string
  eqName: string
}

export type ConfigGroupItem = {
  id: string
  groupName: string
  groupCategory: string
  groupType: string
  isEnabled: 0 | 1
  configCount: number
  associatedConfigs: ConfigGroupAssociatedConfig[]
}

export type ConfigGroupDetail = ConfigGroupItem & {
  configIds?: Array<number | string>
}

export type CreateGroupPayload = {
  groupName: string
  groupCategory: string
  groupType: string
  isEnabled?: 0 | 1
  configIds?: Array<number | string>
}

export type UpdateGroupPayload = Partial<CreateGroupPayload>

export type SetGroupStatusPayload = {
  ids: Array<number | string>
  isEnabled: 0 | 1
}