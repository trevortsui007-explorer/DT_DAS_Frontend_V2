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
  DTTableRow,
  PaginationConfig
} from '@/shared/components'

import { confirm, message } from '@/shared/composables'

const keyword = ref('')
const status = ref<DTSelectValue | ''>('enabled')
const modalOpen = ref(false)
const drawerOpen = ref(false)
const saving = ref(false)
const tableLoading = ref(false)

const pagination = ref<PaginationConfig>({
  page: 1,
  pageSize: 10,
  total: 36,
  pageSizes: [10, 20, 50],
  showPageSize: true,
  showTotal: true
})

const statusOptions: DTSelectOption[] = [
  { label: '全部状态', value: 'all' },
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' }
]

const tableColumns: DTTableColumn[] = [
  { key: 'selection', type: 'selection', width: 52, align: 'center', fixed: 'left' },
  { key: 'name', title: '配置名称', minWidth: 180, fixed: 'left', sortable: true, showOverflowTooltip: true },
  { key: 'targetTable', title: '目标表', minWidth: 160, showOverflowTooltip: true },
  { key: 'status', title: '状态', width: 100, align: 'center' },
  { key: 'lastRunTime', title: '最近执行时间', minWidth: 180 },
  { key: 'actions', title: '操作', width: 140, align: 'center', fixed: 'right' }
]

const tableData: DTTableRow[] = [
  {
    id: 1,
    name: 'Mason_Test',
    targetTable: 'MasonElectricMeasurementLogFiles_BAK',
    status: 'enabled',
    lastRunTime: '2026-05-10 09:00:00'
  },
  {
    id: 2,
    name: 'Test_Device_3',
    targetTable: 'Target_Data_Table',
    status: 'enabled',
    lastRunTime: '2026-05-07 18:05:48'
  },
  {
    id: 3,
    name: 'Test_New_Version',
    targetTable: 'TestTable',
    status: 'disabled',
    lastRunTime: '-'
  }
]

const examples = {
  button: `<DTButton>Default</DTButton>
<DTButton type="primary">Primary</DTButton>
<DTButton type="danger" disabled>Disabled</DTButton>`,
  tag: `<DTTag type="success">启用</DTTag>
<DTTag type="warning">执行中</DTTag>
<DTTag type="danger">失败</DTTag>`,
  form: `<DTForm label-position="top">
  <DTFormItem label="配置名称" required>
    <DTInput v-model="keyword" placeholder="请输入配置名称" clearable />
  </DTFormItem>

  <DTFormItem label="状态">
    <DTSelect v-model="status" :options="statusOptions" clearable />
  </DTFormItem>
</DTForm>`,
  table: `<DTTable
  :columns="tableColumns"
  :data="tableData"
  row-key="id"
  border
  :pagination="pagination"
  @selection-change="handleSelectionChange"
>
  <template #cell-status="{ value }">
    <DTTag :type="value === 'enabled' ? 'success' : 'info'">
      {{ value === 'enabled' ? '启用' : '禁用' }}
    </DTTag>
  </template>
</DTTable>`,
  state: `<DTEmpty title="暂无数据" description="当前筛选条件下没有记录。" />
<DTLoading text="正在加载数据..." />`,
  feedback: `message.success('保存成功')

const ok = await confirm({
  title: '确认删除',
  content: '删除后不可恢复，是否继续？',
  type: 'danger',
  confirmText: '删除'
})`,
  modal: `<DTModal
  v-model:open="modalOpen"
  title="编辑配置"
  confirm-text="保存"
  :loading="saving"
  @confirm="handleSave"
>
  <DTInput v-model="keyword" placeholder="请输入配置名称" />
</DTModal>`,
  drawer: `<DTDrawer
  v-model:open="drawerOpen"
  title="执行详情"
  width="640px"
  show-footer
>
  <DTCard title="明细">...</DTCard>
</DTDrawer>`,
  pagination: `<DTPagination
  :page="1"
  :page-size="10"
  :total="120"
  @change="handlePageChange"
/>`
}

function showLoadingMessage() {
  const close = message.loading('正在处理请求...')

  window.setTimeout(() => {
    close()
    message.success('处理完成')
  }, 900)
}

function simulateTableLoading() {
  tableLoading.value = true

  window.setTimeout(() => {
    tableLoading.value = false
  }, 900)
}

function handleSave() {
  saving.value = true

  window.setTimeout(() => {
    saving.value = false
    modalOpen.value = false
    drawerOpen.value = false
    message.success('保存成功')
  }, 900)
}

async function handleConfirmDanger() {
  const ok = await confirm({
    title: '确认删除',
    content: '删除后不可恢复，是否继续？',
    type: 'danger',
    confirmText: '删除'
  })

  message[ok ? 'success' : 'info'](ok ? '已删除' : '已取消')
}

function handleSelectionChange(rows: DTTableRow[]) {
  message.info(`已选择 ${rows.length} 条`)
}

function handlePageChange(payload: { page: number; pageSize: number }) {
  pagination.value = {
    ...pagination.value,
    page: payload.page,
    pageSize: payload.pageSize
  }

  message.info(`第 ${payload.page} 页，每页 ${payload.pageSize} 条`)
}
</script>

<template>
  <div class="page playground-page">
    <section class="page-toolbar">
      <div>
        <h2>DT Components Playground</h2>
        <p>按“效果 + 代码”展示 DT 组件的常用写法，便于业务页面直接复用。</p>
      </div>
    </section>

    <div class="playground-grid">
      <DTCard title="Button 按钮">
        <div class="demo-panel">
          <div class="component-row">
            <DTButton>Default</DTButton>
            <DTButton type="primary">Primary</DTButton>
            <DTButton type="success">Success</DTButton>
            <DTButton type="warning">Warning</DTButton>
            <DTButton type="danger">Danger</DTButton>
            <DTButton disabled>Disabled</DTButton>
          </div>

          <pre><code>{{ examples.button }}</code></pre>
        </div>
      </DTCard>

      <DTCard title="Tag 标签">
        <div class="demo-panel">
          <div class="component-row">
            <DTTag>Default</DTTag>
            <DTTag type="primary">Primary</DTTag>
            <DTTag type="success">启用</DTTag>
            <DTTag type="warning">执行中</DTTag>
            <DTTag type="danger">失败</DTTag>
            <DTTag type="info">禁用</DTTag>
          </div>

          <pre><code>{{ examples.tag }}</code></pre>
        </div>
      </DTCard>

      <DTCard title="Form 表单">
        <div class="demo-panel">
          <DTForm label-position="top">
            <DTFormItem label="配置名称" required>
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

          <pre><code>{{ examples.form }}</code></pre>
        </div>
      </DTCard>

      <DTCard title="State 状态">
        <div class="demo-panel">
          <div class="state-grid">
            <DTEmpty
              title="暂无执行日志"
              description="当前筛选条件下没有记录。"
            />

            <div class="loading-box">
              <DTLoading text="正在加载任务数据..." />
            </div>
          </div>

          <pre><code>{{ examples.state }}</code></pre>
        </div>
      </DTCard>
    </div>

    <DTCard title="Table 表格">
      <div class="demo-panel">
        <div class="component-row">
          <DTButton
            type="primary"
            size="sm"
            @click="simulateTableLoading"
          >
            模拟 Loading
          </DTButton>
        </div>

        <DTTable
          :columns="tableColumns"
          :data="tableData"
          row-key="id"
          border
          stripe
          :loading="tableLoading"
          :pagination="pagination"
          @selection-change="handleSelectionChange"
          @page-change="(page, pageSize) => handlePageChange({ page, pageSize })"
        >
          <template #cell-status="{ value }">
            <DTTag :type="value === 'enabled' ? 'success' : 'info'">
              {{ value === 'enabled' ? '启用' : '禁用' }}
            </DTTag>
          </template>

          <template #cell-actions="{ row }">
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

        <pre><code>{{ examples.table }}</code></pre>
      </div>
    </DTCard>

    <div class="playground-grid">
      <DTCard title="Feedback 反馈">
        <div class="demo-panel">
          <div class="component-row">
            <DTButton type="success" @click="message.success('保存成功')">
              Success
            </DTButton>

            <DTButton @click="message.info('普通提示')">
              Info
            </DTButton>

            <DTButton type="warning" @click="message.warning('请注意当前操作')">
              Warning
            </DTButton>

            <DTButton type="danger" @click="message.error('操作失败')">
              Error
            </DTButton>

            <DTButton type="primary" @click="showLoadingMessage">
              Loading
            </DTButton>

            <DTButton type="danger" @click="handleConfirmDanger">
              Confirm
            </DTButton>
          </div>

          <pre><code>{{ examples.feedback }}</code></pre>
          <DTConfirm />
        </div>
      </DTCard>

      <DTCard title="Pagination 分页">
        <div class="demo-panel">
          <DTPagination
            :page="pagination.page"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @change="handlePageChange"
          />

          <pre><code>{{ examples.pagination }}</code></pre>
        </div>
      </DTCard>
    </div>

    <div class="playground-grid">
      <DTCard title="Modal 弹窗">
        <div class="demo-panel">
          <DTButton type="primary" @click="modalOpen = true">
            打开 Modal
          </DTButton>

          <pre><code>{{ examples.modal }}</code></pre>
        </div>
      </DTCard>

      <DTCard title="Drawer 抽屉">
        <div class="demo-panel">
          <DTButton type="primary" @click="drawerOpen = true">
            打开 Drawer
          </DTButton>

          <pre><code>{{ examples.drawer }}</code></pre>
        </div>
      </DTCard>
    </div>

    <DTModal
      v-model:open="modalOpen"
      title="DTModal 示例"
      width="620px"
      confirm-text="保存"
      :loading="saving"
      @confirm="handleSave"
    >
      <DTForm label-position="top">
        <DTFormItem label="配置名称">
          <DTInput
            v-model="keyword"
            placeholder="请输入配置名称"
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

      <DTCard title="详情信息">
        <div class="detail-list">
          <div>
            <span>配置名称</span>
            <strong>{{ keyword || 'Mason_Test' }}</strong>
          </div>

          <div>
            <span>状态</span>
            <DTTag :type="status === 'disabled' ? 'info' : 'success'">
              {{ status === 'disabled' ? '禁用' : '启用' }}
            </DTTag>
          </div>
        </div>
      </DTCard>
    </DTDrawer>
  </div>
</template>

<style scoped lang="scss">
.playground-page {
  padding-bottom: var(--dt-space-8);
}

.playground-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--dt-space-4);
}

.demo-panel {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.component-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-3);
  align-items: center;
}

pre {
  margin: 0;
  overflow: auto;
  padding: var(--dt-space-4);
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  background: color-mix(in srgb, var(--dt-bg-muted) 70%, var(--dt-bg-surface));
}

code {
  color: var(--dt-text-primary);
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre;
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--dt-space-4);
}

.loading-box {
  position: relative;
  min-height: 180px;
  border: 1px dashed var(--dt-border-subtle);
  border-radius: var(--dt-radius-lg);
}

.table-actions {
  display: inline-flex;
  gap: var(--dt-space-2);
  justify-content: center;
}

.detail-list {
  display: grid;
  gap: var(--dt-space-3);
}

.detail-list > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
}

.detail-list span {
  color: var(--dt-text-secondary);
}

.detail-list strong {
  color: var(--dt-text-primary);
}

@media (max-width: 1100px) {
  .playground-grid,
  .state-grid {
    grid-template-columns: 1fr;
  }
}
</style>
