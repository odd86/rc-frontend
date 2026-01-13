<template>
  <span
    class="iconify inline-flex"
    :class="sizeClass"
    :data-icon="name"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  name: string
  size?: "sm" | "md" | "lg"
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-base"
    case "lg":
      return "text-2xl"
    default:
      return "text-xl"
  }
})
</script>
