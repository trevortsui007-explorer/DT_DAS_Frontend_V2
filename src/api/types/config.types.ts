export type FileConfigItem = {
  id: number
  name: string
  sourcePath: string
  targetTable: string
  isEnabled: boolean
  description?: string
  createTime?: string
  updateTime?: string
}

export type FileConfigColumn = {
  id?: number
  columnName: string
  sourceColumn?: string
  dataType?: string
  isRequired?: boolean
  sortOrder?: number
}

export type FileConfigDetail = FileConfigItem & {
  fileNamePattern?: string
  sheetName?: string
  startRow?: number
  columns?: FileConfigColumn[]
}

export type CreateFileConfigPayload = {
  name: string
  sourcePath: string
  targetTable: string
  isEnabled?: boolean
  description?: string
  fileNamePattern?: string
  sheetName?: string
  startRow?: number
  columns?: FileConfigColumn[]
}

export type UpdateFileConfigPayload = Partial<CreateFileConfigPayload>

export type SetConfigStatusPayload = {
  ids: Array<number | string>
  isEnabled: boolean
}