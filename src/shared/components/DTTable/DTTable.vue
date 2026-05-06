<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import DTEmpty from '@/shared/components/DTEmpty'
import DTLoading from '@/shared/components/DTLoading'
import DTPagination from '@/shared/components/DTPagination'

// --- 类型定义 ---
export type DTTableColumn = {
  key: string
  type?: 'default' | 'selection' | 'expand'
  title?: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: boolean | 'custom'
  showOverflowTooltip?: boolean
}

export type DTTableRow = Record<string, unknown>

export type PaginationConfig = {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
  showPageSize?: boolean
  showTotal?: boolean
}

// --- Props ---
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
    pagination?: PaginationConfig
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

// --- Emits ---
const emit = defineEmits<{
  rowClick: [row: DTTableRow, index: number]
  selectionChange: [selectedRows: DTTableRow[]]
  sortChange: [payload: { column: DTTableColumn; prop: string; order: 'asc' | 'desc' | null }]
  'update:pagination': [config: PaginationConfig]
  pageChange: [page: number, pageSize: number]
}>()

// --- Slots 强类型定义 ---
defineSlots<{
  [key: `cell-${string}`]: (props: { row: DTTableRow; column: DTTableColumn; value: any; index: number }) => any
  [key: `header-${string}`]: (props: { column: DTTableColumn }) => any
  expand: (props: { row: DTTableRow; index: number }) => any
}>()

// --- 状态管理 ---
const activeRowKey = ref<string | number | null>(null)
const selectedRowKeys = ref<Set<string | number>>(new Set())
const expandedRowKeys = ref<Set<string | number>>(new Set())
const sortState = ref<{ key: string; order: 'asc' | 'desc' | null }>({ key: '', order: null })

const tableWrapperRef = ref<HTMLElement | null>(null)
const scrollState = ref({ isLeft: true, isRight: false })

// --- 计算属性 ---
const hasData = computed(() => props.data.length > 0)

const tableStyle = computed(() => {
  if (!props.height) return {}
  return { maxHeight: typeof props.height === 'number' ? `${props.height}px` : props.height }
})

const normalizedColumns = computed(() => {
  let leftOffset = 0
  let rightOffset = 0
  
  const cols = props.columns.map((col) => ({ 
    ...col, 
    _style: {} as Record<string, string>,
    _isLastLeftFixed: false,
    _isFirstRightFixed: false
  }))

  for (let i = 0; i < cols.length; i++) {
    const col = cols[i]
    if (col.width) col._style.width = typeof col.width === 'number' ? `${col.width}px` : col.width
    if (col.minWidth) col._style.minWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth
    
    if (col.fixed === 'left') {
      col._style.left = `${leftOffset}px`
      leftOffset += parseInt(String(col.width || col.minWidth || 50))
      col._isLastLeftFixed = i === cols.length - 1 || cols[i + 1].fixed !== 'left'
    }
  }

  for (let i = cols.length - 1; i >= 0; i--) {
    const col = cols[i]
    if (col.fixed === 'right') {
      col._style.right = `${rightOffset}px`
      rightOffset += parseInt(String(col.width || col.minWidth || 50))
      col._isFirstRightFixed = i === 0 || cols[i - 1].fixed !== 'right'
    }
  }

  return cols
})

function getCellValue(row: DTTableRow, key: string) {
  if (!key) return '-'
  const value = key.split('.').reduce<any>((acc, cur) => acc?.[cur], row)
  return (value === null || value === undefined || value === '') ? '-' : String(value)
}

function getRowKey(row: DTTableRow, index: number) {
  // 使用 as any 让未知类型的 value 可以安全判空
  const value = row[props.rowKey] as any
  return (value === null || value === undefined || value === '') ? index : value
}

function handleRowClick(row: DTTableRow, index: number) {
  activeRowKey.value = getRowKey(row, index)
  emit('rowClick', row, index)
}

function handleSort(column: DTTableColumn) {
  if (!column.sortable) return
  const currentOrder = sortState.value.key === column.key ? sortState.value.order : null
  const nextOrder = currentOrder === 'asc' ? 'desc' : currentOrder === 'desc' ? null : 'asc'
  
  sortState.value = { key: column.key, order: nextOrder }
  emit('sortChange', { column, prop: column.key, order: nextOrder })
}

function toggleExpand(row: DTTableRow, index: number) {
  const key = getRowKey(row, index)
  if (expandedRowKeys.value.has(key)) {
    expandedRowKeys.value.delete(key)
  } else {
    expandedRowKeys.value.add(key)
  }
}

// 多选处理
const isAllSelected = computed(() => {
  if (!hasData.value) return false
  return props.data.every((row, i) => selectedRowKeys.value.has(getRowKey(row, i)))
})

const isIndeterminate = computed(() => {
  return selectedRowKeys.value.size > 0 && !isAllSelected.value
})

function handleSelectAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  if (checked) {
    props.data.forEach((row, i) => selectedRowKeys.value.add(getRowKey(row, i)))
  } else {
    selectedRowKeys.value.clear()
  }
  emitSelection()
}

function toggleSelect(row: DTTableRow, index: number) {
  const key = getRowKey(row, index)
  if (selectedRowKeys.value.has(key)) {
    selectedRowKeys.value.delete(key)
  } else {
    selectedRowKeys.value.add(key)
  }
  emitSelection()
}

function emitSelection() {
  const selectedRows = props.data.filter((row, i) => selectedRowKeys.value.has(getRowKey(row, i)))
  emit('selectionChange', selectedRows)
}

// 滚动阴影检测
function handleScroll() {
  if (!tableWrapperRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = tableWrapperRef.value
  scrollState.value.isLeft = scrollLeft === 0
  scrollState.value.isRight = Math.ceil(scrollLeft + clientWidth) >= scrollWidth
}

function handlePaginationChange(payload: { page: number; pageSize: number }) {
  if (!props.pagination) return
  emit('update:pagination', { ...props.pagination, ...payload })
  emit('pageChange', payload.page, payload.pageSize)
}

onMounted(() => {
  if (tableWrapperRef.value) {
    tableWrapperRef.value.addEventListener('scroll', handleScroll)
    handleScroll()
  }
})

onBeforeUnmount(() => {
  if (tableWrapperRef.value) {
    tableWrapperRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="dt-table-container">
    <div
      class="dt-table"
      :class="{
        'dt-table--border': border,
        'dt-table--stripe': stripe,
        'is-scrolling-none': scrollState.isLeft && scrollState.isRight,
        'is-scrolling-left': scrollState.isLeft && !scrollState.isRight,
        'is-scrolling-right': !scrollState.isLeft && scrollState.isRight,
        'is-scrolling-middle': !scrollState.isLeft && !scrollState.isRight
      }"
    >
      <div class="dt-table__inner" :style="tableStyle" ref="tableWrapperRef">
        <table class="dt-table__table">
          <colgroup>
            <col
              v-for="column in normalizedColumns"
              :key="`col-${column.key}`"
              :width="column.width || column.minWidth"
            />
          </colgroup>

          <thead class="dt-table__head">
            <tr>
              <th
                v-for="column in normalizedColumns"
                :key="column.key"
                class="dt-table__th"
                :class="[
                  `is-${column.align || 'left'}`,
                  column.fixed ? `is-fixed-${column.fixed}` : '',
                  { 'is-sortable': column.sortable },
                  { 'is-last-left': (column as any)._isLastLeftFixed },
                  { 'is-first-right': (column as any)._isFirstRightFixed }
                ]"
                :style="column._style"
                @click="handleSort(column)"
              >
                <template v-if="column.type === 'selection'">
                  <input
                    type="checkbox"
                    class="dt-checkbox"
                    :checked="isAllSelected"
                    :indeterminate="isIndeterminate"
                    @click.stop
                    @change="handleSelectAll"
                  />
                </template>

                <div class="dt-table__th-content" v-else>
                  <slot :name="`header-${column.key}`" :column="column">
                    {{ column.title }}
                  </slot>
                  <span v-if="column.sortable" class="dt-table__sort-icon" :class="[sortState.key === column.key ? sortState.order : '']">
                    <i class="sort-up"></i>
                    <i class="sort-down"></i>
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody v-if="hasData" class="dt-table__body">
            <template v-for="(row, rowIndex) in data" :key="getRowKey(row, rowIndex)">
              <tr
                class="dt-table__tr"
                :class="{ 'is-active-row': activeRowKey === getRowKey(row, rowIndex) }"
                @click="handleRowClick(row, rowIndex)"
              >
                <td
                  v-for="column in normalizedColumns"
                  :key="column.key"
                  class="dt-table__td"
                  :class="[
                    `is-${column.align || 'left'}`,
                    column.fixed ? `is-fixed-${column.fixed}` : '',
                    { 'is-last-left': (column as any)._isLastLeftFixed },
                    { 'is-first-right': (column as any)._isFirstRightFixed }
                  ]"
                  :style="column._style"
                >
                  <template v-if="column.type === 'selection'">
                    <input
                      type="checkbox"
                      class="dt-checkbox"
                      :checked="selectedRowKeys.has(getRowKey(row, rowIndex))"
                      @click.stop
                      @change="toggleSelect(row, rowIndex)"
                    />
                  </template>

                  <template v-else-if="column.type === 'expand'">
                    <button class="dt-table__expand-btn" :class="{ 'is-expanded': expandedRowKeys.has(getRowKey(row, rowIndex)) }" @click.stop="toggleExpand(row, rowIndex)">
                      ▶
                    </button>
                  </template>

                  <div
                    v-else
                    class="dt-table__cell"
                    :class="{ 'is-ellipsis': column.showOverflowTooltip }"
                    :title="column.showOverflowTooltip ? getCellValue(row, column.key) : undefined"
                  >
                    <slot
                      :name="`cell-${column.key}`"
                      :row="row"
                      :column="column"
                      :value="getCellValue(row, column.key)"
                      :index="rowIndex"
                    >
                      {{ getCellValue(row, column.key) }}
                    </slot>
                  </div>
                </td>
              </tr>

              <tr v-if="expandedRowKeys.has(getRowKey(row, rowIndex))" class="dt-table__expand-tr">
                <td class="dt-table__td dt-table__expand-td" :colspan="normalizedColumns.length">
                  <div class="dt-table__expand-content">
                    <slot name="expand" :row="row" :index="rowIndex"></slot>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <div v-if="!hasData && !loading" class="dt-table__empty">
          <DTEmpty size="sm" :title="emptyText" />
        </div>
      </div>

      <div v-if="loading" class="dt-table__loading-mask">
        <DTLoading text="正在加载..." />
      </div>
    </div>

    <div v-if="pagination" class="dt-table__pagination-wrapper">
      <DTPagination
        :page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="pagination.pageSizes"
        :show-page-size="pagination.showPageSize"
        :show-total="pagination.showTotal"
        @change="handlePaginationChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
$border-color: var(--dt-border-subtle, #e4e4e7);
$bg-surface: var(--dt-bg-surface, #ffffff);
$bg-muted: var(--dt-bg-muted, #f4f4f5);
$primary-color: var(--dt-color-primary, #3b82f6);
$primary-light: color-mix(in srgb, var(--dt-color-primary, #3b82f6) 10%, transparent);

.dt-table-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dt-table {
  position: relative;
  width: 100%;
  border: 1px solid $border-color;
  border-radius: 8px;
  background: $bg-surface;
  overflow: hidden;
}

.dt-table__inner {
  width: 100%;
  overflow: auto;
}

.dt-table__table {
  width: 100%;
  min-width: 100%;
  table-layout: fixed; 
  border-collapse: separate;
  border-spacing: 0;
}

.dt-table__head th {
  position: sticky;
  top: 0;
  z-index: 3;
  background: $bg-muted;
}

.dt-table__th,
.dt-table__td {
  padding: 12px 14px;
  border-bottom: 1px solid $border-color;
  box-sizing: border-box;
}

.dt-table__th {
  color: var(--dt-text-secondary, #52525b);
  font-size: 13px;
  font-weight: 700;
  user-select: none;
}

.dt-table__td {
  background: $bg-surface;
  color: var(--dt-text-primary, #18181b);
  font-size: 14px;
}

/* UX: 行悬浮与选中高亮 */
.dt-table__tr {
  transition: background 0.2s ease;
}

.dt-table__tr:hover .dt-table__td {
  background: color-mix(in srgb, $bg-muted 60%, transparent);
}

.dt-table__tr.is-active-row .dt-table__td {
  background: $primary-light;
}

/* 斑马纹 */
.dt-table--stripe .dt-table__tr:nth-child(even):not(.is-active-row) .dt-table__td {
  background: color-mix(in srgb, $bg-muted 30%, transparent);
}

/* 文本溢出隐藏 (Tooltip前置条件) */
.is-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-table__cell {
  width: 100%;
}

/* 对齐 */
.is-left { text-align: left; }
.is-center { text-align: center; }
.is-right { text-align: right; }

/* --- 排序样式 --- */
.is-sortable {
  cursor: pointer;
}
.dt-table__th-content {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.dt-table__sort-icon {
  display: flex;
  flex-direction: column;
  gap: 2px;
  i {
    border: 4px solid transparent;
    width: 0; height: 0;
    opacity: 0.3;
  }
  .sort-up { border-bottom-color: currentColor; border-top: none; }
  .sort-down { border-top-color: currentColor; border-bottom: none; }
  
  &.asc .sort-up { opacity: 1; color: $primary-color; }
  &.desc .sort-down { opacity: 1; color: $primary-color; }
}

/* --- 固定列与滚动阴影 --- */
.is-fixed-left,
.is-fixed-right {
  position: sticky;
  z-index: 1;
}

.dt-table__head .is-fixed-left,
.dt-table__head .is-fixed-right {
  z-index: 4; /* 表头固定列要高于普通固定列 */
}

/* 滚动阴影动效 */
.is-last-left::after,
.is-first-right::before {
  content: "";
  position: absolute;
  top: 0; bottom: 0; width: 10px;
  pointer-events: none;
  transition: box-shadow 0.3s;
}
.is-last-left::after { right: -10px; }
.is-first-right::before { left: -10px; }

.is-scrolling-middle .is-last-left::after,
.is-scrolling-right .is-last-left::after {
  box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.15);
}
.is-scrolling-middle .is-first-right::before,
.is-scrolling-left .is-first-right::before {
  box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
}

/* --- 展开行与复选框 --- */
.dt-checkbox {
  cursor: pointer;
}
.dt-table__expand-btn {
  background: none; border: none; cursor: pointer;
  color: var(--dt-text-muted, #a1a1aa);
  transition: transform 0.2s;
  font-size: 12px;
}
.dt-table__expand-btn.is-expanded {
  transform: rotate(90deg);
}
.dt-table__expand-td {
  padding: 0px;
  background: $bg-muted;
}
.dt-table__expand-content {
  box-shadow: none;
  border-radius: 0px;
  background: $bg-muted;
  padding: 0px;
}

/* --- 状态视图 --- */
.dt-table__empty {
  padding: 40px 0; /* 自动适配高度 */
  display: flex;
  justify-content: center;
}

.dt-table__loading-mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

/* 分页容器 */
.dt-table__pagination-wrapper {
  padding: 8px 4px;
}
</style>