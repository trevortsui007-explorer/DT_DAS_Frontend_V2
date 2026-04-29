<script setup lang="ts">
import { ref } from 'vue'

import {
  DTButton,
  DTCard,
  DTDrawer,
  DTEmpty,
  DTInput,
  DTLoading,
  DTModal,
  DTSelect,
  DTTag
} from '@/shared/components'

import type { DTSelectOption, DTSelectValue } from '@/shared/components'
import { message } from '@/shared/composables'

const modalOpen = ref(false)
const drawerOpen = ref(false)
const saving = ref(false)

const configName = ref('')
const configStatus = ref<DTSelectValue | ''>('')

const statusOptions: DTSelectOption[] = [
  { label: '全部状态', value: 'all' },
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' }
]

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

function handleOpenDrawer() {
  drawerOpen.value = true
}

function handleConfirm() {
  saving.value = true

  window.setTimeout(() => {
    saving.value = false
    modalOpen.value = false
    drawerOpen.value = false
    message.success('模拟保存成功')
  }, 1000)
}

function handleSearch() {
  message.info(`搜索条件：${configName.value || '未输入'} / ${configStatus.value || '未选择'}`)
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
        <DTButton @click="handleOpenDrawer">
          打开抽屉
        </DTButton>

        <DTButton @click="handleOpenModal">
          打开弹窗
        </DTButton>

        <DTButton type="primary" @click="handleRefresh">
          刷新数据
        </DTButton>
      </div>
    </section>

    <DTCard title="表单组件测试">
      <div class="form-demo">
        <DTInput
          v-model="configName"
          placeholder="请输入配置名称"
          clearable
        />

        <DTSelect
          v-model="configStatus"
          :options="statusOptions"
          placeholder="请选择状态"
          clearable
        />

        <DTButton type="primary" @click="handleSearch">
          查询
        </DTButton>
      </div>
    </DTCard>

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
      <div class="modal-form">
        <DTInput
          v-model="configName"
          placeholder="请输入配置名称"
          clearable
        />

        <DTSelect
          v-model="configStatus"
          :options="statusOptions"
          placeholder="请选择状态"
          clearable
        />
      </div>
    </DTModal>

    <DTDrawer
      v-model:open="drawerOpen"
      title="DTDrawer 测试"
      width="520px"
      show-footer
      confirm-text="保存"
      :loading="saving"
      @confirm="handleConfirm"
    >
      <template #description>
        适合详情、日志、预览、辅助配置等场景。
      </template>

      <div class="drawer-demo">
        <DTCard title="筛选条件">
          <div class="modal-form">
            <DTInput
              v-model="configName"
              placeholder="请输入配置名称"
              clearable
            />

            <DTSelect
              v-model="configStatus"
              :options="statusOptions"
              placeholder="请选择状态"
              clearable
            />
          </div>
        </DTCard>

        <DTCard title="配置详情">
          <div class="detail-list">
            <div class="detail-row">
              <span>配置名称</span>
              <strong>{{ configName || 'MES 数据采集配置' }}</strong>
            </div>

            <div class="detail-row">
              <span>状态</span>
              <DTTag type="success">
                {{ configStatus || '启用' }}
              </DTTag>
            </div>
          </div>
        </DTCard>
      </div>
    </DTDrawer>
    <DTCard title="状态组件测试">
      <div class="state-demo">
        <DTEmpty
          title="暂无执行日志"
          description="当前筛选条件下没有找到任务执行记录。"
        >
          <template #action>
            <DTButton type="primary" size="sm">
              重新加载
            </DTButton>
          </template>
        </DTEmpty>

        <div class="loading-demo">
          <DTLoading text="正在加载任务数据..." />
        </div>
      </div>
    </DTCard>
  </div>
</template>

<style scoped lang="scss">
.page-hero__actions {
  display: flex;
  gap: var(--dt-space-3);
  align-items: center;
}

.form-demo {
  display: grid;
  grid-template-columns: minmax(0, 240px) minmax(0, 180px) auto;
  gap: var(--dt-space-3);
  align-items: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.drawer-demo {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-3);
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
  color: var(--dt-text-secondary);
}

.detail-row strong {
  color: var(--dt-text-primary);
  font-weight: 600;
}

.state-demo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--dt-space-4);
}

.loading-demo {
  position: relative;
  min-height: 220px;
  border: 1px dashed var(--dt-border-subtle);
  border-radius: var(--dt-radius-lg);
}
</style>