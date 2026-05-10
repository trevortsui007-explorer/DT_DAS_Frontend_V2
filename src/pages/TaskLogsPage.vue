<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { fetchTaskLogDetail, type AcquisitionLogItem, type TaskLogDetail, type TaskLogItem } from '@/api'
import { TaskLogsTable, TaskLogsToolbar, useTaskLogsList } from '@/features/logs'
import { DTCard, DTDrawer, DTPagination, DTTable, DTTag } from '@/shared/components'
import type { DTTableColumn, DTTableRow } from '@/shared/components'
import { message } from '@/shared/composables'

const {
  loading,
  pageNo,
  pageSize,
  total,
  status,
  taskId,
  startTime,
  endTime,
  statusOptions,
  taskOptions,
  logs,
  loadTaskLogs,
  handleSearch,
  handleReset,
  handlePageChange
} = useTaskLogsList()

const drawerOpen = ref(false)
const detailLoading = ref(false)
const selectedLog = ref<TaskLogDetail | null>(null)

const detailColumns: DTTableColumn[] = [
  { key: 'configId', title: '配置ID', width: 90 },
  { key: 'configName', title: '配置名称', minWidth: 130 },
  { key: 'fileName', title: '文件名', minWidth: 180 },
  { key: 'status', title: '状态', width: 100, align: 'center' },
  { key: 'processedRows', title: '处理行数', width: 110, align: 'right' },
  { key: 'startRow', title: '起始行', width: 90, align: 'right' },
  { key: 'errorMessage', title: '失败信息', minWidth: 260 }
]

const failedDetails = computed(() => {
  return (selectedLog.value?.details || []).filter((item) => item.status === 'Failed' || item.errorMessage)
})

function getStatusType(statusValue: unknown) {
  if (statusValue === 'Success') return 'success'
  if (statusValue === 'Failed') return 'danger'
  if (statusValue === 'Running') return 'primary'
  if (statusValue === 'Pending') return 'warning'

  return 'info'
}

function getStatusText(statusValue: unknown) {
  const map: Record<string, string> = {
    Success: '成功',
    Failed: '失败',
    Running: '运行中',
    Pending: '等待中',
    Cancelled: '已取消'
  }

  return map[String(statusValue)] || String(statusValue || '-')
}

async function handleView(row: TaskLogItem) {
  const id = row.taskLogId || row.id
  if (!id) return

  drawerOpen.value = true
  detailLoading.value = true
  selectedLog.value = row

  try {
    selectedLog.value = await fetchTaskLogDetail(id)
  } catch (error) {
    message.error('执行详情加载失败')
  } finally {
    detailLoading.value = false
  }
}

function getDetailRows() {
  return (selectedLog.value?.details || []) as AcquisitionLogItem[]
}

onMounted(() => {
  loadTaskLogs()
})
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <div>
        <h2>执行日志</h2>
        <p>查看历史执行记录、筛选任务状态和时间范围，并追踪每个文件的处理过程。</p>
      </div>
    </div>

    <DTCard>
      <TaskLogsToolbar
        v-model:status="status"
        v-model:task-id="taskId"
        v-model:start-time="startTime"
        v-model:end-time="endTime"
        :status-options="statusOptions"
        :task-options="taskOptions"
        @search="handleSearch"
        @reset="handleReset"
        @refresh="loadTaskLogs"
      />
    </DTCard>

    <DTCard>
      <TaskLogsTable
        :data="logs"
        :loading="loading"
        @view="handleView"
      />

      <div class="log-pagination">
        <DTPagination
          :page="pageNo"
          :page-size="pageSize"
          :total="total"
          @change="handlePageChange"
        />
      </div>
    </DTCard>

    <DTDrawer
      v-model:open="drawerOpen"
      title="执行详情"
      width="760px"
      destroy-on-close
    >
      <div v-if="selectedLog" class="log-detail">
        <section class="log-detail__summary">
          <div>
            <span>执行编号</span>
            <strong>{{ selectedLog.taskCode || selectedLog.taskLogId }}</strong>
          </div>
          <div>
            <span>任务</span>
            <strong>{{ selectedLog.taskName || `Task ${selectedLog.taskId}` }}</strong>
          </div>
          <div>
            <span>状态</span>
            <DTTag :type="getStatusType(selectedLog.status)">
              {{ getStatusText(selectedLog.status) }}
            </DTTag>
          </div>
          <div>
            <span>进度</span>
            <strong>{{ selectedLog.progress ?? 0 }}%</strong>
          </div>
          <div>
            <span>开始时间</span>
            <strong>{{ selectedLog.startTime || '-' }}</strong>
          </div>
          <div>
            <span>结束时间</span>
            <strong>{{ selectedLog.endTime || '进行中' }}</strong>
          </div>
        </section>

        <section v-if="failedDetails.length" class="log-detail__failures">
          <h3>失败信息</h3>
          <article
            v-for="item in failedDetails"
            :key="item.id"
          >
            <strong>{{ item.configName || `配置 ${item.configId}` }}</strong>
            <p>{{ item.errorMessage || selectedLog.message }}</p>
          </article>
        </section>

        <section class="log-detail__section">
          <h3>执行过程明细</h3>
          <DTTable
            :columns="detailColumns"
            :data="getDetailRows() as DTTableRow[]"
            :loading="detailLoading"
            row-key="id"
            empty-text="暂无过程明细"
          >
            <template #cell-status="{ value }">
              <DTTag :type="getStatusType(value)">
                {{ getStatusText(value) }}
              </DTTag>
            </template>

            <template #cell-errorMessage="{ value }">
              <span :class="{ 'is-error': value }">{{ value || '-' }}</span>
            </template>
          </DTTable>
        </section>
      </div>
    </DTDrawer>
  </div>
</template>

<style scoped lang="scss">
.log-pagination {
  margin-top: var(--dt-space-4);
}

.log-detail {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-5);
}

.log-detail__summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--dt-space-3);
}

.log-detail__summary div {
  min-width: 0;
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  background: var(--dt-bg-muted);
}

.log-detail__summary span {
  display: block;
  margin-bottom: 6px;
  color: var(--dt-text-muted);
  font-size: 12px;
}

.log-detail__summary strong {
  display: block;
  overflow-wrap: anywhere;
  color: var(--dt-text-primary);
  font-size: 14px;
}

.log-detail__failures,
.log-detail__section {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-3);
}

.log-detail__failures h3,
.log-detail__section h3 {
  margin: 0;
  font-size: 16px;
}

.log-detail__failures article {
  padding: var(--dt-space-3);
  border: 1px solid color-mix(in srgb, var(--dt-color-danger) 28%, var(--dt-border-subtle));
  border-radius: var(--dt-radius-md);
  background: color-mix(in srgb, var(--dt-color-danger) 8%, var(--dt-bg-surface));
}

.log-detail__failures p {
  margin: 6px 0 0;
  color: var(--dt-color-danger);
  font-size: 13px;
  line-height: 1.6;
}

.is-error {
  color: var(--dt-color-danger);
  white-space: normal;
}

@media (max-width: 720px) {
  .log-detail__summary {
    grid-template-columns: 1fr;
  }
}
</style>
