<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <section class="dt-card">
    <header v-if="title || $slots.header" class="dt-card__header">
      <slot name="header">
        <h3 class="dt-card__title">{{ title }}</h3>
      </slot>
    </header>

    <div class="dt-card__body">
      <slot />
    </div>
  </section>
</template>