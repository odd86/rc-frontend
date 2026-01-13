<template>
  <div class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <div class="flex items-center gap-3">
      <slot name="icon" />
      <div class="min-w-0">
        <div class="truncate text-sm font-semibold text-slate-900">{{ title }}</div>
        <div v-if="subtitle" class="text-xs text-slate-500">{{ subtitle }}</div>
      </div>
    </div>
    <div class="shrink-0">
      <slot name="trailing" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
