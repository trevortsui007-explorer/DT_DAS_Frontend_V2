<script setup lang="ts">
import { computed, inject } from 'vue'

import type { DTFormContext, DTFormLabelPosition } from './DTForm.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    error?: string
    help?: string
    labelWidth?: string | number
    labelPosition?: DTFormLabelPosition
  }>(),
  {
    label: '',
    required: false,
    error: '',
    help: '',
    labelWidth: '',
    labelPosition: undefined
  }
)

const formContext = inject<DTFormContext>('dt-form-context', {
  labelWidth: '96px',
  labelPosition: 'top',
  size: 'md'
})

const finalLabelPosition = computed(() => {
  return props.labelPosition || formContext.labelPosition
})

const finalLabelWidth = computed(() => {
  const width = props.labelWidth || formContext.labelWidth

  if (typeof width === 'number') {
    return `${width}px`
  }

  return width
})

const labelStyle = computed(() => {
  if (finalLabelPosition.value !== 'left') {
    return {}
  }

  return {
    width: finalLabelWidth.value
  }
})

const hasMessage = computed(() => {
  return Boolean(props.error || props.help || props.required)
})
</script>

<template>
  <div
    class="dt-form-item"
    :class="[
      `dt-form-item--label-${finalLabelPosition}`,
      {
        'is-required': required,
        'is-error': error
      }
    ]"
  >
    <label
      v-if="label || $slots.label"
      class="dt-form-item__label"
      :style="labelStyle"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </label>

    <div class="dt-form-item__content">
      <slot />

      <p
        v-if="error"
        class="dt-form-item__error"
      >
        {{ error }}
      </p>

      <p
        v-else-if="help"
        class="dt-form-item__help"
      >
        {{ help }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dt-form-item {
  display: flex;
  width: 100%;
  gap: var(--dt-space-2);
}

.dt-form-item--label-top {
  flex-direction: column;
}

.dt-form-item--label-left {
  flex-direction: row;
  align-items: flex-start;
  gap: var(--dt-space-3);
}

.dt-form-item__label {
  display: inline-flex;
  min-height: 22px;
  align-items: center;
  color: var(--dt-text-secondary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.dt-form-item.is-required .dt-form-item__label::before {
  margin-right: 4px;
  color: var(--dt-color-danger);
  content: '*';
}

.dt-form-item__content {
  min-width: 0;
  flex: 1;
}

.dt-form-item__error,
.dt-form-item__help {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
}

.dt-form-item__error {
  color: var(--dt-color-danger);
}

.dt-form-item__help {
  color: var(--dt-text-muted);
}
</style>