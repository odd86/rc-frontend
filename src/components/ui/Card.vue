<template>
  <div class="ds-card" :class="variant === 'strong' ? 'ds-card-strong' : ''">
    <div v-if="title || eyebrow || subtitle || badge" class="flex items-start justify-between gap-4 px-4 pt-4">
      <div class="min-w-0">
        <div v-if="eyebrow" class="text-[11px] font-semibold text-slate-500">{{ eyebrow }}</div>
        <div v-if="title" class="mt-1 truncate text-lg font-semibold text-slate-900">{{ title }}</div>
        <div v-if="subtitle" class="mt-1 text-sm text-slate-600">{{ subtitle }}</div>
      </div>
      <div
        v-if="badge"
        class="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
      >
        {{ badge }}
      </div>
    </div>
    <div class="px-4 pb-4" :class="{ 'pt-3': title || eyebrow || subtitle || badge, 'pt-4': !title && !eyebrow && !subtitle && !badge }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    eyebrow?: string
    badge?: string
    variant?: "default" | "strong"
  }>(),
  {
    variant: "default",
  }
)
</script>
