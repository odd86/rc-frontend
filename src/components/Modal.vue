<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div class="flex items-start justify-between gap-4">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <button
            class="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
            @click="$emit('close')"
        >
          ✕
        </button>
      </div>
      <div class="mt-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
defineEmits<{ (e: "close"): void }>()
</script>
