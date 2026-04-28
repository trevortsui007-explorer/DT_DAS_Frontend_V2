<script setup lang="ts">
import { DTCard, DTButton, DTTag } from '@/shared/components'
import { message } from '@/shared/composables'

function handleRefresh() {
  message.loading('正在刷新总览数据...')

  window.setTimeout(() => {
    message.clear()
    message.success('总览数据刷新成功')
  }, 1200)
}
</script>

<template>
  <div class="page page--overview">
    <section class="page-hero">
      <div>
        <h2>工业监控总览</h2>
        <p>这里后续放运行状态、趋势图、活动流和关键指标。</p>
      </div>

      <DTButton type="primary" @click="handleRefresh">
        刷新数据
      </DTButton>
    </section>

    <div class="overview-grid">
      <DTCard title="今日采集任务">
        <div class="metric-value">128</div>
        <DTTag type="success">正常</DTTag>
      </DTCard>

      <DTCard title="执行成功率">
        <div class="metric-value">98.6%</div>
        <DTTag type="success">稳定</DTTag>
      </DTCard>

      <DTCard title="失败任务">
        <div class="metric-value">3</div>
        <DTTag type="danger">需关注</DTTag>
      </DTCard>
    </div>
  </div>
</template>