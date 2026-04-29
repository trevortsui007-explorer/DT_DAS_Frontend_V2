<script setup lang="ts">
import { ref } from 'vue'

import {
  DTButton,
  DTCard,
  DTConfirm,
  DTDrawer,
  DTEmpty,
  DTForm,
  DTFormItem,
  DTInput,
  DTLoading,
  DTModal,
  DTPagination,
  DTSelect,
  DTTable,
  DTTag
} from '@/shared/components'

import type {
  DTSelectOption,
  DTSelectValue,
  DTTableColumn,
  DTTableRow
} from '@/shared/components'

import { confirm, message } from '@/shared/composables'

const modalOpen = ref(false)
const drawerOpen = ref(false)
const saving = ref(false)

const keyword = ref('')
const status = ref<DTSelectValue | ''>('')

const page = ref(1)
const pageSize = ref(10)

const statusOptions: DTSelectOption[] = [
  {
    label: '全部状态',
    value: 'all'
  },
  {
    label: '启用',
    value: 'enabled'
  },
  {
    label: '禁用',
    value: 'disabled'
  }
]

const tableColumns: DTTableColumn[] = [
  {
    key: 'name',
    title: '配置名称',
    minWidth: 180
  },
  {
    key: 'targetTable',
    title: '目标表',
    minWidth: 160
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    align: 'center'
  },
  {
    key: 'lastRunTime',
    title: '最近执行时间',
    minWidth: 180
  }
]

const tableData: DTTableRow[] = [
  {
    id: 1,
    name: 'MES 数据采集配置',
    targetTable: 'DA_MES_Data',
    status: 'enabled',
    lastRunTime: '2026-04-29 08:30:00'
  },
  {
    id: 2,
    name: 'WIP Lot 数据配置',
    targetTable: 'QA_UBWipLot',
    status: 'enabled',
    lastRunTime: '2026-04-29 09:10:00'
  },
  {
    id: 3,
    name: 'Scrap 数据配置',
    targetTable: 'DA_Scrap_Data',
    status: 'disabled',
    lastRunTime: '-'
  }
]

function handleShowMessage(type: 'success' | 'info' | 'warning' | 'error' | 'loading') {
  if (type === 'loading') {
    const close = message.loading('正在处理请求...')

    window.setTimeout(() => {
      close()
      message.success('处理完成')
    }, 1200)

    return
  }

  const textMap = {
    success: '操作成功',
    info: '这是一条提示信息',
    warning: '请注意当前操作',
    error: '操作失败，请稍后重试'
  }

  message[type](textMap[type])
}

function handleOpenModal() {
  modalOpen.value = true
}

function handleOpenDrawer() {
  drawerOpen.value = true
}

function handleSave() {
  saving.value = true

  window.setTimeout(() => {
    saving.value = false
    modalOpen.value = false
    drawerOpen.value = false
    message.success('模拟保存成功')
  }, 1000)
}

async function handleConfirmDanger() {
  const ok = await confirm({
    title: '确认删除',
    content: '删除后不可恢复，是否继续？',
    type: 'danger',
    confirmText: '删除'
  })

  if (!ok) {
    message.info('已取消删除')
    return
  }

  message.success('模拟删除成功')
}

function handleRowClick(row: DTTableRow) {
  message.info(`点击了：${row.name}`)
}

function handlePaginationChange(payload: { page: number; pageSize: number }) {
  message.info(`分页变化：第 ${payload.page} 页 / ${payload.pageSize} 条`)
}
</script>

<template>
  <div class="page playground-page">
    <section class="page-toolbar">
      <div>
        <h2>DT Components Playground</h2>
        <p>用于集中测试和展示 DT 基础组件，避免污染业务页面。</p>
      </div>

      <div class="playground-actions">
        <DTButton @click="handleOpenDrawer">
          打开抽屉
        </DTButton>

        <DTButton @click="handleOpenModal">
          打开弹窗
        </DTButton>

        <DTButton type="danger" @click="handleConfirmDanger">
          删除确认
        </DTButton>
      </div>
    </section>

    <DTCard title="Button">
      <div class="component-row">
        <DTButton>Default</DTButton>
        <DTButton type="primary">Primary</DTButton>
        <DTButton type="success">Success</DTButton>
        <DTButton type="warning">Warning</DTButton>
        <DTButton type="danger">Danger</DTButton>
        <DTButton disabled>Disabled</DTButton>
      </div>

      <div class="component-row">
        <DTButton size="sm">Small</DTButton>
        <DTButton size="md">Medium</DTButton>
        <DTButton size="lg">Large</DTButton>
      </div>
    </DTCard>

    <DTCard title="Tag">
      <div class="component-row">
        <DTTag>Default</DTTag>
        <DTTag type="primary">Primary</DTTag>
        <DTTag type="success">Success</DTTag>
        <DTTag type="warning">Warning</DTTag>
        <DTTag type="danger">Danger</DTTag>
        <DTTag type="info">Info</DTTag>
      </div>
    </DTCard>

    <DTCard title="Message">
      <div class="component-row">
        <DTButton type="success" @click="handleShowMessage('success')">
          Success
        </DTButton>

        <DTButton @click="handleShowMessage('info')">
          Info
        </DTButton>

        <DTButton type="warning" @click="handleShowMessage('warning')">
          Warning
        </DTButton>

        <DTButton type="danger" @click="handleShowMessage('error')">
          Error
        </DTButton>

        <DTButton type="primary" @click="handleShowMessage('loading')">
          Loading
        </DTButton>
      </div>
    </DTCard>

    <DTCard title="Form">
      <DTForm label-position="top">
        <DTFormItem
          label="配置名称"
          required
          :error="!keyword ? '配置名称不能为空' : ''"
        >
          <DTInput
            v-model="keyword"
            placeholder="请输入配置名称"
            clearable
            :error="!keyword"
          />
        </DTFormItem>

        <DTFormItem
          label="状态"
          help="用于控制配置是否参与任务执行。"
        >
          <DTSelect
            v-model="status"
            :options="statusOptions"
            placeholder="请选择状态"
            clearable
          />
        </DTFormItem>

        <DTFormItem label="文件路径">
          <DTInput
            v-model="keyword"
            placeholder="请输入文件路径"
            prefix-text="路径"
            suffix-text=".xlsx"
          />
        </DTFormItem>
      </DTForm>
    </DTCard>

    <DTCard title="Left Label Form">
      <DTForm
        label-position="left"
        label-width="96px"
      >
        <DTFormItem
          label="配置名称"
          required
        >
          <DTInput
            v-model="keyword"
            placeholder="请输入配置名称"
            clearable
          />
        </DTFormItem>

        <DTFormItem label="状态">
          <DTSelect
            v-model="status"
            :options="statusOptions"
            placeholder="请选择状态"
          />
        </DTFormItem>
      </DTForm>
    </DTCard>

    <DTCard title="State">
      <div class="state-grid">
        <div class="state-box">
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
        </div>

        <div class="state-box">
          <DTLoading text="正在加载任务数据..." />
        </div>
      </div>
    </DTCard>

    <DTCard title="Table">
      <div class="table-demo">
        <DTTable
          :columns="tableColumns"
          :data="tableData"
          row-key="id"
          height="320px"
          @row-click="handleRowClick"
        >
          <template #cell-status="{ value }">
            <DTTag :type="value === 'enabled' ? 'success' : 'info'">
              {{ value === 'enabled' ? '启用' : '禁用' }}
            </DTTag>
          </template>

          <template #actions="{ row }">
            <div class="table-actions">
              <DTButton
                size="sm"
                @click.stop="message.info(`查看：${row.name}`)"
              >
                查看
              </DTButton>

              <DTButton
                size="sm"
                type="primary"
                @click.stop="message.success(`编辑：${row.name}`)"
              >
                编辑
              </DTButton>
            </div>
          </template>
        </DTTable>

        <DTPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="36"
          @change="handlePaginationChange"
        />
      </div>
    </DTCard>

    <DTCard title="Confirm Component">
      <div class="component-row">
        <DTConfirm />
        <p class="playground-note">
          DTConfirm 实际业务中主要通过 composable 调用：
          <code>await confirm(...)</code>
        </p>
      </div>
    </DTCard>

    <DTModal
      v-model:open="modalOpen"
      title="DTModal 示例"
      width="680px"
      confirm-text="保存"
      :loading="saving"
      @confirm="handleSave"
    >
      <DTForm label-position="top">
        <DTFormItem
          label="配置名称"
          required
        >
          <DTInput
            v-model="keyword"
            placeholder="请输入配置名称"
            clearable
          />
        </DTFormItem>

        <DTFormItem label="状态">
          <DTSelect
            v-model="status"
            :options="statusOptions"
            placeholder="请选择状态"
            clearable
          />
        </DTFormItem>
      </DTForm>
    </DTModal>

    <DTDrawer
      v-model:open="drawerOpen"
      title="DTDrawer 示例"
      width="560px"
      show-footer
      confirm-text="保存"
      :loading="saving"
      @confirm="handleSave"
    >
      <template #description>
        适合详情、日志、预览、辅助配置等场景。
      </template>

      <div class="drawer-demo">
        <DTCard title="详情信息">
          <div class="detail-list">
            <div class="detail-row">
              <span>配置名称</span>
              <strong>{{ keyword || 'MES 数据采集配置' }}</strong>
            </div>

            <div class="detail-row">
              <span>状态</span>
              <DTTag :type="status === 'disabled' ? 'info' : 'success'">
                {{ status === 'disabled' ? '禁用' : '启用' }}
              </DTTag>
            </div>
          </div>
        </DTCard>

        <DTCard title="编辑区域">
          <DTForm label-position="top">
            <DTFormItem label="配置名称">
              <DTInput
                v-model="keyword"
                placeholder="请输入配置名称"
              />
            </DTFormItem>

            <DTFormItem label="状态">
              <DTSelect
                v-model="status"
                :options="statusOptions"
              />
            </DTFormItem>
          </DTForm>
        </DTCard>
      </div>
    </DTDrawer>
  </div>
</template>

<style scoped lang="scss">
.playground-page {
  padding-bottom: var(--dt-space-8);
}

.playground-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-3);
  align-items: center;
}

.component-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-3);
  align-items: center;
}

.state-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--dt-space-4);
}

.state-box {
  position: relative;
  min-height: 240px;
  border: 1px dashed var(--dt-border-subtle);
  border-radius: var(--dt-radius-lg);
}

.table-demo {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.table-actions {
  display: inline-flex;
  gap: var(--dt-space-2);
  justify-content: flex-end;
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

.playground-note {
  margin: 0;
  color: var(--dt-text-secondary);
  line-height: 1.6;
}

.playground-note code {
  padding: 2px 6px;
  border-radius: var(--dt-radius-sm);
  color: var(--dt-color-primary);
  background: var(--dt-bg-muted);
}

@media (max-width: 960px) {
  .state-grid {
    grid-template-columns: 1fr;
  }
}
</style>