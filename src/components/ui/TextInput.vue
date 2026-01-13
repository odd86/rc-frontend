<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="text-sm font-semibold text-slate-700">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :autocomplete="autocomplete"
      :disabled="disabled"
      class="ds-input"
      @input="onInput"
    />
    <p v-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
    <p v-if="error" class="text-xs font-semibold text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number
  label?: string
  hint?: string
  error?: string
  id?: string
  type?: string
  placeholder?: string
  autocomplete?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value)
}
</script>
