<template>
  <Card :eyebrow="eyebrow" :title="title" :subtitle="subtitle" :badge="badge">
    <slot />
  </Card>
</template>

<script setup lang="ts">
import Card from "./ui/Card.vue"

defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  badge?: string
}>()
</script>
