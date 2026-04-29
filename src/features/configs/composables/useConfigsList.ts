import { computed, ref } from 'vue'

import {
  fetchConfigs,
  setConfigStatus,
  type FileConfigItem
} from '@/api'

import type { DTSelectOption, DTSelectValue } from '@/shared/components'

export function useConfigsList() {
  const loading = ref(false)
  const keyword = ref('')
  const status = ref<DTSelectValue | ''>('')

  const configs = ref<FileConfigItem[]>([])

  const statusOptions: DTSelectOption[] = [
    {
      label: '全部状态',
      value: 'all'
    },
    {
      label: '启用',
      value: 'enabled'
    },
    {
      label: '禁用',
      value: 'disabled'
    }
  ]

  const filteredConfigs = computed(() => {
    return configs.value.filter((item) => {
      const name = item.name || item.configName || ''
      const keywordMatched = !keyword.value || name.includes(keyword.value)

      const statusMatched =
        !status.value ||
        status.value === 'all' ||
        (status.value === 'enabled' && item.isEnabled) ||
        (status.value === 'disabled' && !item.isEnabled)

      return keywordMatched && statusMatched
    })
  })

  async function loadConfigs() {
    loading.value = true

    try {
      configs.value = await fetchConfigs()
    } finally {
      loading.value = false
    }
  }

    async function toggleConfigStatus(row: FileConfigItem) {
    if (row.id === undefined || row.id === null) {
        throw new Error('配置 ID 不存在，无法切换状态')
    }

    await setConfigStatus({
        ids: [row.id],
        isEnabled: !row.isEnabled
    })

    await loadConfigs()
    }

  return {
    loading,
    keyword,
    status,
    statusOptions,
    configs,
    filteredConfigs,
    loadConfigs,
    toggleConfigStatus
  }
}