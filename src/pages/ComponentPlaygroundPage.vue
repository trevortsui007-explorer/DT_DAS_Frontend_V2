<script setup lang="ts">
import { computed, ref } from 'vue'

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

const modalOpen = ref(false)
const drawerOpen = ref(false)
const saving = ref(false)

const keyword = ref('')
const status = ref<DTSelectValue | ''>('')

const tableLoading = ref(false)
const tableShowEmpty = ref(false)

const tablePagination = ref<PaginationConfig>({
  page: 1,
  pageSize: 10,
  total: 36,
  pageSizes: [10, 20, 50, 100],
  showPageSize: true,
  showTotal: true
})

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
    key: 'selection',
    type: 'selection',
    width: 52,
    align: 'center',
    fixed: 'left'
  },
  {
    key: 'expand',
    type: 'expand',
    width: 52,
    align: 'center',
    fixed: 'left'
  },
  {
    key: 'name',
    title: '配置名称',
    minWidth: 220,
    fixed: 'left',
    sortable: true,
    showOverflowTooltip: true
  },
  {
    key: 'targetTable',
    title: '目标表',
    minWidth: 180,
    sortable: 'custom',
    showOverflowTooltip: true
  },
  {
    key: 'owner.name',
    title: '负责人',
    minWidth: 120,
    align: 'center'
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
    minWidth: 180,
    sortable: true
  },
  {
    key: 'remark',
    title: '备注',
    minWidth: 260,
    showOverflowTooltip: true
  },
  {
    key: 'actions',
    title: '操作',
    width: 160,
    align: 'center',
    fixed: 'right'
  }
]

const childTableColumns: DTTableColumn[] = [
  {
    key: 'fieldName',
    title: '字段名称',
    minWidth: 160
  },
  {
    key: 'sourceField',
    title: '来源字段',
    minWidth: 160
  },
  {
    key: 'targetField',
    title: '目标字段',
    minWidth: 160
  },
  {
    key: 'dataType',
    title: '数据类型',
    width: 120,
    align: 'center'
  },
  {
    key: 'required',
    title: '是否必填',
    width: 120,
    align: 'center'
  },
  {
    key: 'remark',
    title: '说明',
    minWidth: 220,
    showOverflowTooltip: true
  }
]

const tableRawData: DTTableRow[] = [
  {
    id: 1,
    name: 'MES 数据采集配置',
    targetTable: 'DA_MES_Data',
    owner: {
      name: '张工'
    },
    status: 'enabled',
    lastRunTime: '2026-04-29 08:30:00',
    remark: '用于采集 MES 侧核心生产数据，字段较多时会触发溢出省略展示。',
    children: [
      {
        id: '1-1',
        fieldName: '批次号',
        sourceField: 'LotNo',
        targetField: 'lot_no',
        dataType: 'varchar',
        required: true,
        remark: '生产批次唯一标识'
      },
      {
        id: '1-2',
        fieldName: '产品型号',
        sourceField: 'ProdNo',
        targetField: 'prod_no',
        dataType: 'varchar',
        required: true,
        remark: '用于关联产品主数据'
      },
      {
        id: '1-3',
        fieldName: '创建时间',
        sourceField: 'CreateTime',
        targetField: 'create_time',
        dataType: 'datetime',
        required: false,
        remark: '来源系统记录创建时间'
      }
    ]
  },
  {
    id: 2,
    name: 'WIP Lot 数据配置',
    targetTable: 'QA_UBWipLot',
    owner: {
      name: 'Lee'
    },
    status: 'enabled',
    lastRunTime: '2026-04-29 09:10:00',
    remark: '用于同步 WIP 在制批次数据。',
    children: [
      {
        id: '2-1',
        fieldName: '批次号',
        sourceField: 'LotNo',
        targetField: 'lotno',
        dataType: 'varchar',
        required: true,
        remark: '用于判断当前 WIP 批次'
      },
      {
        id: '2-2',
        fieldName: '站点',
        sourceField: 'StationCode',
        targetField: 'station_code',
        dataType: 'varchar',
        required: false,
        remark: '当前批次所在工序站点'
      }
    ]
  },
  {
    id: 3,
    name: 'Scrap 数据配置',
    targetTable: 'DA_Scrap_Data',
    owner: {
      name: '王工'
    },
    status: 'disabled',
    lastRunTime: '-',
    remark: '当前配置已停用，不参与自动任务执行。',
    children: []
  },
  {
    id: 4,
    name: 'OQC 检验结果同步配置',
    targetTable: 'QA_OQC_Result',
    owner: {
      name: 'Trevor'
    },
    status: 'enabled',
    lastRunTime: '2026-04-30 10:20:00',
    remark: '测试固定列、排序、展开行、多选和分页联动。',
    children: [
      {
        id: '4-1',
        fieldName: '检验结果',
        sourceField: 'FinalResult',
        targetField: 'final_result',
        dataType: 'varchar',
        required: true,
        remark: 'OQC 最终判定结果'
      },
      {
        id: '4-2',
        fieldName: '检验时间',
        sourceField: 'CheckTime',
        targetField: 'check_time',
        dataType: 'datetime',
        required: false,
        remark: 'OQC 检验完成时间'
      }
    ]
  }
]

const tableData = computed(() => {
  return tableShowEmpty.value ? [] : tableRawData
})

function getTableText(row: DTTableRow, key: string) {
  const value = key.split('.').reduce<any>((acc, cur) => acc?.[cur], row)
  return value === null || value === undefined || value === '' ? '-' : String(value)
}

function handleRowClick(row: DTTableRow, index: number) {
  message.info(`点击了第 ${index + 1} 行：${getTableText(row, 'name')}`)
}

function handleSelectionChange(selectedRows: DTTableRow[]) {
  message.info(`已选择 ${selectedRows.length} 条数据`)
}

function handleSortChange(payload: {
  column: DTTableColumn
  prop: string
  order: 'asc' | 'desc' | null
}) {
  message.info(`排序变化：${payload.prop} / ${payload.order || '取消排序'}`)
}

function handleTablePaginationUpdate(config: PaginationConfig) {
  tablePagination.value = config
}

function handleTablePageChange(page: number, pageSize: number) {
  message.info(`分页变化：第 ${page} 页 / ${pageSize} 条`)
}

function toggleTableLoading() {
  tableLoading.value = true

  window.setTimeout(() => {
    tableLoading.value = false
    message.success('表格加载完成')
  }, 1000)
}

function toggleTableEmpty() {
  tableShowEmpty.value = !tableShowEmpty.value
}

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
        <div class="component-row">
          <DTButton
            type="primary"
            size="sm"
            @click="toggleTableLoading"
          >
            模拟 Loading
          </DTButton>

          <DTButton
            size="sm"
            @click="toggleTableEmpty"
          >
            {{ tableShowEmpty ? '恢复数据' : '模拟空数据' }}
          </DTButton>
        </div>

        <DTTable
          :columns="tableColumns"
          :data="tableData"
          row-key="id"
          height="320px"
          border
          stripe
          empty-text="当前没有配置数据"
          :loading="tableLoading"
          :pagination="tablePagination"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          @update:pagination="handleTablePaginationUpdate"
          @page-change="handleTablePageChange"
        >
          <template #header-name="{ column }">
            <span>{{ column.title }}</span>
            <DTTag type="primary" size="sm">
              重点
            </DTTag>
          </template>

          <template #cell-status="{ value }">
            <DTTag :type="value === 'enabled' ? 'success' : 'info'">
              {{ value === 'enabled' ? '启用' : '禁用' }}
            </DTTag>
          </template>

          <template #cell-actions="{ row }">
            <div class="table-actions">
              <DTButton
                size="sm"
                @click.stop="message.info(`查看：${getTableText(row, 'name')}`)"
              >
                查看
              </DTButton>

              <DTButton
                size="sm"
                type="primary"
                @click.stop="message.success(`编辑：${getTableText(row, 'name')}`)"
              >
                编辑
              </DTButton>
            </div>
          </template>

          <template #expand="{ row }">
            <div class="table-expand-table">
              <DTTable
                :columns="childTableColumns"
                :data="Array.isArray(row.children) ? row.children : []"
                row-key="id"
                size="sm"
                border
                stripe
                empty-text="当前配置暂无字段映射"
              >
                <template #cell-required="{ value }">
                  <DTTag :type="value ? 'success' : 'info'">
                    {{ value ? '是' : '否' }}
                  </DTTag>
                </template>
              </DTTable>
            </div>
          </template>
        </DTTable>
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
  justify-content: center;
  align-items: center;
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

.table-expand-table {
  padding: var(--dt-space-1) var(--dt-space-1) var(--dt-space-1) var(--dt-space-8);
  background: var(--dt-bg-muted);
  border-radius: var(--dt-radius-md);
}

@media (max-width: 960px) {
  .state-grid {
    grid-template-columns: 1fr;
  }
}
</style>