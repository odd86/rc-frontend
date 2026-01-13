<template>
  <header class="fixed top-0 left-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
      <div class="min-w-0">
        <div class="truncate text-sm font-semibold text-slate-900">
          {{ title }}
        </div>
        <div v-if="subtitle" class="mt-0.5 text-xs text-slate-500">
          {{ subtitle }}
        </div>
      </div>
      <div class="flex items-center gap-3">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
