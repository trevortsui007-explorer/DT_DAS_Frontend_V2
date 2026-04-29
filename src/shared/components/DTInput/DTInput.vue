<script setup lang="ts">
import { computed } from 'vue'

type InputSize = 'sm' | 'md' | 'lg'
type InputType = 'text' | 'password' | 'number' | 'search' | 'email'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: InputType
    size?: InputSize
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    prefixText?: string
    suffixText?: string
    error?: boolean
    errorMessage?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    size: 'md',
    placeholder: '',
    disabled: false,
    readonly: false,
    clearable: false,
    prefixText: '',
    suffixText: '',
    error: false,
    errorMessage: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  change: [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const showClear = computed(() => {
  return props.clearable && !props.disabled && !props.readonly && String(props.modelValue ?? '').length > 0
})

function normalizeValue(value: string) {
  if (props.type === 'number') {
    if (value === '') return ''
    return Number(value)
  }

  return value
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = normalizeValue(target.value)

  emit('update:modelValue', value)
  emit('input', value)
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = normalizeValue(target.value)

  emit('change', value)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('input', '')
  emit('change', '')
  emit('clear')
}
</script>

<template>
  <label
    class="dt-input"
    :class="[
      `dt-input--${size}`,
      {
        'is-disabled': disabled,
        'is-readonly': readonly,
        'is-error': error
      }
    ]"
  >
    <span
      v-if="$slots.prefix || prefixText"
      class="dt-input__prefix"
    >
      <slot name="prefix">
        {{ prefixText }}
      </slot>
    </span>

    <input
      class="dt-input__inner"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <button
      v-if="showClear"
      class="dt-input__clear"
      type="button"
      aria-label="清空输入"
      @click="handleClear"
    >
      ×
    </button>

    <span
      v-if="$slots.suffix || suffixText"
      class="dt-input__suffix"
    >
      <slot name="suffix">
        {{ suffixText }}
      </slot>
    </span>
  </label>

  <p
    v-if="error && errorMessage"
    class="dt-input__error"
  >
    {{ errorMessage }}
  </p>
</template>

<style scoped lang="scss">
.dt-input {
  display: inline-flex;
  width: 100%;
  align-items: center;
  gap: var(--dt-space-2);
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  color: var(--dt-text-primary);
  background: var(--dt-bg-surface);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.dt-input:focus-within {
  border-color: var(--dt-color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-primary) 14%, transparent);
}

.dt-input.is-error {
  border-color: var(--dt-color-danger);
}

.dt-input.is-error:focus-within {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-danger) 14%, transparent);
}

.dt-input.is-disabled {
  cursor: not-allowed;
  opacity: 0.62;
  background: var(--dt-bg-muted);
}

.dt-input--sm {
  min-height: 30px;
  padding: 0 10px;
}

.dt-input--md {
  min-height: 36px;
  padding: 0 12px;
}

.dt-input--lg {
  min-height: 42px;
  padding: 0 14px;
}

.dt-input__inner {
  min-width: 0;
  flex: 1;
  border: none;
  outline: none;
  color: var(--dt-text-primary);
  background: transparent;
  font-size: 14px;
}

.dt-input__inner::placeholder {
  color: var(--dt-text-muted);
}

.dt-input__inner:disabled {
  cursor: not-allowed;
}

.dt-input__prefix,
.dt-input__suffix {
  flex: 0 0 auto;
  color: var(--dt-text-muted);
  font-size: 13px;
}

.dt-input__clear {
  display: inline-grid;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  place-items: center;
  border: none;
  border-radius: 999px;
  color: var(--dt-text-muted);
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: 0.18s ease;
}

.dt-input__clear:hover {
  color: var(--dt-text-primary);
  background: var(--dt-bg-muted);
}

.dt-input__error {
  margin: 6px 0 0;
  color: var(--dt-color-danger);
  font-size: 12px;
}
</style>