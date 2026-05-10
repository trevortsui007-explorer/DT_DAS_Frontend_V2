<script setup lang="ts">
import { DTButton, DTInput, DTSelect } from '@/shared/components'
import type { DTSelectOption, DTSelectValue } from '@/shared/components'

defineProps<{
  status: DTSelectValue | ''
  taskId: DTSelectValue | ''
  startTime: string
  endTime: string
  statusOptions: DTSelectOption[]
  taskOptions: DTSelectOption[]
}>()

const emit = defineEmits<{
  'update:status': [value: DTSelectValue | '']
  'update:taskId': [value: DTSelectValue | '']
  'update:startTime': [value: string]
  'update:endTime': [value: string]
  search: []
  reset: []
  refresh: []
}>()
</script>

<template>
  <div class="task-logs-toolbar">
    <DTSelect
      :model-value="status"
      :options="statusOptions"
      placeholder="全部状态"
      clearable
      @update:model-value="emit('update:status', $event)"
    />

    <DTSelect
      :model-value="taskId"
      :options="taskOptions"
      placeholder="全部任务"
      clearable
      @update:model-value="emit('update:taskId', $event)"
    />

    <DTInput
      :model-value="startTime"
      placeholder="开始时间，例如 2026-04-23 00:00:00"
      clearable
      @update:model-value="emit('update:startTime', String($event))"
    />

    <DTInput
      :model-value="endTime"
      placeholder="结束时间，例如 2026-05-10 23:59:59"
      clearable
      @update:model-value="emit('update:endTime', String($event))"
    />

    <div class="task-logs-toolbar__actions">
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
  </div>
</template>

<style scoped lang="scss">
.task-logs-toolbar {
  display: grid;
  grid-template-columns: minmax(140px, 180px) minmax(160px, 220px) minmax(220px, 1fr) minmax(220px, 1fr) auto;
  gap: var(--dt-space-3);
  align-items: center;
}

.task-logs-toolbar__actions {
  display: inline-flex;
  gap: var(--dt-space-2);
}

@media (max-width: 1180px) {
  .task-logs-toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .task-logs-toolbar__actions {
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .task-logs-toolbar {
    grid-template-columns: 1fr;
  }

  .task-logs-toolbar__actions {
    flex-wrap: wrap;
  }
}
</style>
