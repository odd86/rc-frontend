<template>
  <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold" :class="badgeClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    variant?: "neutral" | "success" | "warning" | "danger"
  }>(),
  {
    variant: "neutral",
  }
)

const badgeClass = computed(() => {
  switch (props.variant) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "danger":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-slate-200 bg-white text-slate-600"
  }
})
</script>
