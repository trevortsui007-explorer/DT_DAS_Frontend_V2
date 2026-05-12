<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useDashboardOverview } from '@/features/dashboard'
import {
  DTButton,
  DTCard,
  DTEmpty,
  DTFlowTimeline,
  DTLineChart,
  DTLoading,
  DTPieChart,
  DTTag
} from '@/shared/components'
import type {
  DTFlowTimelineItem,
  DTLineChartPoint,
  DTPieChartSegment
} from '@/shared/components'
import { message } from '@/shared/composables'
import { deferInitialLoad } from '@/shared/utils/defer'

const {
  loading,
  trend,
  recentActivities,
  abnormalActivities,
  stats,
  loadOverview
} = useDashboardOverview()

const systemHealth = computed(() => {
  if (stats.value.runningCount > 0) return { type: 'primary' as const, text: '采集中', desc: '存在正在执行的采集任务' }
  if (stats.value.failedCount > 0) return { type: 'warning' as const, text: '需关注', desc: '近期存在失败记录，请查看异常提醒' }

  return { type: 'success' as const, text: '运行稳定', desc: '采集服务与调度状态正常' }
})

function getStatusType(status: string) {
  if (status === 'Success') return 'success'
  if (status === 'Failed') return 'danger'
  if (status === 'Running') return 'primary'

  return 'info'
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    Success: '成功',
    Failed: '失败',
    Running: '运行中',
    Pending: '等待中'
  }

  return map[status] || status
}

async function handleRefresh() {
  const close = message.loading('正在刷新总览数据...')

  try {
    await loadOverview()
    message.success('总览数据刷新成功')
  } finally {
    close()
  }
}

onMounted(() => {
  deferInitialLoad(loadOverview)
})

const trendLineData = computed<DTLineChartPoint[]>(() => {
  return trend.value.map((item) => ({
    label: item.date.slice(5),
    value: item.successCount + item.failureCount + (item.runningCount || 0)
  }))
})

const statusPieData = computed<DTPieChartSegment[]>(() => {
  return [
    {
      label: '成功',
      value: trend.value.reduce((sum, item) => sum + item.successCount, 0),
      color: 'var(--dt-color-success)'
    },
    {
      label: '失败',
      value: trend.value.reduce((sum, item) => sum + item.failureCount, 0),
      color: 'var(--dt-color-danger)'
    },
    {
      label: '执行中',
      value: trend.value.reduce((sum, item) => sum + (item.runningCount || 0), 0),
      color: 'var(--dt-color-primary)'
    }
  ]
})

const timelineItems = computed<DTFlowTimelineItem[]>(() => {
  return recentActivities.value.map((item) => ({
    title: item.title,
    description: item.taskCode || item.message || '采集任务已进入执行链路',
    time: item.time,
    status: getStatusType(item.status)
  }))
})
</script>

<template>
  <div class="page page--overview">
    <section class="page-hero overview-hero">
      <div>
        <h2>数据采集总览</h2>
        <p>集中查看今日任务、执行成功率、异常提醒与系统运行状态。</p>
      </div>

      <DTButton type="primary" :disabled="loading" @click="handleRefresh">
        刷新数据
      </DTButton>
    </section>

    <div v-if="loading && trend.length === 0" class="overview-loading">
      <DTLoading text="正在加载总览数据..." />
    </div>

    <template v-else>
      <section class="overview-grid overview-grid--stats">
        <DTCard>
          <div class="metric-card">
            <span>今日任务数</span>
            <strong>{{ stats.todayTasks ?? 0 }}</strong>
            <DTTag type="primary">今日</DTTag>
          </div>
        </DTCard>

        <DTCard>
          <div class="metric-card">
            <span>成功率</span>
            <strong>{{ stats.successRate ?? 0 }}%</strong>
            <DTTag type="success">已完成任务</DTTag>
          </div>
        </DTCard>

        <DTCard>
          <div class="metric-card">
            <span>失败数</span>
            <strong>{{ stats.failedCount ?? 0 }}</strong>
            <DTTag :type="(stats.failedCount ?? 0) > 0 ? 'danger' : 'success'">
              {{ (stats.failedCount ?? 0) > 0 ? '需处理' : '正常' }}
            </DTTag>
          </div>
        </DTCard>

        <DTCard>
          <div class="metric-card">
            <span>执行中</span>
            <strong>{{ stats.runningCount ?? 0 }}</strong>
            <DTTag :type="systemHealth.type">
              {{ systemHealth.text }}
            </DTTag>
          </div>
        </DTCard>
      </section>

      <section class="overview-layout">
        <DTCard title="执行趋势">
          <DTLineChart
            v-if="trendLineData.length"
            :data="trendLineData"
            :height="240"
          />
          <DTEmpty v-else size="sm" title="暂无趋势数据" />
        </DTCard>

        <DTCard title="系统运行状态">
          <div class="system-status">
            <div class="system-status__badge">
              DT
            </div>
            <div>
              <DTTag :type="systemHealth.type">
                {{ systemHealth.text }}
              </DTTag>
              <h3>{{ systemHealth.desc }}</h3>
              <p>Mock 数据已覆盖配置、分组、任务、任务日志和过程明细，便于前端独立联调。</p>
            </div>
          </div>
        </DTCard>
      </section>

      <section class="overview-layout">
        <DTCard title="状态分布">
          <DTPieChart
            v-if="trend.length"
            :data="statusPieData"
            center-label="执行总数"
            :center-value="stats.totalTasks ?? 0"
          />
          <DTEmpty v-else size="sm" title="暂无状态数据" />
        </DTCard>

        <DTCard title="采集时序流">
          <DTFlowTimeline
            v-if="timelineItems.length"
            :items="timelineItems"
          />
          <DTEmpty v-else size="sm" title="暂无时序数据" />
        </DTCard>
      </section>

      <section class="overview-layout">
        <DTCard title="最近执行记录">
          <div class="activity-list">
            <article
              v-for="item in recentActivities"
              :key="item.id"
              class="activity-item"
            >
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.taskCode || item.message || '-' }}</p>
              </div>
              <div class="activity-item__meta">
                <DTTag :type="getStatusType(item.status)">
                  {{ getStatusText(item.status) }}
                </DTTag>
                <span>{{ item.time }}</span>
              </div>
            </article>
          </div>
        </DTCard>

        <DTCard title="异常任务提醒">
          <div v-if="abnormalActivities.length" class="alert-list">
            <article
              v-for="item in abnormalActivities"
              :key="item.id"
              class="alert-item"
            >
              <strong>{{ item.title }}</strong>
              <p>{{ item.message || '执行失败，请查看日志详情。' }}</p>
              <span>{{ item.time }}</span>
            </article>
          </div>
          <DTEmpty v-else size="sm" title="暂无异常任务" />
        </DTCard>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.overview-hero {
  padding-bottom: var(--dt-space-2);
}

.overview-loading {
  display: grid;
  min-height: 360px;
  place-items: center;
}

.overview-grid--stats {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card {
  display: grid;
  gap: var(--dt-space-3);
}

.metric-card span {
  color: var(--dt-text-secondary);
  font-size: 13px;
}

.metric-card strong {
  color: var(--dt-text-primary);
  font-size: 34px;
  line-height: 1;
}

.overview-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.8fr);
  gap: var(--dt-space-4);
}

.system-status {
  display: flex;
  gap: var(--dt-space-4);
  align-items: flex-start;
}

.system-status__badge {
  display: grid;
  width: 56px;
  height: 56px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: var(--dt-radius-lg);
  color: var(--dt-text-inverse);
  background: var(--dt-color-primary);
  font-weight: 800;
}

.system-status h3 {
  margin: var(--dt-space-3) 0 var(--dt-space-2);
  font-size: 18px;
}

.system-status p {
  margin: 0;
  color: var(--dt-text-secondary);
  line-height: 1.6;
}

.activity-list,
.alert-list {
  display: grid;
  gap: var(--dt-space-3);
}

.activity-item,
.alert-item {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-3);
  padding: var(--dt-space-3);
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  background: var(--dt-bg-muted);
}

.activity-item strong,
.alert-item strong {
  display: block;
  margin-bottom: 4px;
}

.activity-item p,
.alert-item p {
  margin: 0;
  color: var(--dt-text-secondary);
  font-size: 13px;
}

.activity-item__meta {
  display: grid;
  flex: 0 0 auto;
  gap: var(--dt-space-2);
  justify-items: end;
  color: var(--dt-text-muted);
  font-size: 12px;
}

.alert-item {
  display: grid;
  border-color: color-mix(in srgb, var(--dt-color-danger) 28%, var(--dt-border-subtle));
  background: color-mix(in srgb, var(--dt-color-danger) 8%, var(--dt-bg-surface));
}

.alert-item span {
  color: var(--dt-text-muted);
  font-size: 12px;
}

@media (max-width: 1100px) {
  .overview-grid--stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .overview-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .overview-grid--stats {
    grid-template-columns: 1fr;
  }

  .activity-item {
    display: grid;
  }

  .activity-item__meta {
    justify-items: start;
  }
}
</style>
