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
    const keywordValue = keyword.value.trim().toLowerCase()

    return configs.value.filter((item) => {
      const keywordMatched =
        !keywordValue ||
        item.name.toLowerCase().includes(keywordValue) ||
        item.sourcePath.toLowerCase().includes(keywordValue) ||
        item.targetTable.toLowerCase().includes(keywordValue)

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
    const originalStatus = row.isEnabled;
    const nextStatus = !originalStatus;

    await setConfigStatus({
      ids: [row.id],
      isEnabled: nextStatus
    });
    
    row.isEnabled = nextStatus;
  }

  function resetFilters() {
    keyword.value = ''
    status.value = ''
  }

  return {
    loading,
    keyword,
    status,
    statusOptions,
    configs,
    filteredConfigs,
    loadConfigs,
    toggleConfigStatus,
    resetFilters
  }
}