<script setup lang="ts">
import { DTButton, DTInput } from '@/shared/components'

defineProps<{
  keyword: string
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
  search: []
  create: []
  refresh: []
}>()
</script>

<template>
  <div class="tasks-toolbar">
    <div class="tasks-toolbar__filters">
      <DTInput
        :model-value="keyword"
        placeholder="请输入任务名称"
        clearable
        @update:model-value="emit('update:keyword', String($event))"
      />

      <DTButton type="primary" @click="emit('search')">
        查询
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
  grid-template-columns: minmax(0, 240px) auto auto;
  gap: var(--dt-space-3);
  align-items: center;
}

@media (max-width: 960px) {
  .tasks-toolbar__filters {
    grid-template-columns: 1fr;
    width: 100%;
  }
}
</style>