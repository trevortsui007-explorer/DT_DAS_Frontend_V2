import { computed, ref } from 'vue'

import {
  fetchOverviewActivities,
  fetchOverviewTrend,
  type OverviewActivityItem,
  type OverviewTrendItem
} from '@/api'

export function useDashboardOverview() {
  const loading = ref(false)
  const trend = ref<OverviewTrendItem[]>([])
  const activities = ref<OverviewActivityItem[]>([])

  const today = '2026-05-10'

  const stats = computed(() => {
    const totals = trend.value.reduce(
      (acc, item) => {
        const totalOfDay = item.successCount + item.failureCount + (item.runningCount || 0)

        acc.totalTasks += totalOfDay
        acc.successCount += item.successCount
        acc.failedCount += item.failureCount
        acc.runningCount += item.runningCount || 0

        if (item.date === today) {
          acc.todayTasks = totalOfDay
        }

        return acc
      },
      {
        totalTasks: 0,
        todayTasks: 0,
        successCount: 0,
        failedCount: 0,
        runningCount: 0
      }
    )

    const completed = totals.successCount + totals.failedCount
    const successRate = completed > 0
      ? Number(((totals.successCount / completed) * 100).toFixed(1))
      : 0

    return {
      totalTasks: totals.totalTasks,
      todayTasks: totals.todayTasks,
      successRate,
      runningCount: totals.runningCount,
      failedCount: totals.failedCount,
      abnormalCount: activities.value.filter((item) => item.status === 'Failed').length
    }
  })

  const recentActivities = computed(() => activities.value.slice(0, 5))
  const abnormalActivities = computed(() => activities.value.filter((item) => item.status === 'Failed').slice(0, 3))

  async function loadOverview() {
    if (loading.value) return

    loading.value = true

    try {
      const [trendData, activityData] = await Promise.all([
        fetchOverviewTrend(),
        fetchOverviewActivities()
      ])

      trend.value = trendData
      activities.value = activityData
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    trend,
    activities,
    recentActivities,
    abnormalActivities,
    stats,
    loadOverview
  }
}
