<template>
  <RouterLink
      :to="to"
      class="flex flex-col items-center justify-center rounded-xl px-2 py-3 text-xs transition-colors"
      :class="isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
      style="min-height: 56px"
  >
    <div class="text-lg leading-none">{{ icon }}</div>
    <div class="mt-1.5 font-semibold">{{ t(labelKey) }}</div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"

const props = defineProps<{
  to: string
  labelKey: string
  icon: string
}>()

const route = useRoute()
const { t } = useI18n()
const isActive = computed(() => route.path === props.to)
</script>
