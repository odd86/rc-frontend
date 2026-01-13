<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="text-sm font-semibold text-slate-700">
      {{ label }}
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      class="ds-input"
      @change="onChange"
    >
      <slot />
    </select>
    <p v-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
    <p v-if="error" class="text-xs font-semibold text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  hint?: string
  error?: string
  id?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

function onChange(event: Event) {
  emit("update:modelValue", (event.target as HTMLSelectElement).value)
}
</script>
