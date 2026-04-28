<script setup lang="ts">
import { DTCard, DTButton } from '@/shared/components'
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <div>
        <h2>任务管理</h2>
        <p>后续迁移任务列表、任务编辑、任务分组绑定等功能。</p>
      </div>

      <DTButton type="primary">新增任务</DTButton>
    </div>

    <DTCard>
      <div class="placeholder-box">Tasks Table Placeholder</div>
    </DTCard>
  </div>
</template>