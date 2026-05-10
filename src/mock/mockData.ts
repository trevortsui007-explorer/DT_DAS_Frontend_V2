import type { FileConfigItem } from '@/api/types/config.types'
import type { ConfigGroupItem } from '@/api/types/group.types'
import type { OverviewActivityItem, OverviewTrendItem } from '@/api/types/dashboard.types'
import type { AcquisitionLogItem, TaskLogItem } from '@/api/types/log.types'
import type { TaskItem } from '@/api/types/task.types'

export type MockFileConfigItem = Omit<FileConfigItem, 'fieldMappings'> & {
  eqName?: string
  tableName?: string
  filePathPattern?: string
  fileNamePattern?: string
  fileType?: string
  headerRow?: number
  startRow?: number
  fieldMappings?: Record<string, string>
  extFields?: Record<string, unknown> | null
  postProcessingType?: number
  postTableName?: string
  procedureName?: string
  serviceName?: string
  flag?: string
  flagName?: string
}

export type MockConfigGroupItem = ConfigGroupItem & {
  configIds?: number[]
}

const masonCnMappings = '{"PCB号":"pcbNo","二维码":"qrCode","料号":"prodno","日期":"date","Lot":"lotno","周期":"cycle","测试结果":"testResult","导通参数":"continuityParam","绝缘参数":"insulationParam","总点数":"totalPoints","网表结构":"netlistStructure","测试步骤":"testStep","坏点信息":"badPointInfo"}'
const masonEnMappings = '{"PCB No.":"pcbNo","Barcode":"qrCode","Lot No.":"prodno","Date":"date","Lot":"lotno","Cycle":"cycle","Test Result":"testResult","Con Param":"continuityParam","ISO Param":"insulationParam","Total Point":"totalPoints","Table Struct":"netlistStructure","Test Step":"testStep","Bad Info":"badPointInfo"}'
const envMappings = '{"环境温度":"Temperature","环境湿度":"Humidity"}'
const testMappings = '{"a":"a","b":"b","c":"c","d":"d","e":"e","f":"f","{row}":"row","{fullFilePath}":"fullFilePath","{createdt}":"createdt"}'

function parseMapping(value?: string) {
  if (!value) return {}

  try {
    const parsed = JSON.parse(value)

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, string>
      : {}
  } catch {
    return {}
  }
}

function parseExtFields(value?: string | null) {
  if (!value) return null

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce<Record<string, true>>((acc, item) => {
      acc[item] = true
      return acc
    }, {})
}

function createConfig(data: {
  id: number
  eqName: string
  tableName: string
  filePathPattern: string
  fileNamePattern?: string
  fileType: string
  headerRow: number
  startRow: number
  fieldMappings?: string
  extFields?: string | null
  isEnabled: boolean | number
  postProcessingType: number
  postTableName?: string | null
  procedureName?: string | null
  serviceName?: string | null
  flag?: string | null
  flagName?: string | null
  createTime: string
}): MockFileConfigItem {
  return {
    id: data.id,
    name: data.eqName,
    sourcePath: data.filePathPattern,
    targetTable: data.tableName,
    isEnabled: Boolean(data.isEnabled),
    description: data.flagName || data.flag || '',
    createTime: data.createTime,
    updateTime: data.createTime,
    fileNamePattern: data.fileNamePattern || '',
    startRow: data.startRow,
    eqName: data.eqName,
    tableName: data.tableName,
    filePathPattern: data.filePathPattern,
    fileType: data.fileType,
    headerRow: data.headerRow,
    fieldMappings: parseMapping(data.fieldMappings),
    extFields: parseExtFields(data.extFields),
    postProcessingType: data.postProcessingType,
    postTableName: data.postTableName ?? undefined,
    procedureName: data.procedureName ?? undefined,
    serviceName: data.serviceName ?? undefined,
    flag: data.flag ?? undefined,
    flagName: data.flagName ?? undefined
  }
}

export const mockConfigsData: MockFileConfigItem[] = [
  createConfig({ id: 1, eqName: 'DG-ET-001', tableName: 'MasonElectricMeasurementLogFiles', filePathPattern: 'ftp://10.6.9.22/A1/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}-{M}-{d}', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonCnMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'pr_process_bad_point_information', serviceName: null, flag: 'ProcessFailurePointInfo', flagName: '处理坏点信息', createTime: '2026-03-02 10:05:55' }),
  createConfig({ id: 2, eqName: 'DG-ET-002', tableName: 'MasonElectricMeasurementLogFiles', filePathPattern: 'ftp://10.6.9.22/A2/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}-{M}-{d}', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonCnMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'pr_process_bad_point_information', serviceName: null, flag: 'ProcessFailurePointInfo', flagName: '处理坏点信息', createTime: '2026-03-02 10:05:55' }),
  createConfig({ id: 3, eqName: 'DG-ET-004', tableName: 'MasonElectricMeasurementLogFiles', filePathPattern: 'ftp://10.6.9.22/A3/CSV/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}.{M}.{d}', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonEnMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'pr_process_bad_point_information', serviceName: null, flag: 'ProcessFailurePointInfo', flagName: '处理坏点信息', createTime: '2026-03-02 10:05:55' }),
  createConfig({ id: 4, eqName: 'DG-ET-025', tableName: 'MasonElectricMeasurementLogFiles', filePathPattern: 'ftp://10.6.9.22/B11/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}-{M}-{d}', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonCnMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'pr_process_bad_point_information', serviceName: null, flag: 'ProcessFailurePointInfo', flagName: '处理坏点信息', createTime: '2026-03-02 11:09:18' }),
  createConfig({ id: 5, eqName: 'DG-ET-026', tableName: 'MasonElectricMeasurementLogFiles', filePathPattern: 'ftp://10.6.9.22/B12/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}-{M}-{d}', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonCnMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'pr_process_bad_point_information', serviceName: null, flag: 'ProcessFailurePointInfo', flagName: '处理坏点信息', createTime: '2026-03-02 11:09:18' }),
  createConfig({ id: 6, eqName: 'DG-ET-027', tableName: 'MasonElectricMeasurementLogFiles', filePathPattern: 'ftp://10.6.9.22/B13/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}-{M}-{d}', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonCnMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'pr_process_bad_point_information', serviceName: null, flag: 'ProcessFailurePointInfo', flagName: '处理坏点信息', createTime: '2026-03-02 11:09:18' }),
  createConfig({ id: 7, eqName: 'DG-ET-028', tableName: 'MasonElectricMeasurementLogFiles', filePathPattern: 'ftp://10.6.9.22/B14/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}.{M}.{d}', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonEnMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'pr_process_bad_point_information', serviceName: null, flag: 'ProcessFailurePointInfo', flagName: '处理坏点信息', createTime: '2026-03-02 11:09:18' }),
  createConfig({ id: 8, eqName: 'REST_Test_Device', tableName: 'Target_Data_Table', filePathPattern: 'D:/Data/{yyyy}/', fileNamePattern: 'Log.csv', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: '[]', extFields: null, isEnabled: 1, postProcessingType: 2, postTableName: null, procedureName: '', serviceName: 'ProcessETFailureInformation', flag: null, flagName: null, createTime: '2026-03-03 11:58:07' }),
  createConfig({ id: 9, eqName: 'REST_Test_Device_2', tableName: 'Target_Data_Table', filePathPattern: 'D:/Data/{yyyy}/', fileNamePattern: 'Log.csv', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: '[]', extFields: null, isEnabled: 1, postProcessingType: 2, postTableName: null, procedureName: '', serviceName: 'ProcessETFailureInformation', flag: null, flagName: null, createTime: '2026-03-09 10:46:57' }),
  createConfig({ id: 11, eqName: 'Test_Device_3', tableName: 'Target_Data_Table', filePathPattern: 'D:/Desktop/{yyyy}.{MM}.{dd}/', fileNamePattern: '{yyyy}-{MM}-{dd}.csv', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: envMappings, extFields: 'row, fullFilePath', isEnabled: 1, postProcessingType: 0, postTableName: null, procedureName: null, serviceName: 'DataAcquisitionService', flag: 'Manual_Test_001', flagName: '手动补录测试', createTime: '2026-03-13 16:52:58' }),
  createConfig({ id: 12, eqName: 'Test_Device_4', tableName: 'Target_Data_Table', filePathPattern: 'D:/Desktop/{yyyy}.{MM}.{dd}/', fileNamePattern: '{yyyy}-{MM}-{dd}.xlsx', fileType: 'xlsx', headerRow: 1, startRow: 2, fieldMappings: envMappings, extFields: null, isEnabled: 1, postProcessingType: 0, postTableName: null, procedureName: null, serviceName: 'DataAcquisitionService', flag: 'Manual_Test_001', flagName: '手动补录测试', createTime: '2026-03-16 10:25:47' }),
  createConfig({ id: 13, eqName: 'REST_Test_Device_5', tableName: 'Target_Data_Table', filePathPattern: 'D:/Desktop/{yyyy}.{MM}.{dd}/', fileNamePattern: '', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: envMappings, extFields: null, isEnabled: 1, postProcessingType: 0, postTableName: null, procedureName: '', serviceName: null, flag: null, flagName: null, createTime: '2026-03-18 17:16:29' }),
  createConfig({ id: 14, eqName: 'DG-ET-017', tableName: 'MasonElectricMeasurementLogFiles_BAK', filePathPattern: 'D:/Desktop/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}-{M}-{d}.csv', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonCnMappings, extFields: 'row,fullFilePath,IsProcessed', isEnabled: 1, postProcessingType: 2, postTableName: 'MasonETFailureInformation_BAK', procedureName: null, serviceName: 'MasonETFailureService', flag: 'ProcessFailurePointInfo', flagName: '处理坏点信息', createTime: '2026-03-19 11:08:47' }),
  createConfig({ id: 15, eqName: 'test', tableName: 'test', filePathPattern: 'test', fileNamePattern: 'x.xlsx', fileType: '.xlsx', headerRow: 1, startRow: 2, fieldMappings: testMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'test', serviceName: 'test', flag: '', flagName: '', createTime: '2026-04-16 11:59:22' }),
  createConfig({ id: 17, eqName: 'test1', tableName: 'test', filePathPattern: 'test', fileNamePattern: 'x.xlsx', fileType: '.xlsx', headerRow: 1, startRow: 2, fieldMappings: testMappings, extFields: null, isEnabled: 1, postProcessingType: 1, postTableName: null, procedureName: 'test', serviceName: 'test', flag: '', flagName: '', createTime: '2026-04-16 13:36:38' }),
  createConfig({ id: 18, eqName: 'test2', tableName: 'test', filePathPattern: 'test', fileNamePattern: '', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: '', extFields: null, isEnabled: 1, postProcessingType: 0, postTableName: null, procedureName: '', serviceName: '', flag: '', flagName: '', createTime: '2026-04-16 15:09:41' }),
  createConfig({ id: 19, eqName: 'test3', tableName: 'test', filePathPattern: 'test', fileNamePattern: '', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: '', extFields: null, isEnabled: 1, postProcessingType: 0, postTableName: null, procedureName: '', serviceName: '', flag: '', flagName: '', createTime: '2026-04-16 15:10:03' }),
  createConfig({ id: 20, eqName: 'test4', tableName: 'test', filePathPattern: 'test', fileNamePattern: '', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: '', extFields: null, isEnabled: 1, postProcessingType: 0, postTableName: null, procedureName: '', serviceName: '', flag: '', flagName: '', createTime: '2026-04-16 15:12:51' }),
  createConfig({ id: 21, eqName: 'test6', tableName: 'test', filePathPattern: 'test', fileNamePattern: '', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: '', extFields: null, isEnabled: 1, postProcessingType: 0, postTableName: null, procedureName: '', serviceName: '', flag: '', flagName: '', createTime: '2026-04-16 17:44:59' }),
  createConfig({ id: 22, eqName: 'Mason_Test', tableName: 'MasonElectricMeasurementLogFiles_BAK', filePathPattern: 'D://Desktop/B14/{yyyy}-{M}/', fileNamePattern: 'record-{yyyy}.{M}.{d}.csv', fileType: '.csv', headerRow: 1, startRow: 2, fieldMappings: masonEnMappings, extFields: null, isEnabled: 1, postProcessingType: 2, postTableName: 'MasonETFailureInformation_BAK', procedureName: 'MasonETFailureService', serviceName: 'MasonETFailureService', flag: '', flagName: '', createTime: '2026-04-22 17:30:26' }),
  createConfig({ id: 24, eqName: 'REST_Test_Device_6', tableName: 'Target_Data_Table', filePathPattern: 'D:/Desktop/{yyyy}.{MM}.{dd}/', fileNamePattern: '', fileType: 'csv', headerRow: 1, startRow: 2, fieldMappings: envMappings, extFields: null, isEnabled: 1, postProcessingType: 0, postTableName: null, procedureName: '', serviceName: null, flag: null, flagName: null, createTime: '2026-04-23 10:43:18' }),
  createConfig({ id: 25, eqName: 'Test_New_Version', tableName: 'TestTable', filePathPattern: 'D:\\Code\\DT_DAS_Frontend_V2\\src\\features\\configs\\components', fileNamePattern: 'pattern.csv', fileType: 'xlsx', headerRow: 1, startRow: 2, fieldMappings: '{"文件路径":"filePath"}', extFields: null, isEnabled: 0, postProcessingType: 2, postTableName: 'PostTable', procedureName: '', serviceName: 'PostService', flag: '', flagName: '', createTime: '2026-05-05 15:26:21' })
]

export const mockGroupConfigData = [
  { id: 1, groupId: 1, configId: 1, isEnabled: true },
  { id: 2, groupId: 1, configId: 2, isEnabled: true },
  { id: 3, groupId: 1, configId: 3, isEnabled: true },
  { id: 4, groupId: 2, configId: 4, isEnabled: true },
  { id: 5, groupId: 2, configId: 5, isEnabled: true },
  { id: 6, groupId: 2, configId: 6, isEnabled: true },
  { id: 7, groupId: 2, configId: 7, isEnabled: true },
  { id: 80, groupId: 3, configId: 18, isEnabled: true },
  { id: 81, groupId: 3, configId: 19, isEnabled: true },
  { id: 82, groupId: 3, configId: 20, isEnabled: true },
  { id: 83, groupId: 3, configId: 21, isEnabled: true },
  { id: 84, groupId: 3, configId: 15, isEnabled: true },
  { id: 85, groupId: 3, configId: 17, isEnabled: true },
  { id: 86, groupId: 3, configId: 18, isEnabled: true },
  { id: 87, groupId: 3, configId: 19, isEnabled: true },
  { id: 88, groupId: 3, configId: 20, isEnabled: true },
  { id: 89, groupId: 3, configId: 21, isEnabled: true },
  { id: 90, groupId: 3, configId: 15, isEnabled: true },
  { id: 91, groupId: 3, configId: 17, isEnabled: true },
  { id: 92, groupId: 3, configId: 15, isEnabled: true },
  { id: 93, groupId: 3, configId: 17, isEnabled: true },
  { id: 94, groupId: 3, configId: 11, isEnabled: true },
  { id: 95, groupId: 3, configId: 8, isEnabled: true },
  { id: 96, groupId: 3, configId: 9, isEnabled: true },
  { id: 97, groupId: 3, configId: 11, isEnabled: true },
  { id: 98, groupId: 4, configId: 17, isEnabled: true },
  { id: 99, groupId: 4, configId: 18, isEnabled: true },
  { id: 100, groupId: 4, configId: 19, isEnabled: true },
  { id: 101, groupId: 4, configId: 20, isEnabled: true },
  { id: 102, groupId: 4, configId: 21, isEnabled: true }
]

function getConfigIds(groupId: number) {
  return mockGroupConfigData
    .filter((item) => item.groupId === groupId && item.isEnabled)
    .map((item) => item.configId)
}

function getAssociatedConfigs(groupId: number) {
  return getConfigIds(groupId).map((configId) => {
    const config = mockConfigsData.find((item) => item.id === configId)

    return {
      id: String(configId),
      eqName: config?.eqName || config?.name || `配置 ${configId}`,
      isEnabled: config?.isEnabled ? 1 as const : 0 as const
    }
  })
}

export const mockGroupsData: MockConfigGroupItem[] = [
  {
    id: '1',
    groupName: '电测自动配置组',
    groupCategory: '麦逊',
    groupType: '默认执行组',
    isEnabled: 1,
    configCount: getConfigIds(1).length,
    associatedConfigs: getAssociatedConfigs(1),
    configIds: getConfigIds(1)
  },
  {
    id: '2',
    groupName: '麦逊电测配置组_第二组',
    groupCategory: '麦逊',
    groupType: '默认执行组',
    isEnabled: 1,
    configCount: getConfigIds(2).length,
    associatedConfigs: getAssociatedConfigs(2),
    configIds: getConfigIds(2)
  },
  {
    id: '3',
    groupName: '组测试',
    groupCategory: '二厂',
    groupType: '默认周期执行组',
    isEnabled: 1,
    configCount: getConfigIds(3).length,
    associatedConfigs: getAssociatedConfigs(3),
    configIds: getConfigIds(3)
  },
  {
    id: '4',
    groupName: '测试分组',
    groupCategory: '二厂',
    groupType: '默认周期执行组',
    isEnabled: 0,
    configCount: getConfigIds(4).length,
    associatedConfigs: getAssociatedConfigs(4),
    configIds: getConfigIds(4)
  }
]

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
