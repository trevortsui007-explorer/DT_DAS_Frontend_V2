<script setup lang="ts">
import { computed } from 'vue'

export type DTLineChartPoint = {
  label: string
  value: number
}

const props = withDefaults(
  defineProps<{
    data: DTLineChartPoint[]
    height?: number
    color?: string
    fill?: boolean
    valueSuffix?: string
  }>(),
  {
    height: 220,
    color: 'var(--dt-color-primary)',
    fill: true,
    valueSuffix: ''
  }
)

const width = 640
const padding = 28

const maxValue = computed(() => {
  return Math.max(1, ...props.data.map((item) => item.value))
})

const chartPoints = computed(() => {
  if (!props.data.length) return []

  const innerWidth = width - padding * 2
  const innerHeight = props.height - padding * 2
  const step = props.data.length > 1 ? innerWidth / (props.data.length - 1) : 0

  return props.data.map((item, index) => {
    return {
      ...item,
      x: padding + step * index,
      y: padding + innerHeight - (item.value / maxValue.value) * innerHeight
    }
  })
})

const polylinePoints = computed(() => {
  return chartPoints.value.map((item) => `${item.x},${item.y}`).join(' ')
})

const areaPath = computed(() => {
  if (!chartPoints.value.length) return ''

  const first = chartPoints.value[0]
  const last = chartPoints.value[chartPoints.value.length - 1]
  const line = chartPoints.value.map((item) => `L ${item.x} ${item.y}`).join(' ')

  return `M ${first.x} ${props.height - padding} ${line} L ${last.x} ${props.height - padding} Z`
})
</script>

<template>
  <div class="dt-line-chart">
    <svg
      class="dt-line-chart__svg"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      aria-label="折线趋势图"
    >
      <line
        v-for="index in 4"
        :key="index"
        class="dt-line-chart__grid"
        :x1="padding"
        :x2="width - padding"
        :y1="padding + ((height - padding * 2) / 3) * (index - 1)"
        :y2="padding + ((height - padding * 2) / 3) * (index - 1)"
      />

      <path
        v-if="fill && areaPath"
        class="dt-line-chart__area"
        :d="areaPath"
        :style="{ color }"
      />

      <polyline
        class="dt-line-chart__line"
        :points="polylinePoints"
        :style="{ color }"
      />

      <g
        v-for="point in chartPoints"
        :key="point.label"
      >
        <circle
          class="dt-line-chart__point"
          :cx="point.x"
          :cy="point.y"
          r="4"
          :style="{ color }"
        />
        <text
          class="dt-line-chart__value"
          :x="point.x"
          :y="point.y - 10"
          text-anchor="middle"
        >
          {{ point.value }}{{ valueSuffix }}
        </text>
        <text
          class="dt-line-chart__label"
          :x="point.x"
          :y="height - 8"
          text-anchor="middle"
        >
          {{ point.label }}
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.dt-line-chart {
  width: 100%;
  overflow-x: auto;
}

.dt-line-chart__svg {
  display: block;
  width: 100%;
  min-width: 520px;
}

.dt-line-chart__grid {
  stroke: var(--dt-border-subtle);
  stroke-width: 1;
}

.dt-line-chart__area {
  fill: currentColor;
  opacity: 0.12;
}

.dt-line-chart__line {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.dt-line-chart__point {
  fill: var(--dt-bg-surface);
  stroke: currentColor;
  stroke-width: 3;
}

.dt-line-chart__value {
  fill: var(--dt-text-secondary);
  font-size: 12px;
  font-weight: 700;
}

.dt-line-chart__label {
  fill: var(--dt-text-muted);
  font-size: 12px;
}
</style>
