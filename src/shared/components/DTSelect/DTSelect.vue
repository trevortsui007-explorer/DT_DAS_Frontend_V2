<script setup lang="ts">
type SelectSize = 'sm' | 'md' | 'lg'

export type DTSelectValue = string | number | boolean

export type DTSelectOption = {
  label: string
  value: DTSelectValue
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: DTSelectValue | ''
    options?: DTSelectOption[]
    size?: SelectSize
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    error?: boolean
    errorMessage?: string
  }>(),
  {
    modelValue: '',
    options: () => [],
    size: 'md',
    placeholder: '请选择',
    disabled: false,
    clearable: false,
    error: false,
    errorMessage: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: DTSelectValue | '']
  change: [value: DTSelectValue | '']
  clear: []
}>()

function parseValue(rawValue: string): DTSelectValue | '' {
  if (rawValue === '') return ''

  const matched = props.options.find((item) => String(item.value) === rawValue)

  return matched ? matched.value : rawValue
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = parseValue(target.value)

  emit('update:modelValue', value)
  emit('change', value)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}
</script>

<template>
  <div class="dt-select-wrap">
    <label
      class="dt-select"
      :class="[
        `dt-select--${size}`,
        {
          'is-disabled': disabled,
          'is-error': error
        }
      ]"
    >
      <select
        class="dt-select__inner"
        :value="String(modelValue)"
        :disabled="disabled"
        @change="handleChange"
      >
        <option value="">
          {{ placeholder }}
        </option>

        <option
          v-for="option in options"
          :key="String(option.value)"
          :value="String(option.value)"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <button
        v-if="clearable && !disabled && modelValue !== ''"
        class="dt-select__clear"
        type="button"
        aria-label="清空选择"
        @click.prevent="handleClear"
      >
        ×
      </button>

      <span class="dt-select__arrow">⌄</span>
    </label>

    <p
      v-if="error && errorMessage"
      class="dt-select__error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.dt-select-wrap {
  width: 100%;
}

.dt-select {
  position: relative;
  display: inline-flex;
  width: 100%;
  align-items: center;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-md);
  color: var(--dt-text-primary);
  background: var(--dt-bg-surface);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.dt-select:focus-within {
  border-color: var(--dt-color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-primary) 14%, transparent);
}

.dt-select.is-error {
  border-color: var(--dt-color-danger);
}

.dt-select.is-error:focus-within {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-danger) 14%, transparent);
}

.dt-select.is-disabled {
  cursor: not-allowed;
  opacity: 0.62;
  background: var(--dt-bg-muted);
}

.dt-select--sm {
  height: 30px;
}

.dt-select--md {
  height: 36px;
}

.dt-select--lg {
  height: 42px;
}

.dt-select__inner {
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 0 34px 0 12px;
  border: none;
  outline: none;
  appearance: none;
  color: var(--dt-text-primary);
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.dt-select__inner:disabled {
  cursor: not-allowed;
}

.dt-select__clear {
  position: absolute;
  top: 50%;
  right: 30px;
  z-index: 1;
  display: inline-grid;
  width: 20px;
  height: 20px;
  place-items: center;
  transform: translateY(-50%);
  border: none;
  border-radius: 999px;
  color: var(--dt-text-muted);
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: 0.18s ease;
}

.dt-select__clear:hover {
  color: var(--dt-text-primary);
  background: var(--dt-bg-muted);
}

.dt-select__arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  color: var(--dt-text-muted);
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 15px;
}

.dt-select__error {
  margin: 6px 0 0;
  color: var(--dt-color-danger);
  font-size: 12px;
}
</style>