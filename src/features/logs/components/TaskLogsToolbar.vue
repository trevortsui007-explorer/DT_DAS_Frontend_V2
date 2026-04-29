<script setup lang="ts">
import { DTButton, DTInput, DTSelect } from '@/shared/components'
import type { DTSelectOption, DTSelectValue } from '@/shared/components'

defineProps<{
  status: DTSelectValue | ''
  taskId: string
  statusOptions: DTSelectOption[]
}>()

const emit = defineEmits<{
  'update:status': [value: DTSelectValue | '']
  'update:taskId': [value: string]
  search: []
  refresh: []
}>()
</script>

<template>
  <div class="task-logs-toolbar">
    <DTSelect
      :model-value="status"
      :options="statusOptions"
      placeholder="请选择状态"
      clearable
      @update:model-value="emit('update:status', $event)"
    />

    <DTInput
      :model-value="taskId"
      placeholder="请输入 TaskId"
      clearable
      @update:model-value="emit('update:taskId', String($event))"
    />

    <DTButton type="primary" @click="emit('search')">
      查询
    </DTButton>

    <DTButton @click="emit('refresh')">
      刷新
    </DTButton>
  </div>
</template>

<style scoped lang="scss">
.task-logs-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 180px) minmax(0, 180px) auto auto;
  gap: var(--dt-space-3);
  align-items: center;
}

@media (max-width: 960px) {
  .task-logs-toolbar {
    grid-template-columns: 1fr;
  }
}
</style>