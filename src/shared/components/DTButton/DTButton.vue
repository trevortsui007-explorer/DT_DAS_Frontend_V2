<script setup lang="ts">
type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    type?: ButtonType
    size?: ButtonSize
    disabled?: boolean
  }>(),
  {
    type: 'default',
    size: 'md',
    disabled: false
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <button
    class="dt-button"
    :class="[`dt-button--${type}`, `dt-button--${size}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>