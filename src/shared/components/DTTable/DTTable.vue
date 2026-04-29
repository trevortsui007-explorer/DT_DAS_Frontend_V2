<script setup lang="ts">
import { computed } from 'vue'

import DTEmpty from '@/shared/components/DTEmpty'
import DTLoading from '@/shared/components/DTLoading'

export type DTTableColumn = {
  key: string
  title: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
}

export type DTTableRow = Record<string, unknown>

const props = withDefaults(
  defineProps<{
    columns: DTTableColumn[]
    data: DTTableRow[]
    rowKey?: string
    loading?: boolean
    border?: boolean
    stripe?: boolean
    height?: string | number
    emptyText?: string
  }>(),
  {
    rowKey: 'id',
    loading: false,
    border: false,
    stripe: true,
    height: '',
    emptyText: '暂无数据'
  }
)

const emit = defineEmits<{
  rowClick: [row: DTTableRow, index: number]
}>()

const hasData = computed(() => props.data.length > 0)

const tableStyle = computed(() => {
  if (!props.height) return {}

  const height = typeof props.height === 'number' ? `${props.height}px` : props.height

  return {
    maxHeight: height
  }
})

function getColumnStyle(column: DTTableColumn) {
  const style: Record<string, string> = {}

  if (column.width) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  }

  if (column.minWidth) {
    style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth
  }

  return style
}

function getCellValue(row: DTTableRow, key: string) {
  const value = row[key]

  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return String(value)
}

function getRowKey(row: DTTableRow, index: number) {
  const value = row[props.rowKey]

  if (value === null || value === undefined || value === '') {
    return index
  }

  return String(value)
}

function handleRowClick(row: DTTableRow, index: number) {
  emit('rowClick', row, index)
}
</script>

<template>
  <div
    class="dt-table"
    :class="{
      'dt-table--border': border,
      'dt-table--stripe': stripe
    }"
  >
    <div class="dt-table__inner" :style="tableStyle">
      <table class="dt-table__table">
        <thead class="dt-table__head">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="dt-table__th"
              :class="[
                `is-${column.align || 'left'}`,
                column.fixed ? `is-fixed-${column.fixed}` : ''
              ]"
              :style="getColumnStyle(column)"
            >
              <slot
                :name="`header-${column.key}`"
                :column="column"
              >
                {{ column.title }}
              </slot>
            </th>

            <th
              v-if="$slots.actions"
              class="dt-table__th is-right dt-table__actions-th"
            >
              操作
            </th>
          </tr>
        </thead>

        <tbody v-if="hasData && !loading" class="dt-table__body">
          <tr
            v-for="(row, rowIndex) in data"
            :key="getRowKey(row, rowIndex)"
            class="dt-table__tr"
            @click="handleRowClick(row, rowIndex)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="dt-table__td"
              :class="[
                `is-${column.align || 'left'}`,
                column.fixed ? `is-fixed-${column.fixed}` : ''
              ]"
              :style="getColumnStyle(column)"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="row[column.key]"
                :index="rowIndex"
              >
                {{ getCellValue(row, column.key) }}
              </slot>
            </td>

            <td
              v-if="$slots.actions"
              class="dt-table__td is-right dt-table__actions-td"
            >
              <slot
                name="actions"
                :row="row"
                :index="rowIndex"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="loading"
        class="dt-table__state"
      >
        <DTLoading text="正在加载数据..." />
      </div>

      <div
        v-else-if="!hasData"
        class="dt-table__state"
      >
        <DTEmpty
          size="sm"
          :title="emptyText"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dt-table {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-lg);
  background: var(--dt-bg-surface);
}

.dt-table__inner {
  position: relative;
  width: 100%;
  overflow: auto;
}

.dt-table__table {
  width: 100%;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.dt-table__head {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--dt-bg-muted);
}

.dt-table__th,
.dt-table__td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--dt-border-subtle);
  color: var(--dt-text-primary);
  font-size: 14px;
  line-height: 1.5;
  white-space: nowrap;
}

.dt-table__th {
  color: var(--dt-text-secondary);
  font-size: 13px;
  font-weight: 700;
  text-align: left;
}

.dt-table__td {
  background: var(--dt-bg-surface);
}

.dt-table__tr {
  cursor: default;
  transition: background 0.18s ease;
}

.dt-table__tr:hover .dt-table__td {
  background: color-mix(in srgb, var(--dt-bg-muted) 52%, transparent);
}

.dt-table--stripe .dt-table__tr:nth-child(even) .dt-table__td {
  background: color-mix(in srgb, var(--dt-bg-muted) 34%, transparent);
}

.dt-table--stripe .dt-table__tr:nth-child(even):hover .dt-table__td {
  background: color-mix(in srgb, var(--dt-bg-muted) 58%, transparent);
}

.dt-table--border .dt-table__th,
.dt-table--border .dt-table__td {
  border-right: 1px solid var(--dt-border-subtle);
}

.dt-table--border .dt-table__th:last-child,
.dt-table--border .dt-table__td:last-child {
  border-right: none;
}

.dt-table__body .dt-table__tr:last-child .dt-table__td {
  border-bottom: none;
}

.is-left {
  text-align: left;
}

.is-center {
  text-align: center;
}

.is-right {
  text-align: right;
}

.dt-table__actions-th,
.dt-table__actions-td {
  width: 1%;
  min-width: 120px;
}

.dt-table__state {
  display: flex;
  min-height: 220px;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--dt-border-subtle);
}

.is-fixed-left {
  position: sticky;
  left: 0;
  z-index: 1;
}

.is-fixed-right {
  position: sticky;
  right: 0;
  z-index: 1;
}
</style>