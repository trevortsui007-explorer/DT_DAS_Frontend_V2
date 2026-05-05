import type {
  FileConfigFieldMapping,
  FileConfigFieldMappingJson
} from '@/api'

export type FieldMappingRow = FileConfigFieldMapping & {
  id: string
}

function createRowId() {
  return `field-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createEmptyFieldMappingRow(): FieldMappingRow {
  return {
    id: createRowId(),
    sourceField: '',
    targetField: ''
  }
}

export function fieldMappingJsonToRows(
  mapping?: FileConfigFieldMappingJson
): FieldMappingRow[] {
  if (!mapping) {
    return [createEmptyFieldMappingRow()]
  }

  const rows = Object.entries(mapping).map(([sourceField, targetField]) => {
    return {
      id: createRowId(),
      sourceField,
      targetField
    }
  })

  return rows.length ? rows : [createEmptyFieldMappingRow()]
}

export function rowsToFieldMappingJson(
  rows: FieldMappingRow[]
): FileConfigFieldMappingJson {
  return rows.reduce<FileConfigFieldMappingJson>((result, row) => {
    const sourceField = row.sourceField.trim()
    const targetField = row.targetField.trim()

    if (sourceField && targetField) {
      result[sourceField] = targetField
    }

    return result
  }, {})
}

export function validateFieldMappingRows(rows: FieldMappingRow[]) {
  const errors: string[] = []
  const sourceSet = new Set<string>()
  const targetSet = new Set<string>()

  rows.forEach((row, index) => {
    const sourceField = row.sourceField.trim()
    const targetField = row.targetField.trim()

    if (!sourceField && !targetField) {
      return
    }

    if (!sourceField) {
      errors.push(`第 ${index + 1} 行：源字段不能为空`)
    }

    if (!targetField) {
      errors.push(`第 ${index + 1} 行：目标字段不能为空`)
    }

    if (sourceField) {
      if (sourceSet.has(sourceField)) {
        errors.push(`源字段重复：${sourceField}`)
      }

      sourceSet.add(sourceField)
    }

    if (targetField) {
      if (targetSet.has(targetField)) {
        errors.push(`目标字段重复：${targetField}`)
      }

      targetSet.add(targetField)
    }
  })

  return errors
}