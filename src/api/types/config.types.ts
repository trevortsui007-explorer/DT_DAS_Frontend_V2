export type FileConfigQuery = {
  all?: boolean
  ids?: Array<number | string> | string
  groupIds?: Array<number | string> | string
  taskIds?: Array<number | string> | string
}

export type FileConfigStatusQuery = {
  ids: Array<number | string> | string
}

export type FileConfigStatusResult = Record<string, boolean>

export type FileConfigItem = {
  id?: number
  Id?: number

  configName?: string
  name?: string

  EqName?: string
  TableName?: string
  FilePathPattern?: string
  FileNamePattern?: string
  FileType?: string
  HeaderRow?: number
  StartRow?: number
  IsEnabled?: boolean | number
  FieldMappings?: string
  PostProcessingType?: number
  ProcedureName?: string
  ServiceName?: string
  ExtFields?: string

  filePath?: string
  sourcePath?: string
  targetTable?: string
  isEnabled?: boolean
  description?: string
  createTime?: string
  updateTime?: string
}

export type FileConfigDetail = FileConfigItem & {
  columns?: FileConfigColumn[]
}

export type FileConfigColumn = {
  columnName?: string
  sourceColumn?: string
  dataType?: string
  isRequired?: boolean
}

export type CreateFileConfigPayload = Partial<FileConfigDetail>

export type UpdateFileConfigPayload = Partial<FileConfigDetail>

export type SetConfigStatusPayload = {
  ids: Array<number | string>
  isEnabled: boolean
}