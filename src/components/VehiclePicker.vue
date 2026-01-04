<template>
  <div class="flex items-center gap-2">
    <label class="text-sm text-gray-600">Vehicle</label>
    <select
        class="rounded-xl border bg-white px-3 py-2 text-sm"
        :value="selectedId"
        @change="onChange($event)"
        :disabled="vehicles.length === 0"
    >
      <option v-if="vehicles.length === 0" value="">No vehicles</option>
      <option v-for="v in vehicles" :key="v.vehicle_id" :value="v.vehicle_id">
        {{ v.name }} ({{ v.vehicle_type }}) {{ v.default ? "• default" : "" }}
      </option>
    </select>

    <button
        class="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-gray-50"
        @click="$emit('make-default', selectedId)"
        :disabled="!selectedId"
    >
      Set default
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from "../types/api"

const props = defineProps<{
  vehicles: Vehicle[]
  selectedId: string
}>()

const emit = defineEmits<{
  (e: "select", id: string): void
  (e: "make-default", id: string): void
}>()

function onChange(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  emit("select", id)
}
</script>
