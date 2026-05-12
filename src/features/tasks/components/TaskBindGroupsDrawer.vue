<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
  DTButton,
  DTCard,
  DTDrawer,
  DTEmpty,
  DTInput,
  DTLoading,
  DTTag
} from '@/shared/components'

import {
  assignTaskGroups,
  fetchGroups,
  type ConfigGroupItem,
  type TaskItem
} from '@/api'
import { deferInitialLoad } from '@/shared/utils/defer'

const props = withDefaults(
  defineProps<{
    open: boolean
    task: TaskItem | null
    loading?: boolean
  }>(),
  {
    open: false,
    task: null,
    loading: false
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  success: []
}>()

const innerLoading = ref(false)
const saving = ref(false)
const keyword = ref('')
const groups = ref<ConfigGroupItem[]>([])
const selectedGroupIds = ref<number[]>([])

const currentGroupIds = computed(() => {
  return props.task?.groupIds || []
})

const selectedGroups = computed(() => {
  const selectedSet = new Set(selectedGroupIds.value.map(Number))

  return groups.value.filter((item) => {
    return selectedSet.has(Number(item.id))
  })
})

const filteredGroups = computed(() => {
  const keywordValue = keyword.value.trim().toLowerCase()

  return groups.value.filter((item) => {
    const groupName = String(item.groupName || '').toLowerCase()
    const groupCategory = String(item.groupCategory || '').toLowerCase()
    const groupType = String(item.groupType || '').toLowerCase()

    return (
      !keywordValue ||
      groupName.includes(keywordValue) ||
      groupCategory.includes(keywordValue) ||
      groupType.includes(keywordValue)
    )
  })
})

const selectedCount = computed(() => {
  return selectedGroupIds.value.length
})

watch(
  () => [props.open, props.task?.id],
  () => {
    if (props.open) {
      deferInitialLoad(initDrawer)
    }
  },
  {
    immediate: true
  }
)

async function initDrawer() {
  selectedGroupIds.value = currentGroupIds.value.map(Number)

  if (!groups.value.length) {
    await loadGroups()
  }
}

async function loadGroups() {
  innerLoading.value = true

  try {
    groups.value = await fetchGroups()
  } finally {
    innerLoading.value = false
  }
}

function handleClose(value: boolean) {
  emit('update:open', value)

  if (!value) {
    keyword.value = ''
  }
}

function isSelected(group: ConfigGroupItem) {
  return selectedGroupIds.value.includes(Number(group.id))
}

function toggleGroup(group: ConfigGroupItem) {
  const id = Number(group.id)

  if (selectedGroupIds.value.includes(id)) {
    selectedGroupIds.value = selectedGroupIds.value.filter((item) => item !== id)
    return
  }

  selectedGroupIds.value = [...selectedGroupIds.value, id]
}

function selectAllFiltered() {
  const ids = filteredGroups.value.map((item) => Number(item.id))
  const merged = new Set([...selectedGroupIds.value, ...ids])

  selectedGroupIds.value = Array.from(merged)
}

function clearSelected() {
  selectedGroupIds.value = []
}

async function handleSave() {
  if (!props.task) return

  saving.value = true

  try {
    await assignTaskGroups({
      taskId: props.task.id,
      ids: selectedGroupIds.value
    })

    emit('success')
    emit('update:open', false)
  } finally {
    saving.value = false
  }
}

function getGroupEnabled(group: ConfigGroupItem) {
  return Number(group.isEnabled) === 1
}
</script>

<template>
  <DTDrawer
    :open="open"
    title="绑定配置组"
    width="760px"
    show-footer
    confirm-text="保存绑定"
    cancel-text="关闭"
    :loading="saving || loading"
    @update:open="handleClose"
    @confirm="handleSave"
  >
    <template #description>
      为当前任务重新分配关联配置组。保存时会全量覆盖原有关联关系。
    </template>

    <div v-if="task" class="bind-groups">
      <DTCard title="当前任务">
        <div class="task-summary">
          <div>
            <span class="task-summary__label">任务名称</span>
            <strong>{{ task.taskName }}</strong>
          </div>

          <DTTag :type="Number(task.isEnabled) === 1 ? 'success' : 'info'">
            {{ Number(task.isEnabled) === 1 ? '启用' : '禁用' }}
          </DTTag>
        </div>
      </DTCard>

      <DTCard title="筛选配置组">
        <div class="bind-toolbar">
          <DTInput
            v-model="keyword"
            placeholder="请输入分组名称 / 类别 / 类型"
            clearable
          />

          <DTButton @click="selectAllFiltered">
            选择当前筛选
          </DTButton>

          <DTButton @click="clearSelected">
            清空选择
          </DTButton>
        </div>
      </DTCard>

      <DTCard>
        <template #title>
          <div class="card-title-row">
            <span>配置组列表</span>
            <DTTag type="primary">
              已选 {{ selectedCount }} 个
            </DTTag>
          </div>
        </template>

        <div class="groups-panel">
          <DTLoading
            v-if="innerLoading"
            full
            text="正在加载配置组..."
          />

          <template v-else>
            <div
              v-if="filteredGroups.length"
              class="groups-list"
            >
              <label
                v-for="group in filteredGroups"
                :key="group.id"
                class="group-item"
                :class="{ 'is-selected': isSelected(group) }"
              >
                <input
                  class="group-item__checkbox"
                  type="checkbox"
                  :checked="isSelected(group)"
                  @change="toggleGroup(group)"
                >

                <div class="group-item__content">
                  <div class="group-item__main">
                    <strong>{{ group.groupName }}</strong>

                    <div class="group-item__tags">
                      <DTTag type="info">
                        {{ group.groupCategory || '未分类' }}
                      </DTTag>

                      <DTTag type="primary">
                        {{ group.groupType || '默认分组' }}
                      </DTTag>

                      <DTTag :type="getGroupEnabled(group) ? 'success' : 'info'">
                        {{ getGroupEnabled(group) ? '启用' : '禁用' }}
                      </DTTag>
                    </div>
                  </div>

                  <div class="group-item__meta">
                    <span>配置数</span>
                    <strong>{{ group.configCount ?? 0 }}</strong>
                  </div>
                </div>
              </label>
            </div>

            <DTEmpty
              v-else
              size="sm"
              title="暂无配置组"
              description="当前筛选条件下没有可绑定的配置组。"
            />
          </template>
        </div>
      </DTCard>

      <DTCard title="已选配置组">
        <div
          v-if="selectedGroups.length"
          class="selected-groups"
        >
          <DTTag
            v-for="group in selectedGroups"
            :key="group.id"
            type="primary"
          >
            {{ group.groupName }}
          </DTTag>
        </div>

        <DTEmpty
          v-else
          size="sm"
          title="暂未选择配置组"
          description="保存后该任务将不关联任何配置组。"
        />
      </DTCard>
    </div>

    <DTEmpty
      v-else
      title="未选择任务"
      description="请选择一个任务后再进行配置组绑定。"
    />
  </DTDrawer>
</template>

<style scoped lang="scss">
.bind-groups {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.task-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
}

.task-summary__label {
  display: block;
  margin-bottom: 4px;
  color: var(--dt-text-muted);
  font-size: 12px;
}

.task-summary strong {
  color: var(--dt-text-primary);
  font-size: 15px;
}

.bind-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: var(--dt-space-3);
  align-items: center;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-3);
  width: 100%;
}

.groups-panel {
  min-height: 260px;
}

.groups-list {
  display: flex;
  max-height: 360px;
  flex-direction: column;
  gap: var(--dt-space-3);
  overflow: auto;
  padding-right: 4px;
}

.group-item {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-3);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-lg);
  background: var(--dt-bg-surface);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.group-item:hover {
  border-color: var(--dt-color-primary);
  background: color-mix(in srgb, var(--dt-bg-muted) 40%, transparent);
}

.group-item.is-selected {
  border-color: var(--dt-color-primary);
  background: color-mix(in srgb, var(--dt-color-primary) 8%, var(--dt-bg-surface));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-primary) 10%, transparent);
}

.group-item__checkbox {
  width: 16px;
  height: 16px;
  margin-top: 4px;
  accent-color: var(--dt-color-primary);
}

.group-item__content {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
}

.group-item__main {
  min-width: 0;
}

.group-item__main strong {
  display: block;
  margin-bottom: var(--dt-space-2);
  color: var(--dt-text-primary);
  font-size: 14px;
}

.group-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
}

.group-item__meta {
  flex: 0 0 auto;
  color: var(--dt-text-muted);
  font-size: 12px;
  text-align: right;
}

.group-item__meta strong {
  display: block;
  margin-top: 4px;
  color: var(--dt-text-primary);
  font-size: 18px;
}

.selected-groups {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-2);
}

@media (max-width: 760px) {
  .bind-toolbar {
    grid-template-columns: 1fr;
  }

  .group-item__content {
    align-items: flex-start;
    flex-direction: column;
  }

  .group-item__meta {
    text-align: left;
  }
}
</style>
