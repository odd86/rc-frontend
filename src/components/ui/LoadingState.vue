<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
    <div class="flex items-center gap-3">
      <span class="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100">
        <Icon name="lucide:loader" size="sm" class="animate-spin" />
      </span>
      <div>
        <div class="text-sm font-semibold text-slate-700">{{ title }}</div>
        <div v-if="subtitle" class="text-xs text-slate-500">{{ subtitle }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "./Icon.vue"

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: "Loading",
  }
)
</script>
