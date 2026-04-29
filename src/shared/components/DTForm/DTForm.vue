<script setup lang="ts">
import { provide } from 'vue'

export type DTFormLabelPosition = 'top' | 'left'
export type DTFormSize = 'sm' | 'md' | 'lg'

export type DTFormContext = {
  labelWidth: string | number
  labelPosition: DTFormLabelPosition
  size: DTFormSize
}

const props = withDefaults(
  defineProps<{
    labelWidth?: string | number
    labelPosition?: DTFormLabelPosition
    size?: DTFormSize
    inline?: boolean
  }>(),
  {
    labelWidth: '96px',
    labelPosition: 'top',
    size: 'md',
    inline: false
  }
)

provide<DTFormContext>('dt-form-context', {
  labelWidth: props.labelWidth,
  labelPosition: props.labelPosition,
  size: props.size
})
</script>

<template>
  <form
    class="dt-form"
    :class="[
      `dt-form--label-${labelPosition}`,
      `dt-form--${size}`,
      {
        'dt-form--inline': inline
      }
    ]"
  >
    <slot />
  </form>
</template>

<style scoped lang="scss">
.dt-form {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: var(--dt-space-4);
}

.dt-form--inline {
  display: flex;
  flex-flow: row wrap;
  gap: var(--dt-space-3);
  align-items: flex-end;
}

.dt-form--sm {
  gap: var(--dt-space-3);
}

.dt-form--lg {
  gap: var(--dt-space-5);
}
</style>