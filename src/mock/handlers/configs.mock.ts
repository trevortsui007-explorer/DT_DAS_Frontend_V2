import type { AxiosRequestConfig } from 'axios'

const mockConfigList = [
  {
    id: 22,
    eqName: 'Mason_Test',
    tableName: 'MasonElectricMeasurementLogFiles_BAK',
    filePathPattern: 'D://Desktop/B14/{yyyy}-{M}/',
    fileType: '.csv',
    isEnabled: true,
    createTime: '2026-04-22T17:30:26.5000000+08:00'
  },
  {
    id: 23,
    eqName: 'WIP Lot 数据配置',
    tableName: 'QA_UBWipLot',
    filePathPattern: '\\\\server\\wip\\lot',
    fileType: '.xlsx',
    isEnabled: true,
    createTime: '2026-04-21T08:00:00.0000000+08:00'
  },
  {
    id: 24,
    eqName: 'Scrap 数据配置',
    tableName: 'DA_Scrap_Data',
    filePathPattern: '\\\\server\\scrap',
    fileType: '.xlsx',
    isEnabled: false,
    createTime: '2026-04-22T08:00:00.0000000+08:00'
  }
]

const mockConfigDetails = mockConfigList.map((item) => {
  return {
    ...item,
    fileNamePattern: item.id === 22 ? 'record-{yyyy}.{M}.{d}.csv' : `${item.eqName}_*.xlsx`,
    headerRow: 1,
    startRow: 2,
    fieldMappings: JSON.stringify({
      'PCB No.': 'pcbNo',
      Barcode: 'qrCode',
      'Lot No.': 'prodno',
      Date: 'date',
      Lot: 'lotno',
      Cycle: 'cycle',
      'Test Result': 'testResult',
      'Con Param': 'continuityParam',
      'ISO Param': 'insulationParam',
      'Total Point': 'totalPoints',
      'Table Struct': 'netlistStructure',
      'Test Step': 'testStep',
      'Bad Info': 'badPointInfo'
    }),
    extFields: null,
    postProcessingType: 2,
    postTableName: 'MasonETFailureInformation_BAK',
    procedureName: 'MasonETFailureService',
    serviceName: 'MasonETFailureService',
    flag: '',
    flagName: ''
  }
})

function getIdFromUrl(url: string) {
  const matched = url.match(/\/api\/file-configs\/([^/?]+)/)

  return matched?.[1]
}

function wrap<T>(data: T) {
  return {
    code: 1,
    info: '查询成功',
    data
  }
}

export function mockConfigs(config: AxiosRequestConfig) {
  const url = config.url || ''
  const method = (config.method || 'get').toLowerCase()

  if (!url.includes('/api/file-configs')) {
    return null
  }

  if (method === 'get') {
    const id = getIdFromUrl(url)

    if (id) {
      const detail =
        mockConfigDetails.find((item) => String(item.id) === String(id)) ||
        mockConfigDetails[0]

      return wrap(detail)
    }

    return wrap(mockConfigList)
  }

  if (method === 'post') {
    return {
      code: 1,
      info: '创建成功',
      data: true
    }
  }

  if (method === 'put') {
    return {
      code: 1,
      info: '保存成功',
      data: true
    }
  }

  if (method === 'patch' && url.includes('/api/file-configs/status')) {
    return {
      code: 1,
      info: '状态更新成功',
      data: true
    }
  }

  return null
}