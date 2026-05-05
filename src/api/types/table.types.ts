export type AcquisitionTableColumn = {
  ColumnName: string
  DataType: string
  IsPrimaryKey?: boolean
  AllowNull?: boolean
  MaxLength?: number
}

export type CreateAcquisitionTablePayload = {
  TableName: string
  Columns: AcquisitionTableColumn[]
}

export type AcquisitionTableField = {
  ColumnName?: string
  DataType?: string
  IsPrimaryKey?: boolean
  AllowNull?: boolean
  MaxLength?: number
}

export type AcquisitionTableFieldsResult = AcquisitionTableField[]