import type { OverviewActivityItem, OverviewTrendItem } from '@/api/types/dashboard.types'
import type { AcquisitionLogItem, TaskLogItem } from '@/api/types/log.types'
import type { TaskItem } from '@/api/types/task.types'

export const mockTasksData: TaskItem[] = [
  {
    id: 1,
    taskName: 'DA_MasonET',
    name: 'DA_MasonET',
    TaskMode: 0,
    cron: '0,30 0 * * *',
    cronExpression: '0,30 0 * * *',
    isEnabled: true,
    description: '包含麦逊 A 区和 B 区所有电测机台的数据采集任务',
    createTime: '2026-03-02 11:41:35',
    updateTime: '2026-05-06 17:47:56'
  },
  {
    id: 2,
    taskName: '环境数据采集任务',
    name: '环境数据采集任务',
    TaskMode: 0,
    cron: '0,30 0 * * *',
    cronExpression: '0,30 0 * * *',
    isEnabled: true,
    description: '每 10 分钟采集一次温湿度',
    createTime: '2026-03-20 17:41:35',
    updateTime: '2026-03-20 17:41:35'
  },
  {
    id: 4,
    taskName: 'HangFire定时采集任务测试',
    name: 'HangFire定时采集任务测试',
    TaskMode: 1,
    cron: '17 16 * * *',
    cronExpression: '17 16 * * *',
    isEnabled: true,
    description: '本地测试采集',
    createTime: '2026-03-21 14:23:33',
    updateTime: '2026-03-21 14:23:33'
  },
  {
    id: 6,
    taskName: '测试任务',
    name: '测试任务',
    TaskMode: 1,
    cron: '*/30 * * * *',
    cronExpression: '*/30 * * * *',
    isEnabled: true,
    description: '测试任务',
    createTime: '2026-05-06 17:54:33',
    updateTime: '2026-05-07 08:44:16'
  }
]

export const mockTaskLogsData: TaskLogItem[] = [
  {
    id: '22D44448-D42B-41F4-940D-0090F4A11703',
    taskLogId: '22D44448-D42B-41F4-940D-0090F4A11703',
    taskId: 0,
    taskName: '手动执行',
    startTime: '2026-04-23 17:29:06',
    endTime: '2026-04-23 17:29:08',
    status: 'Success',
    totalConfigs: 2,
    successCount: 2,
    failureCount: 0,
    processedCount: 2,
    progress: 100,
    message: '任务完成',
    taskCode: 'ACQ-MAN-20260423-0002',
    triggerType: 'MAN'
  },
  {
    id: '6E5671F1-D348-4A32-A126-36E5B28BF178',
    taskLogId: '6E5671F1-D348-4A32-A126-36E5B28BF178',
    taskId: 0,
    taskName: '手动执行',
    startTime: '2026-04-26 17:26:14',
    endTime: '2026-04-26 17:26:25',
    status: 'Success',
    totalConfigs: 2,
    successCount: 2,
    failureCount: 0,
    processedCount: 2,
    progress: 100,
    message: '任务完成',
    taskCode: 'ACQ-MAN-20260426-0001',
    triggerType: 'MAN'
  },
  {
    id: '64635AFC-5756-4928-A01A-3B5F6328B512',
    taskLogId: '64635AFC-5756-4928-A01A-3B5F6328B512',
    taskId: 0,
    taskName: '手动执行',
    startTime: '2026-04-28 10:35:35',
    endTime: '2026-04-28 10:36:20',
    status: 'Success',
    totalConfigs: 6,
    successCount: 6,
    failureCount: 0,
    processedCount: 6,
    progress: 100,
    message: '任务完成',
    taskCode: 'ACQ-MAN-20260428-0005',
    triggerType: 'MAN'
  },
  {
    id: 'F3DD8F00-18BF-4FC6-B079-67F1E3A0E6CF',
    taskLogId: 'F3DD8F00-18BF-4FC6-B079-67F1E3A0E6CF',
    taskId: 0,
    taskName: '手动执行',
    startTime: '2026-05-07 18:05:47',
    endTime: '2026-05-07 18:05:49',
    status: 'Failed',
    totalConfigs: 9,
    successCount: 0,
    failureCount: 9,
    processedCount: 9,
    progress: 100,
    message: '任务完成，但全部失败。失败数：9',
    taskCode: 'ACQ-MAN-20260507-0001',
    triggerType: 'MAN'
  },
  {
    id: '38A8E726-39B3-4B3F-93F2-A0DBC08F8D99',
    taskLogId: '38A8E726-39B3-4B3F-93F2-A0DBC08F8D99',
    taskId: 0,
    taskName: '手动执行',
    startTime: '2026-04-28 10:51:03',
    endTime: '2026-04-28 10:51:03',
    status: 'Failed',
    totalConfigs: 1,
    successCount: 0,
    failureCount: 1,
    processedCount: 1,
    progress: 100,
    message: '任务完成，但全部失败。失败数：1',
    taskCode: 'ACQ-MAN-20260428-0006',
    triggerType: 'MAN'
  },
  {
    id: '78723024-F3F0-4057-9247-9E22B1FCC006',
    taskLogId: '78723024-F3F0-4057-9247-9E22B1FCC006',
    taskId: 1,
    taskName: 'DA_MasonET',
    startTime: '2026-05-10 09:00:00',
    endTime: null,
    status: 'Running',
    totalConfigs: 5,
    successCount: 0,
    failureCount: 0,
    processedCount: 0,
    progress: 62,
    message: '正在采集麦逊电测配置组',
    taskCode: 'ACQ-AUTO-20260510-0001',
    triggerType: 'AUTO'
  },
  {
    id: 'D412CFF8-E96F-4759-80D3-80A099273BF6',
    taskLogId: 'D412CFF8-E96F-4759-80D3-80A099273BF6',
    taskId: 0,
    taskName: '手动执行',
    startTime: '2026-04-26 18:03:34',
    endTime: '2026-04-26 18:04:10',
    status: 'Success',
    totalConfigs: 1,
    successCount: 1,
    failureCount: 0,
    processedCount: 1,
    progress: 100,
    message: '任务完成',
    taskCode: 'ACQ-MAN-20260426-0002',
    triggerType: 'MAN'
  },
  {
    id: '9167EC19-B530-4CE5-9ED4-C7994CEBFC8E',
    taskLogId: '9167EC19-B530-4CE5-9ED4-C7994CEBFC8E',
    taskId: 0,
    taskName: '手动执行',
    startTime: '2026-04-23 17:22:50',
    endTime: '2026-04-23 17:23:31',
    status: 'Success',
    totalConfigs: 1,
    successCount: 1,
    failureCount: 0,
    processedCount: 1,
    progress: 100,
    message: '任务完成',
    taskCode: 'ACQ-MAN-20260423-0001',
    triggerType: 'MAN'
  },
  {
    id: 'ACQ-AUTO-20260510-0002',
    taskLogId: 'ACQ-AUTO-20260510-0002',
    taskId: 2,
    taskName: '环境数据采集任务',
    startTime: '2026-05-10 10:30:00',
    endTime: '2026-05-10 10:30:07',
    status: 'Success',
    totalConfigs: 2,
    successCount: 2,
    failureCount: 0,
    processedCount: 2,
    progress: 100,
    message: '任务完成',
    taskCode: 'ACQ-AUTO-20260510-0002',
    triggerType: 'AUTO'
  }
]

export const mockAcquisitionLogsData: AcquisitionLogItem[] = [
  {
    id: 'D3D05110-9BF8-4039-96EC-1704626E9966',
    taskLogId: '22D44448-D42B-41F4-940D-0090F4A11703',
    configId: 22,
    configName: 'Mason_Test',
    fileName: 'record-2026.4.1.csv',
    startRow: 2,
    processedRows: 1985,
    startTime: '2026-04-23 17:29:06',
    endTime: '2026-04-23 17:29:08',
    status: 'Success',
    errorMessage: null
  },
  {
    id: 'A06388FC-C31D-4886-AD8D-4927042D1B82',
    taskLogId: '22D44448-D42B-41F4-940D-0090F4A11703',
    configId: 22,
    configName: 'Mason_Test',
    fileName: 'record-2026.4.2.csv',
    startRow: 2,
    processedRows: 2134,
    startTime: '2026-04-23 17:29:06',
    endTime: '2026-04-23 17:29:08',
    status: 'Success',
    errorMessage: null
  },
  {
    id: 'FD2F243A-B211-494C-99F4-1EA8B14728A4',
    taskLogId: 'F3DD8F00-18BF-4FC6-B079-67F1E3A0E6CF',
    configId: 11,
    configName: 'Test_Device_3',
    fileName: '2026-05-07.csv',
    startRow: 2,
    processedRows: 0,
    startTime: '2026-05-07 18:05:48',
    endTime: '2026-05-07 18:05:48',
    status: 'Failed',
    errorMessage: '文件未找到: D:/Desktop/2026.05.07/2026-05-07.csv'
  },
  {
    id: 'EF8ABF8D-F99F-4AB8-9814-AA37C05F600D',
    taskLogId: 'F3DD8F00-18BF-4FC6-B079-67F1E3A0E6CF',
    configId: 8,
    configName: 'REST_Test_Device',
    fileName: 'Log.csv',
    startRow: 2,
    processedRows: 0,
    startTime: '2026-05-07 18:05:48',
    endTime: '2026-05-07 18:05:48',
    status: 'Failed',
    errorMessage: '文件未找到: D:/Data/2026/Log.csv'
  },
  {
    id: '6EF37EBA-DD8B-40E4-8E30-F9E782123168',
    taskLogId: 'F3DD8F00-18BF-4FC6-B079-67F1E3A0E6CF',
    configId: 17,
    configName: 'test1',
    fileName: 'x.xlsx',
    startRow: 2,
    processedRows: 0,
    startTime: '2026-05-07 18:05:48',
    endTime: '2026-05-07 18:05:48',
    status: 'Failed',
    errorMessage: '文件未找到: test\\x.xlsx'
  },
  {
    id: 'C44C20DA-C84F-45D4-8192-C548B6FB5010',
    taskLogId: '38A8E726-39B3-4B3F-93F2-A0DBC08F8D99',
    configId: 22,
    configName: 'Mason_Test',
    fileName: 'record-2026.4.17.csv',
    startRow: 2,
    processedRows: 0,
    startTime: '2026-04-28 10:51:03',
    endTime: '2026-04-28 10:51:03',
    status: 'Failed',
    errorMessage: '文件“D:\\Desktop\\B14\\2026-4\\record-2026.4.17.csv”正由另一进程使用，因此该进程无法访问此文件。'
  },
  {
    id: 'RUNNING-001',
    taskLogId: '78723024-F3F0-4057-9247-9E22B1FCC006',
    configId: 1,
    configName: 'DG-ET-001',
    fileName: 'record-2026-5-10.csv',
    startRow: 2,
    processedRows: 1088,
    startTime: '2026-05-10 09:00:02',
    endTime: null,
    status: 'Running',
    errorMessage: null
  },
  {
    id: 'TODAY-001',
    taskLogId: 'ACQ-AUTO-20260510-0002',
    configId: 11,
    configName: 'Test_Device_3',
    fileName: '2026-05-10.csv',
    startRow: 2,
    processedRows: 24,
    startTime: '2026-05-10 10:30:00',
    endTime: '2026-05-10 10:30:07',
    status: 'Success',
    errorMessage: null
  }
]

export function getTaskLogDetail(id: string) {
  const log = mockTaskLogsData.find((item) => item.taskLogId === id || item.id === id)

  if (!log) return null

  return {
    ...log,
    details: mockAcquisitionLogsData.filter((item) => item.taskLogId === id)
  }
}

export function buildDashboardTrend(): OverviewTrendItem[] {
  const buckets = new Map<string, OverviewTrendItem>()

  mockTaskLogsData.forEach((item) => {
    const date = (item.startTime || '').slice(0, 10)
    if (!date) return

    const bucket = buckets.get(date) || {
      date,
      successCount: 0,
      failureCount: 0,
      runningCount: 0
    }

    if (item.status === 'Success') bucket.successCount += 1
    if (item.status === 'Failed') bucket.failureCount += 1
    if (item.status === 'Running') bucket.runningCount = (bucket.runningCount || 0) + 1

    buckets.set(date, bucket)
  })

  return Array.from(buckets.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export function buildDashboardActivities(): OverviewActivityItem[] {
  return mockTaskLogsData
    .slice()
    .sort((a, b) => String(b.startTime).localeCompare(String(a.startTime)))
    .slice(0, 6)
    .map((item) => ({
      id: item.taskLogId || String(item.id),
      title: item.taskName || item.taskCode || '采集任务',
      status: item.status || 'Pending',
      time: item.startTime || '',
      message: item.message,
      taskCode: item.taskCode,
      triggerType: item.triggerType
    }))
}
