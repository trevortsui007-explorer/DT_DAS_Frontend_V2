export type FileConfigItem = {
  id: number
  name: string
  sourcePath: string
  targetTable: string
  fileType?: string
  isEnabled: boolean
  description?: string
  createTime?: string
  updateTime?: string
}

export type FileConfigFieldMapping = {
  sourceField: string
  targetField: string
}

export type FileConfigDetail = FileConfigItem & {
  fileNamePattern?: string
  headerRow?: number
  startRow?: number
  fieldMappings?: FileConfigFieldMapping[]
  extFields?: Record<string, unknown> | null

  postProcessingType?: number
  postTableName?: string
  procedureName?: string
  serviceName?: string
  flag?: string
  flagName?: string
}

export type CreateFileConfigPayload = {
  name: string
  sourcePath: string
  targetTable: string
  fileNamePattern?: string
  fileType?: string
  headerRow?: number
  startRow?: number
  isEnabled?: boolean
  description?: string

  postProcessingType?: number
  postTableName?: string
  procedureName?: string
  serviceName?: string
  flag?: string
  flagName?: string
}

export type UpdateFileConfigPayload = Partial<CreateFileConfigPayload>

export type SetConfigStatusPayload = {
  ids: Array<number | string>
  isEnabled: boolean
}