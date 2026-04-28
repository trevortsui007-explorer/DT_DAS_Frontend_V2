<script setup lang="ts">
import { DTCard, DTButton } from '@/shared/components'
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <div>
        <h2>执行日志</h2>
        <p>后续迁移历史任务、分页、轮询、状态详情等功能。</p>
      </div>

      <DTButton>筛选</DTButton>
    </div>

    <DTCard>
      <div class="placeholder-box">Task Logs Placeholder</div>
    </DTCard>
  </div>
</template>