<script setup lang="ts">
import { DTButton, DTInput, DTSelect } from '@/shared/components'
import type { DTSelectOption, DTSelectValue } from '@/shared/components'

defineProps<{
  keyword: string
  status: DTSelectValue | ''
  taskMode: DTSelectValue | ''
  statusOptions: DTSelectOption[]
  taskModeOptions: DTSelectOption[]
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
  'update:status': [value: DTSelectValue | '']
  'update:taskMode': [value: DTSelectValue | '']
  search: []
  reset: []
  create: []
  refresh: []
}>()
</script>

<template>
  <div class="tasks-toolbar">
    <div class="tasks-toolbar__filters">
      <DTInput
        :model-value="keyword"
        placeholder="请输入任务名称 / Cron / 描述"
        clearable
        @update:model-value="emit('update:keyword', String($event))"
      />

      <DTSelect
        :model-value="taskMode"
        :options="taskModeOptions"
        placeholder="请选择任务类型"
        clearable
        @update:model-value="emit('update:taskMode', $event)"
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
      新增任务
    </DTButton>
  </div>
</template>

<style scoped lang="scss">
.tasks-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-4);
  align-items: center;
  justify-content: space-between;
}

.tasks-toolbar__filters {
  display: grid;
  grid-template-columns:
    minmax(0, 280px)
    minmax(0, 160px)
    minmax(0, 160px)
    auto
    auto
    auto;
  gap: var(--dt-space-3);
  align-items: center;
}

@media (max-width: 1280px) {
  .tasks-toolbar__filters {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 160px)
      minmax(0, 160px)
      auto
      auto
      auto;
    width: 100%;
  }
}

@media (max-width: 860px) {
  .tasks-toolbar__filters {
    grid-template-columns: 1fr;
  }
}
</style>