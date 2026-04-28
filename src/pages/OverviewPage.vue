<script setup lang="ts">
import { ref } from 'vue'

import { DTButton, DTCard, DTModal, DTTag } from '@/shared/components'
import { message } from '@/shared/composables'

const modalOpen = ref(false)
const saving = ref(false)

function handleRefresh() {
  message.loading('正在刷新总览数据...')

  window.setTimeout(() => {
    message.clear()
    message.success('总览数据刷新成功')
  }, 1200)
}

function handleOpenModal() {
  modalOpen.value = true
}

function handleConfirm() {
  saving.value = true

  window.setTimeout(() => {
    saving.value = false
    modalOpen.value = false
    message.success('模拟保存成功')
  }, 1000)
}
</script>

<template>
  <div class="page page--overview">
    <section class="page-hero">
      <div>
        <h2>工业监控总览</h2>
        <p>这里后续放运行状态、趋势图、活动流和关键指标。</p>
      </div>

      <div class="page-hero__actions">
        <DTButton @click="handleOpenModal">
          打开弹窗
        </DTButton>

        <DTButton type="primary" @click="handleRefresh">
          刷新数据
        </DTButton>
      </div>
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

    <DTModal
      v-model:open="modalOpen"
      title="DTModal 测试"
      width="640px"
      confirm-text="保存"
      :loading="saving"
      @confirm="handleConfirm"
    >
      <p class="demo-modal-text">
        这是一个通用弹窗组件。后续新增配置、编辑配置、新增任务、导入配置都可以基于它实现。
      </p>
    </DTModal>
  </div>
</template>

<style scoped lang="scss">
.page-hero__actions {
  display: flex;
  gap: var(--dt-space-3);
  align-items: center;
}

.demo-modal-text {
  margin: 0;
  color: var(--dt-text-secondary);
  line-height: 1.7;
}
</style>