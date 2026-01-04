<template>
  <div class="rounded-3xl border bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3 pb-2">
      <div class="min-w-0">
        <div v-if="eyebrow" class="text-xs font-semibold text-slate-500">{{ eyebrow }}</div>
        <div v-if="title" class="mt-0.5 truncate text-lg font-semibold text-slate-900">{{ title }}</div>
        <div v-if="subtitle" class="mt-0.5 text-sm text-slate-600">{{ subtitle }}</div>
      </div>

      <div
        v-if="badge"
        class="shrink-0 rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
      >
        {{ badge }}
      </div>
    </div>

    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  badge?: string
}>()
</script>
