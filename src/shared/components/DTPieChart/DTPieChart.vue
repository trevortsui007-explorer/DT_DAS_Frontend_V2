<script setup lang="ts">
import { computed } from 'vue'

export type DTPieChartSegment = {
  label: string
  value: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    data: DTPieChartSegment[]
    size?: number
    centerLabel?: string
    centerValue?: string | number
  }>(),
  {
    size: 180,
    centerLabel: '',
    centerValue: ''
  }
)

const palette = [
  'var(--dt-color-success)',
  'var(--dt-color-danger)',
  'var(--dt-color-primary)',
  'var(--dt-color-warning)',
  'var(--dt-color-info)'
]

const total = computed(() => {
  return props.data.reduce((sum, item) => sum + Math.max(0, item.value), 0)
})

const gradient = computed(() => {
  if (total.value <= 0) {
    return 'conic-gradient(var(--dt-bg-muted) 0 360deg)'
  }

  let cursor = 0

  const stops = props.data.map((item, index) => {
    const start = cursor
    const end = cursor + (Math.max(0, item.value) / total.value) * 360
    cursor = end

    const color = item.color || palette[index % palette.length]

    return `${color} ${start}deg ${end}deg`
  })

  return `conic-gradient(${stops.join(', ')})`
})

function getPercent(value: number) {
  if (total.value <= 0) return '0%'

  return `${Math.round((value / total.value) * 100)}%`
}
</script>

<template>
  <div class="dt-pie-chart">
    <div
      class="dt-pie-chart__visual"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        background: gradient
      }"
    >
      <div class="dt-pie-chart__center">
        <strong>{{ centerValue || total }}</strong>
        <span>{{ centerLabel || '总计' }}</span>
      </div>
    </div>

    <div class="dt-pie-chart__legend">
      <div
        v-for="(item, index) in data"
        :key="item.label"
        class="dt-pie-chart__legend-item"
      >
        <i :style="{ background: item.color || palette[index % palette.length] }" />
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <em>{{ getPercent(item.value) }}</em>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dt-pie-chart {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-5);
  align-items: center;
}

.dt-pie-chart__visual {
  position: relative;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px var(--dt-border-subtle);
}

.dt-pie-chart__center {
  display: grid;
  width: 58%;
  height: 58%;
  place-items: center;
  border: 1px solid var(--dt-border-subtle);
  border-radius: 999px;
  background: var(--dt-bg-surface);
  text-align: center;
}

.dt-pie-chart__center strong {
  color: var(--dt-text-primary);
  font-size: 26px;
  line-height: 1;
}

.dt-pie-chart__center span {
  color: var(--dt-text-muted);
  font-size: 12px;
}

.dt-pie-chart__legend {
  display: grid;
  min-width: 220px;
  flex: 1;
  gap: var(--dt-space-2);
}

.dt-pie-chart__legend-item {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto auto;
  gap: var(--dt-space-2);
  align-items: center;
  color: var(--dt-text-secondary);
  font-size: 13px;
}

.dt-pie-chart__legend-item i {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.dt-pie-chart__legend-item strong {
  color: var(--dt-text-primary);
}

.dt-pie-chart__legend-item em {
  color: var(--dt-text-muted);
  font-style: normal;
}
</style>
