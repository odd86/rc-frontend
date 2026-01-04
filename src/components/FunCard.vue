<template>
  <div class="bg-white p-4 min-h-screen">
    <div class="flex items-start justify-between pb-2">
      <div>
        <div class="text-lg font-semibold text-slate-900">{{ eyebrow }}</div>
        <div class="mt-0.5 text-lg font-semibold text-slate-900">{{ title }}</div>
        <div v-if="subtitle" class="mt-0.5 text-sm text-slate-600">{{ subtitle }}</div>
      </div>

      <div
          v-if="badge"
          class="rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
      >
        {{ badge }}
      </div>
    </div>

    <div class="">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
  badge?: string
}>()
</script>
