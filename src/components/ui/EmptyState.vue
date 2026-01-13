<template>
  <div class="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-600">
    <div class="flex items-center gap-3">
      <span class="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100">
        <Icon :name="icon" size="sm" />
      </span>
      <div>
        <div class="text-sm font-semibold text-slate-800">{{ title }}</div>
        <div v-if="subtitle" class="text-xs text-slate-500">{{ subtitle }}</div>
      </div>
    </div>
    <div v-if="$slots.action" class="mt-3">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "./Icon.vue"

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    icon?: string
  }>(),
  {
    icon: "lucide:box",
  }
)
</script>
