<script setup lang="ts">
import { computed } from 'vue'

import { DTButton, DTTable, DTTag } from '@/shared/components'
import type { DTTableColumn, DTTableRow } from '@/shared/components'

import type { ConfigGroupItem } from '@/api'

const props = defineProps<{
  data: ConfigGroupItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  view: [row: ConfigGroupItem]
  edit: [row: ConfigGroupItem]
  toggle: [row: ConfigGroupItem]
  delete: [row: ConfigGroupItem]
}>()

const columns: DTTableColumn[] = [
  {
    key: 'groupName',
    title: '分组名称',
    minWidth: 180
  },
  {
    key: 'groupCategory',
    title: '分组类别',
    minWidth: 140
  },
  {
    key: 'groupType',
    title: '分组类型',
    minWidth: 160
  },
  {
    key: 'configCount',
    title: '配置数',
    width: 100,
    align: 'center'
  },
  {
    key: 'associatedConfigs',
    title: '关联配置',
    minWidth: 260
  },
  {
    key: 'isEnable',
    title: '状态',
    width: 100,
    align: 'center'
  }
]

const hasDuplicatedConfigs = computed(() => {
  return props.data.some((group) => {
    const names = group.associatedConfigs.map((config) => config.eqName)

    return new Set(names).size !== names.length
  })
})

function getAssociatedConfigText(row: ConfigGroupItem) {
  if (!row.associatedConfigs.length) {
    return '-'
  }

  return row.associatedConfigs
    .map((config) => config.eqName)
    .filter(Boolean)
    .join('、')
}

function handleAction(type: 'view' | 'edit' | 'toggle' | 'delete', row: DTTableRow) {
  const actions = {
    view: () => emit('view', row as ConfigGroupItem),
    edit: () => emit('edit', row as ConfigGroupItem),
    toggle: () => emit('toggle', row as ConfigGroupItem),
    delete: () => emit('delete', row as ConfigGroupItem),
  };

  actions[type]();
}
</script>

<template>
  <div class="groups-table-wrap">
    <div
      v-if="hasDuplicatedConfigs"
      class="groups-table-alert"
    >
      当前测试数据中存在重复绑定配置，建议后端或数据库连接表后续做去重约束。
    </div>

    <DTTable
      :columns="columns"
      :data="data as DTTableRow[]"
      row-key="id"
      :loading="loading"
    >
      <template #cell-associatedConfigs="{ row }">
        <span class="associated-configs">
          {{ getAssociatedConfigText(row as ConfigGroupItem) }}
        </span>
      </template>

      <template #cell-isEnable="{ value }">
        <DTTag :type="Number(value) === 1 ? 'success' : 'info'">
          {{ Number(value) === 1 ? '启用' : '禁用' }}
        </DTTag>
      </template>

      <template #actions="{ row }">
        <div class="table-actions">
          <DTButton size="sm" @click.stop="handleAction('view', row)">
            查看
          </DTButton>

          <DTButton size="sm" type="primary" @click.stop="handleAction('edit', row)">
            编辑
          </DTButton>

          <DTButton
            size="sm"
            :type="Number(row.isEnable) === 1 ? 'warning' : 'success'"
            @click.stop="handleAction('toggle', row)"
          >
            {{ Number(row.isEnable) === 1 ? '禁用' : '启用' }}
          </DTButton>

          <DTButton size="sm" type="danger" @click.stop="handleAction('delete', row)">
            删除
          </DTButton>
        </div>
      </template>
    </DTTable>
  </div>
</template>

<style scoped lang="scss">
.groups-table-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-3);
}

.groups-table-alert {
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--dt-color-warning) 42%, transparent);
  border-radius: var(--dt-radius-md);
  color: var(--dt-color-warning);
  background: color-mix(in srgb, var(--dt-color-warning) 10%, transparent);
  font-size: 13px;
  line-height: 1.6;
}

.associated-configs {
  display: inline-block;
  max-width: 360px;
  overflow: hidden;
  color: var(--dt-text-secondary);
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
}

.table-actions {
  display: inline-flex;
  gap: var(--dt-space-2);
  justify-content: flex-end;
}
</style>