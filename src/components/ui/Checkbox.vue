<template>
  <label class="flex items-start gap-3">
    <input
      type="checkbox"
      class="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
      :checked="modelValue"
      @change="onChange"
    />
    <div>
      <div class="text-sm font-semibold text-slate-700">{{ label }}</div>
      <div v-if="hint" class="text-xs text-slate-500">{{ hint }}</div>
    </div>
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

function onChange(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).checked)
}
</script>
