import request from '@/api/request'

import type {
  CheckFileExistsQuery,
  FileInspectionQuery,
  FileInspectionResult,
  FileItem,
  FilePreviewResult,
  ListFilesQuery,
  PreviewFileQuery
} from '@/api/types/file.types'

export function listFiles(params: ListFilesQuery = {}) {
  return request.get<FileItem[]>('/api/files/list', {
    params
  })
}

export function checkFileExists(path: string) {
  const params: CheckFileExistsQuery = {
    path
  }

  return request.get<boolean>('/api/files/exists', {
    params
  })
}

export function previewFile(path: string, top = 10) {
  const params: PreviewFileQuery = {
    path,
    top
  }

  return request.get<FilePreviewResult>('/api/files/preview', {
    params
  })
}

export function fetchInspection(params: FileInspectionQuery) {
  return request.get<FileInspectionResult>('/api/files/discovery', {
    params
  })
}