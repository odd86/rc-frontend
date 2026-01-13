<template>
  <nav class="fixed bottom-0 left-0 z-40 w-full border-t border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto grid max-w-xl grid-cols-5 px-2 py-2">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition"
        :class="isActive(item.to) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
      >
        <Icon :name="item.icon" size="sm" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import Icon from "./Icon.vue"

const route = useRoute()

defineProps<{
  items: Array<{ to: string; label: string; icon: string }>
}>()

function isActive(path: string) {
  return route.path === path
}
</script>
