<template>
  <label class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <div>
      <div class="text-sm font-semibold text-slate-800">{{ label }}</div>
      <div v-if="hint" class="text-xs text-slate-500">{{ hint }}</div>
    </div>
    <button
      type="button"
      class="relative h-6 w-11 rounded-full transition"
      :class="modelValue ? 'bg-emerald-500' : 'bg-slate-200'"
      @click="emitToggle"
      :aria-pressed="modelValue"
    >
      <span
        class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0.5'"
      ></span>
    </button>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label: string
  hint?: string
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

function emitToggle() {
  emit("update:modelValue", !props.modelValue)
}
</script>
