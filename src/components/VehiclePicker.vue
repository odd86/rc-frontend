<template>
  <div class="flex flex-wrap items-center gap-3">
    <Select
      :model-value="selectedId"
      label="Vehicle"
      :disabled="vehicles.length === 0"
      @update:model-value="emit('select', $event)"
    >
      <option v-if="vehicles.length === 0" value="">No vehicles</option>
      <option v-for="v in vehicles" :key="v.vehicle_id" :value="v.vehicle_id">
        {{ v.name }} ({{ v.vehicle_type }}) {{ v.default ? "• default" : "" }}
      </option>
    </Select>

    <SecondaryButton
      size="sm"
      @click="emit('make-default', selectedId)"
      :disabled="!selectedId"
    >
      Set default
    </SecondaryButton>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from "../types/api"
import Select from "./ui/Select.vue"
import SecondaryButton from "./ui/SecondaryButton.vue"

defineProps<{
  vehicles: Vehicle[]
  selectedId: string
}>()

const emit = defineEmits<{
  (e: "select", id: string): void
  (e: "make-default", id: string): void
}>()
</script>
