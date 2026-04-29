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
  create: []
  refresh: []
}>()
</script>

<template>
  <div class="configs-toolbar">
    <div class="configs-toolbar__filters">
      <DTInput
        :model-value="keyword"
        placeholder="请输入配置名称"
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

      <DTButton @click="emit('refresh')">
        刷新
      </DTButton>
    </div>

    <DTButton type="primary" @click="emit('create')">
      新增配置
    </DTButton>
  </div>
</template>

<style scoped lang="scss">
.configs-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-4);
  align-items: center;
  justify-content: space-between;
}

.configs-toolbar__filters {
  display: grid;
  grid-template-columns: minmax(0, 240px) minmax(0, 180px) auto auto;
  gap: var(--dt-space-3);
  align-items: center;
}

@media (max-width: 960px) {
  .configs-toolbar__filters {
    grid-template-columns: 1fr;
    width: 100%;
  }
}
</style>