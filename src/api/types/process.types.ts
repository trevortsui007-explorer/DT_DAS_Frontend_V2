export type BulkImportRow = Record<string, unknown>

export type BulkImportPayload = {
  TableName?: string
  Data?: BulkImportRow[]
  Flag?: string
  PostProcessSproc?: string | null
}

export type ExecuteSprocPayload = {
  sproc: string
  flag?: string
}