<script setup lang="ts">
export type DTFlowTimelineItem = {
  title: string
  description?: string
  time?: string
  status?: 'success' | 'danger' | 'primary' | 'warning' | 'info'
}

withDefaults(
  defineProps<{
    items: DTFlowTimelineItem[]
  }>(),
  {
    items: () => []
  }
)
</script>

<template>
  <div class="dt-flow-timeline">
    <article
      v-for="(item, index) in items"
      :key="`${item.title}-${index}`"
      class="dt-flow-timeline__item"
      :class="`is-${item.status || 'info'}`"
    >
      <div class="dt-flow-timeline__rail">
        <span class="dt-flow-timeline__dot" />
        <i
          v-if="index < items.length - 1"
          class="dt-flow-timeline__line"
        />
      </div>

      <div class="dt-flow-timeline__content">
        <div class="dt-flow-timeline__head">
          <strong>{{ item.title }}</strong>
          <span>{{ item.time || '-' }}</span>
        </div>
        <p>{{ item.description || '暂无说明' }}</p>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.dt-flow-timeline {
  display: grid;
  gap: var(--dt-space-1);
}

.dt-flow-timeline__item {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: var(--dt-space-3);
}

.dt-flow-timeline__rail {
  position: relative;
  display: flex;
  justify-content: center;
}

.dt-flow-timeline__dot {
  position: relative;
  z-index: 1;
  width: 12px;
  height: 12px;
  margin-top: 7px;
  border: 2px solid var(--dt-bg-surface);
  border-radius: 999px;
  background: var(--dt-color-info);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-info) 18%, transparent);
}

.dt-flow-timeline__line {
  position: absolute;
  top: 22px;
  bottom: -8px;
  width: 2px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--dt-border-subtle);
}

.dt-flow-timeline__line::after {
  content: "";
  position: absolute;
  inset: -40% 0 auto;
  height: 40%;
  border-radius: inherit;
  background: currentColor;
  animation: dt-flow-line 1.8s linear infinite;
}

.dt-flow-timeline__content {
  min-width: 0;
  padding: 8px 0 var(--dt-space-3);
}

.dt-flow-timeline__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-3);
}

.dt-flow-timeline__head strong {
  overflow: hidden;
  color: var(--dt-text-primary);
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dt-flow-timeline__head span,
.dt-flow-timeline__content p {
  color: var(--dt-text-muted);
  font-size: 12px;
}

.dt-flow-timeline__content p {
  margin: 5px 0 0;
  line-height: 1.5;
}

.dt-flow-timeline__item.is-success {
  color: var(--dt-color-success);
}

.dt-flow-timeline__item.is-danger {
  color: var(--dt-color-danger);
}

.dt-flow-timeline__item.is-primary {
  color: var(--dt-color-primary);
}

.dt-flow-timeline__item.is-warning {
  color: var(--dt-color-warning);
}

.dt-flow-timeline__item.is-info {
  color: var(--dt-color-info);
}

.dt-flow-timeline__item.is-success .dt-flow-timeline__dot {
  background: var(--dt-color-success);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-success) 18%, transparent);
}

.dt-flow-timeline__item.is-danger .dt-flow-timeline__dot {
  background: var(--dt-color-danger);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-danger) 18%, transparent);
}

.dt-flow-timeline__item.is-primary .dt-flow-timeline__dot {
  background: var(--dt-color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-primary) 18%, transparent);
}

.dt-flow-timeline__item.is-warning .dt-flow-timeline__dot {
  background: var(--dt-color-warning);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-warning) 18%, transparent);
}

@keyframes dt-flow-line {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(360%);
  }
}
</style>
