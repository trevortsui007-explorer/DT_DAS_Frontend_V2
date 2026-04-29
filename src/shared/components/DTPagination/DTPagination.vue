<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    pageSize: number
    total: number
    pageSizes?: number[]
    showPageSize?: boolean
    showTotal?: boolean
  }>(),
  {
    page: 1,
    pageSize: 10,
    total: 0,
    pageSizes: () => [10, 20, 50, 100],
    showPageSize: true,
    showTotal: true
  }
)

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
  change: [payload: { page: number; pageSize: number }]
}>()

const totalPages = computed(() => {
  if (props.total <= 0) return 1

  return Math.max(1, Math.ceil(props.total / props.pageSize))
})

const currentPage = computed(() => {
  return Math.min(Math.max(props.page, 1), totalPages.value)
})

const pageItems = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const items: Array<number | 'ellipsis'> = []

  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) {
      items.push(i)
    }

    return items
  }

  items.push(1)

  if (current > 4) {
    items.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i += 1) {
    items.push(i)
  }

  if (current < total - 3) {
    items.push('ellipsis')
  }

  items.push(total)

  return items
})

const isPrevDisabled = computed(() => currentPage.value <= 1)
const isNextDisabled = computed(() => currentPage.value >= totalPages.value)

function emitChange(page: number, pageSize = props.pageSize) {
  emit('update:page', page)
  emit('update:pageSize', pageSize)
  emit('change', {
    page,
    pageSize
  })
}

function handlePageChange(page: number) {
  if (page < 1 || page > totalPages.value) return
  if (page === currentPage.value) return

  emitChange(page)
}

function handlePrev() {
  handlePageChange(currentPage.value - 1)
}

function handleNext() {
  handlePageChange(currentPage.value + 1)
}

function handlePageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const nextPageSize = Number(target.value)

  emitChange(1, nextPageSize)
}
</script>

<template>
  <div class="dt-pagination">
    <div
      v-if="showTotal"
      class="dt-pagination__total"
    >
      共 {{ total }} 条
    </div>

    <div class="dt-pagination__pager">
      <button
        class="dt-pagination__button"
        type="button"
        :disabled="isPrevDisabled"
        @click="handlePrev"
      >
        上一页
      </button>

      <template
        v-for="(item, index) in pageItems"
        :key="`${item}-${index}`"
      >
        <span
          v-if="item === 'ellipsis'"
          class="dt-pagination__ellipsis"
        >
          ...
        </span>

        <button
          v-else
          class="dt-pagination__page"
          :class="{ 'is-active': item === currentPage }"
          type="button"
          @click="handlePageChange(item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        class="dt-pagination__button"
        type="button"
        :disabled="isNextDisabled"
        @click="handleNext"
      >
        下一页
      </button>
    </div>

    <label
      v-if="showPageSize"
      class="dt-pagination__size"
    >
      <select
        class="dt-pagination__select"
        :value="pageSize"
        @change="handlePageSizeChange"
      >
        <option
          v-for="size in pageSizes"
          :key="size"
          :value="size"
        >
          {{ size }} 条/页
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped lang="scss">
.dt-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--dt-space-3);
  color: var(--dt-text-secondary);
  font-size: 14px;
}

.dt-pagination__total {
  margin-right: auto;
  color: var(--dt-text-muted);
}

.dt-pagination__pager {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-2);
}

.dt-pagination__button,
.dt-pagination__page {
  display: inline-flex;
  height: 32px;
  min-width: 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  color: var(--dt-text-secondary);
  background: var(--dt-bg-surface);
  cursor: pointer;
  font-size: 13px;
  transition: 0.18s ease;
}

.dt-pagination__button {
  padding: 0 10px;
}

.dt-pagination__button:hover:not(:disabled),
.dt-pagination__page:hover:not(.is-active) {
  color: var(--dt-color-primary);
  border-color: var(--dt-color-primary);
}

.dt-pagination__button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.dt-pagination__page.is-active {
  color: var(--dt-text-inverse);
  border-color: var(--dt-color-primary);
  background: var(--dt-color-primary);
}

.dt-pagination__ellipsis {
  display: inline-flex;
  height: 32px;
  min-width: 24px;
  align-items: center;
  justify-content: center;
  color: var(--dt-text-muted);
}

.dt-pagination__size {
  display: inline-flex;
  align-items: center;
}

.dt-pagination__select {
  height: 32px;
  padding: 0 30px 0 10px;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  outline: none;
  color: var(--dt-text-secondary);
  background: var(--dt-bg-surface);
  cursor: pointer;
  font-size: 13px;
}

.dt-pagination__select:focus {
  border-color: var(--dt-color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-primary) 14%, transparent);
}
</style>