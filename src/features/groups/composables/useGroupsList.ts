import { computed, ref } from 'vue'

import {
  fetchGroups,
  setGroupStatus,
  type ConfigGroupItem
} from '@/api'

import type { DTSelectOption, DTSelectValue } from '@/shared/components'

export function useGroupsList() {
  const loading = ref(false)
  const keyword = ref('')
  const status = ref<DTSelectValue | ''>('')

  const groups = ref<ConfigGroupItem[]>([])

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

  const filteredGroups = computed(() => {
    const keywordValue = keyword.value.trim().toLowerCase()

    return groups.value.filter((item) => {
      const groupName = item.groupName.toLowerCase()
      const groupCategory = item.groupCategory.toLowerCase()
      const groupType = item.groupType.toLowerCase()
      const associatedNames = item.associatedConfigs
        .map((config) => config.eqName)
        .join(',')
        .toLowerCase()

      const keywordMatched =
        !keywordValue ||
        groupName.includes(keywordValue) ||
        groupCategory.includes(keywordValue) ||
        groupType.includes(keywordValue) ||
        associatedNames.includes(keywordValue)

      const statusMatched =
        !status.value ||
        status.value === 'all' ||
        (status.value === 'enabled' && item.isEnabled === 1) ||
        (status.value === 'disabled' && item.isEnabled === 0)

      return keywordMatched && statusMatched
    })
  })

  async function loadGroups() {
    loading.value = true

    try {
      groups.value = await fetchGroups()
    } finally {
      loading.value = false
    }
  }

  async function toggleGroupStatus(row: ConfigGroupItem) {
    await setGroupStatus({
      ids: row.id,
      isEnabled: row.isEnabled === 1 ? 0 : 1
    })

    await loadGroups()
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
    groups,
    filteredGroups,
    loadGroups,
    toggleGroupStatus,
    resetFilters
  }
}