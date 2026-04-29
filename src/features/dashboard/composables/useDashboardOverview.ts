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

  /**
   * 汇总统计信息
   * 优化：将三次遍历合并为一次 reduce 循环
   */
  const stats = computed(() => {
    const totals = trend.value.reduce(
      (acc, item) => {
        acc.totalTasks += item.successCount + item.failureCount
        acc.successCount += item.successCount
        acc.failedCount += item.failureCount
        return acc
      },
      { totalTasks: 0, successCount: 0, failedCount: 0 }
    )

    const successRate = totals.totalTasks > 0
      ? Number(((totals.successCount / totals.totalTasks) * 100).toFixed(1))
      : 0

    const runningCount = activities.value.filter(
      (item) => item.status === 'Running'
    ).length

    return {
      totalTasks: totals.totalTasks,
      successRate,
      runningCount,
      failedCount: totals.failedCount
    }
  })

  /**
   * 加载概览数据
   */
  async function loadOverview() {
    // 避免重复加载
    if (loading.value) return
    
    loading.value = true

    try {
      // 由于 request.ts 已经处理了类型扩展和 .data 拦截
      // 这里的结果直接就是数组类型
      const [trendData, activityData] = await Promise.all([
        fetchOverviewTrend(),
        fetchOverviewActivities()
      ])

      trend.value = trendData
      activities.value = activityData
    } catch (error) {
      console.error('Failed to load dashboard overview:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    trend,
    activities,
    stats,
    loadOverview
  }
}