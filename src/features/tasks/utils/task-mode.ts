import type { TaskMode } from '@/api'

export function getTaskModeText(mode: TaskMode | number | string) {
  const value = Number(mode)

  if (value === 0) return '普通任务'
  if (value === 1) return '定时任务'

  return '未知任务'
}

export function getTaskModeTagType(mode: TaskMode | number | string) {
  const value = Number(mode)

  if (value === 0) return 'info'
  if (value === 1) return 'primary'

  return 'warning'
}