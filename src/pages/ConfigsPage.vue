<script setup lang="ts">
import { DTCard, DTButton } from '@/shared/components'
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <div>
        <h2>配置管理</h2>
        <p>后续迁移文件配置、导入、探测、详情抽屉等功能。</p>
      </div>

      <DTButton type="primary">新增配置</DTButton>
    </div>

    <DTCard>
      <div class="placeholder-box">Configs Table Placeholder</div>
    </DTCard>
  </div>
</template>