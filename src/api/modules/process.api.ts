import request from '@/api/request'

import type { BulkImportPayload } from '@/api/types/process.types'

export function bulkImport(data: BulkImportPayload) {
  return request.post('/api/data-acquisition/bulk-import', data)
}

export function executeSproc(sproc: string, flag?: string) {
  return request.post('/api/data-acquisition/execute-post-process', null, {
    params: {
      sproc,
      flag
    }
  })
}