<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    size?: 'sm' | 'md' | 'lg'
    full?: boolean
    overlay?: boolean
  }>(),
  {
    text: '加载中...',
    size: 'md',
    full: false,
    overlay: false
  }
)
</script>

<template>
  <div
    class="dt-loading"
    :class="[
      `dt-loading--${size}`,
      {
        'dt-loading--full': full,
        'dt-loading--overlay': overlay
      }
    ]"
    role="status"
  >
    <div class="dt-loading__spinner" />

    <div
      v-if="text"
      class="dt-loading__text"
    >
      {{ text }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.dt-loading {
  display: inline-flex;
  min-height: 120px;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-3);
  color: var(--dt-text-secondary);
}

.dt-loading--full {
  display: flex;
  width: 100%;
  min-height: 320px;
}

.dt-loading--overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  min-height: auto;
  background: color-mix(in srgb, var(--dt-bg-surface) 78%, transparent);
  backdrop-filter: blur(2px);
}

.dt-loading__spinner {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  border: 2px solid color-mix(in srgb, var(--dt-color-primary) 20%, transparent);
  border-top-color: var(--dt-color-primary);
  border-radius: 999px;
  animation: dt-loading-spin 0.75s linear infinite;
}

.dt-loading--sm .dt-loading__spinner {
  width: 16px;
  height: 16px;
}

.dt-loading--lg .dt-loading__spinner {
  width: 30px;
  height: 30px;
  border-width: 3px;
}

.dt-loading__text {
  font-size: 14px;
  line-height: 1.5;
}

.dt-loading--sm .dt-loading__text {
  font-size: 13px;
}

.dt-loading--lg .dt-loading__text {
  font-size: 15px;
}

@keyframes dt-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>