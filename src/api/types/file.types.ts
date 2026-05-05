export type ListFilesQuery = {
  path?: string
  pattern?: string
  keyword?: string
  user?: string
  pass?: string
}

export type FileItem = {
  name: string
  path: string
  isDirectory?: boolean
  size?: number
  updateTime?: string
}

export type CheckFileExistsQuery = {
  path: string
}

export type PreviewFileQuery = {
  path: string
  top?: number
}

export type FilePreviewResult = {
  columns: string[]
  rows: Array<Record<string, unknown>>
}

export type FileInspectionQuery = {
  configId?: number
  startTime?: string
  endTime?: string
  user?: string
  pass?: string
}

export type FileInspectionResult = Record<string, unknown>