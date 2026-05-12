<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
  DeleteOutlined,
  EyeOutlined,
  LinkOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

import {
  bindConfigsToGroup,
  fetchConfigs,
  removeConfigsFromGroup,
  type ConfigGroupAssociatedConfig,
  type ConfigGroupItem,
  type FileConfigItem
} from '@/api'

import {
  DTButton,
  DTCard,
  DTDrawer,
  DTEmpty,
  DTInput,
  DTTable,
  DTTag
} from '@/shared/components'

import type {
  DTTableColumn,
  DTTableRow
} from '@/shared/components'

import { confirm, message } from '@/shared/composables'
import { deferInitialLoad } from '@/shared/utils/defer'

const props = withDefaults(
  defineProps<{
    open: boolean
    group: ConfigGroupItem | null
  }>(),
  {
    open: false,
    group: null
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  success: []
  configView: [config: FileConfigItem | ConfigGroupAssociatedConfig]
}>()

type BoundConfigRow = ConfigGroupAssociatedConfig & {
  rowId: string
  index: number
}

const loading = ref(false)
const binding = ref(false)
const removingId = ref<string | null>(null)

const keyword = ref('')
const configs = ref<FileConfigItem[]>([])
const selectedConfigs = ref<FileConfigItem[]>([])

const boundColumns: DTTableColumn[] = [
  {
    key: 'index',
    title: '序号',
    width: 80,
    align: 'center'
  },
  {
    key: 'eqName',
    title: '配置名称',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    key: 'actions',
    title: '操作',
    width: 120,
    align: 'center'
  }
]

const availableColumns: DTTableColumn[] = [
  {
    key: 'selection',
    type: 'selection',
    width: 52,
    align: 'center',
    fixed: 'left'
  },
  {
    key: 'name',
    title: '配置名称',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    key: 'targetTable',
    title: '目标表',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    key: 'isEnabled',
    title: '状态',
    width: 100,
    align: 'center'
  },
  {
    key: 'actions',
    title: '操作',
    width: 80,
    align: 'center'
  }
]

const boundConfigIds = computed(() => {
  return new Set(
    props.group?.associatedConfigs.map((config) => {
      return String(config.id)
    }) || []
  )
})

const boundConfigRows = computed<BoundConfigRow[]>(() => {
  if (!props.group) return []

  return props.group.associatedConfigs.map((config, index) => {
    return {
      ...config,
      rowId: `${props.group?.id}-${config.id}-${index}`,
      index: index + 1
    }
  })
})

const availableConfigs = computed(() => {
  const keywordValue = keyword.value.trim().toLowerCase()

  return configs.value.filter((config) => {
    const isAlreadyBound = boundConfigIds.value.has(String(config.id))

    if (isAlreadyBound) {
      return false
    }

    const name = String(config.name || '').toLowerCase()
    const targetTable = String(config.targetTable || '').toLowerCase()
    const sourcePath = String(config.sourcePath || '').toLowerCase()

    return (
      !keywordValue ||
      name.includes(keywordValue) ||
      targetTable.includes(keywordValue) ||
      sourcePath.includes(keywordValue)
    )
  })
})

const selectedCount = computed(() => {
  return selectedConfigs.value.length
})

watch(
  () => props.open,
  (value) => {
    if (value) {
      deferInitialLoad(loadConfigs)
    } else {
      keyword.value = ''
      selectedConfigs.value = []
    }
  }
)

async function loadConfigs() {
  loading.value = true

  try {
    configs.value = await fetchConfigs()
  } catch (error) {
    console.error(error)
    message.error('配置列表加载失败')
  } finally {
    loading.value = false
  }
}

function handleClose(value: boolean) {
  emit('update:open', value)
}

function handleSelectionChange(rows: DTTableRow[]) {
  selectedConfigs.value = rows as FileConfigItem[]
}

function handleConfigView(config: FileConfigItem | ConfigGroupAssociatedConfig) {
  emit('configView', config)
}

async function handleBindSelected() {
  if (!props.group) {
    message.error('未选择分组')
    return
  }

  if (!selectedConfigs.value.length) {
    message.warning('请先选择要绑定的配置')
    return
  }

  binding.value = true

  try {
    await bindConfigsToGroup(
      props.group.id,
      selectedConfigs.value.map((config) => config.id)
    )

    message.success('配置绑定成功')
    selectedConfigs.value = []
    emit('success')
  } catch (error) {
    console.error(error)
    message.error('配置绑定失败')
  } finally {
    binding.value = false
  }
}

async function handleRemoveConfig(row: BoundConfigRow) {
  if (!props.group) {
    message.error('未选择分组')
    return
  }

  const ok = await confirm({
    title: '确认移除配置',
    content: `配置：${row.eqName}\n移除后该配置将不再属于当前分组，是否继续？`,
    type: 'danger',
    confirmText: '移除'
  })

  if (!ok) return

  removingId.value = row.rowId

  try {
    await removeConfigsFromGroup(props.group.id, [row.id])

    message.success('配置移除成功')
    emit('success')
  } catch (error) {
    console.error(error)
    message.error('配置移除失败')
  } finally {
    removingId.value = null
  }
}
</script>

<template>
  <DTDrawer
    :open="open"
    title="绑定配置"
    width="920px"
    @update:open="handleClose"
  >
    <template #description>
      为当前分组绑定或移除采集配置。
    </template>

    <div
      v-if="group"
      class="bind-drawer"
    >
      <DTCard title="当前分组">
        <div class="group-meta">
          <div class="group-meta__item">
            <span>分组名称</span>
            <strong>{{ group.groupName }}</strong>
          </div>

          <div class="group-meta__item">
            <span>分组类别</span>
            <DTTag type="info">
              {{ group.groupCategory || '未分类' }}
            </DTTag>
          </div>

          <div class="group-meta__item">
            <span>分组类型</span>
            <strong>{{ group.groupType || '-' }}</strong>
          </div>

          <div class="group-meta__item">
            <span>已绑定配置</span>
            <DTTag type="primary">
              {{ group.configCount || group.associatedConfigs.length || 0 }}
            </DTTag>
          </div>
        </div>
      </DTCard>

      <DTCard title="已绑定配置">
        <DTTable
          v-if="boundConfigRows.length"
          :columns="boundColumns"
          :data="boundConfigRows as DTTableRow[]"
          row-key="rowId"
          border
          empty-text="暂无已绑定配置"
        >
          <template #cell-actions="{ row }">
            <div class="table-actions">
              <DTButton
                size="sm"
                title="查看配置"
                @click.stop="handleConfigView(row as BoundConfigRow)"
              >
                <EyeOutlined />
              </DTButton>

              <DTButton
                size="sm"
                type="danger"
                title="移除配置"
                :loading="removingId === (row as BoundConfigRow).rowId"
                @click.stop="handleRemoveConfig(row as BoundConfigRow)"
              >
                <DeleteOutlined />
              </DTButton>
            </div>
          </template>
        </DTTable>

        <DTEmpty
          v-else
          size="sm"
          title="暂无已绑定配置"
          description="当前分组还没有绑定任何配置。"
        />
      </DTCard>

      <DTCard title="可绑定配置">
        <div class="bind-toolbar">
          <DTInput
            v-model="keyword"
            placeholder="搜索配置名称 / 目标表 / 源路径"
            clearable
          />

          <div class="bind-toolbar__actions">
            <DTButton
              title="刷新配置"
              @click="loadConfigs"
            >
              <ReloadOutlined />
            </DTButton>

            <DTButton
              type="primary"
              :loading="binding"
              @click="handleBindSelected"
            >
              <LinkOutlined />
              绑定选中配置（{{ selectedCount }}）
            </DTButton>
          </div>
        </div>

        <DTTable
          :columns="availableColumns"
          :data="availableConfigs as DTTableRow[]"
          row-key="id"
          :loading="loading"
          height="360px"
          border
          empty-text="暂无可绑定配置"
          @selection-change="handleSelectionChange"
        >
          <template #cell-isEnabled="{ value }">
            <DTTag :type="value ? 'success' : 'info'">
              {{ value ? '启用' : '禁用' }}
            </DTTag>
          </template>

          <template #cell-actions="{ row }">
            <div class="table-actions">
              <DTButton
                size="sm"
                title="查看配置"
                @click.stop="handleConfigView(row as FileConfigItem)"
              >
                <EyeOutlined />
              </DTButton>
            </div>
          </template>
        </DTTable>
      </DTCard>
    </div>

    <DTEmpty
      v-else
      title="未选择分组"
      description="请选择一个分组后再绑定配置。"
    />
  </DTDrawer>
</template>

<style scoped lang="scss">
.bind-drawer {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.group-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--dt-space-3);
}

.group-meta__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-3);
  padding: 10px 12px;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  background: var(--dt-bg-muted);
}

.group-meta__item span {
  color: var(--dt-text-secondary);
  font-size: 13px;
}

.group-meta__item strong {
  min-width: 0;
  overflow: hidden;
  color: var(--dt-text-primary);
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bind-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-3);
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dt-space-3);
}

.bind-toolbar > :first-child {
  max-width: 360px;
  flex: 1 1 260px;
}

.bind-toolbar__actions {
  display: inline-flex;
  gap: var(--dt-space-2);
  align-items: center;
}

.table-actions {
  display: inline-flex;
  justify-content: center;
  gap: var(--dt-space-2);
  width: 100%;
}

.table-actions :deep(.dt-button) {
  width: 32px;
  padding: 0;
}

.table-actions :deep(.anticon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

@media (max-width: 760px) {
  .group-meta {
    grid-template-columns: 1fr;
  }

  .bind-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .bind-toolbar > :first-child {
    max-width: none;
  }
}
</style>
