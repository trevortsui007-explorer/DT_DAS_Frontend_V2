<script setup lang="ts">
type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

withDefaults(
  defineProps<{
    type?: TagType
  }>(),
  {
    type: 'default'
  }
)
</script>

<template>
  <span class="dt-tag" :class="`dt-tag--${type}`">
    <slot />
  </span>
</template>