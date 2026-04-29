<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    title: '暂无数据',
    description: '',
    size: 'md'
  }
)
</script>

<template>
  <div
    class="dt-empty"
    :class="`dt-empty--${size}`"
  >
    <div class="dt-empty__icon">
      <slot name="icon">
        <svg
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="18"
            y="24"
            width="60"
            height="48"
            rx="8"
            class="dt-empty__box"
          />
          <path
            d="M32 40H64"
            class="dt-empty__line"
          />
          <path
            d="M32 52H56"
            class="dt-empty__line"
          />
          <path
            d="M39 72L48 80L57 72"
            class="dt-empty__line"
          />
        </svg>
      </slot>
    </div>

    <div class="dt-empty__content">
      <div class="dt-empty__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>

      <p
        v-if="description || $slots.description"
        class="dt-empty__description"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </p>

      <div
        v-if="$slots.action"
        class="dt-empty__action"
      >
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dt-empty {
  display: flex;
  width: 100%;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--dt-space-6);
  text-align: center;
}

.dt-empty--sm {
  min-height: 140px;
  padding: var(--dt-space-4);
}

.dt-empty--md {
  min-height: 220px;
}

.dt-empty--lg {
  min-height: 320px;
}

.dt-empty__icon {
  width: 96px;
  height: 96px;
  margin-bottom: var(--dt-space-3);
  color: var(--dt-text-muted);
}

.dt-empty--sm .dt-empty__icon {
  width: 72px;
  height: 72px;
}

.dt-empty--lg .dt-empty__icon {
  width: 120px;
  height: 120px;
}

.dt-empty__icon svg {
  display: block;
  width: 100%;
  height: 100%;
}

.dt-empty__box {
  fill: color-mix(in srgb, var(--dt-bg-muted) 82%, transparent);
  stroke: var(--dt-border-subtle);
  stroke-width: 2;
}

.dt-empty__line {
  stroke: var(--dt-text-muted);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dt-empty__title {
  color: var(--dt-text-secondary);
  font-size: 15px;
  font-weight: 600;
}

.dt-empty__description {
  max-width: 360px;
  margin: var(--dt-space-2) auto 0;
  color: var(--dt-text-muted);
  font-size: 13px;
  line-height: 1.6;
}

.dt-empty__action {
  display: flex;
  justify-content: center;
  margin-top: var(--dt-space-4);
}
</style>