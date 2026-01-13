<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="text-xs font-semibold text-slate-500">{{ label }}</div>
      <slot name="icon" />
    </div>
    <div class="mt-2 text-2xl font-semibold text-slate-900">
      {{ value }}
    </div>
    <div v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
}>()
</script>
