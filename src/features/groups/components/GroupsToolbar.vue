<script setup lang="ts">
import { DTButton, DTInput, DTSelect } from '@/shared/components'
import type { DTSelectOption, DTSelectValue } from '@/shared/components'

defineProps<{
  keyword: string
  status: DTSelectValue | ''
  statusOptions: DTSelectOption[]
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
  'update:status': [value: DTSelectValue | '']
  search: []
  reset: []
  create: []
  refresh: []
}>()
</script>

<template>
  <div class="groups-toolbar">
    <div class="groups-toolbar__filters">
      <DTInput
        :model-value="keyword"
        placeholder="请输入分组名称 / 类别 / 类型 / 配置名称"
        clearable
        @update:model-value="emit('update:keyword', String($event))"
      />

      <DTSelect
        :model-value="status"
        :options="statusOptions"
        placeholder="请选择状态"
        clearable
        @update:model-value="emit('update:status', $event)"
      />

      <DTButton type="primary" @click="emit('search')">
        查询
      </DTButton>

      <DTButton @click="emit('reset')">
        重置
      </DTButton>

      <DTButton @click="emit('refresh')">
        刷新
      </DTButton>
    </div>

    <DTButton type="primary" @click="emit('create')">
      新增分组
    </DTButton>
  </div>
</template>

<style scoped lang="scss">
.groups-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-4);
  align-items: center;
  justify-content: space-between;
}

.groups-toolbar__filters {
  display: grid;
  grid-template-columns: minmax(0, 300px) minmax(0, 180px) auto auto auto;
  gap: var(--dt-space-3);
  align-items: center;
}

@media (max-width: 1120px) {
  .groups-toolbar__filters {
    grid-template-columns: minmax(0, 1fr) minmax(0, 180px) auto auto auto;
    width: 100%;
  }
}

@media (max-width: 760px) {
  .groups-toolbar__filters {
    grid-template-columns: 1fr;
  }
}
</style>