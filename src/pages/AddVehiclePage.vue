<template>
  <MobileShell>
    <div class="py-6 section">
      <!-- Page header -->
      <div class="mb-6">
        <h1 class="heading-1">{{ t('vehicles.add.title') }}</h1>
        <p class="body-sm mt-2">{{ t('vehicles.add.subtitle') }}</p>
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="submit">
        <div>
          <label class="body font-semibold block mb-2">{{ t("vehicles.add.vehicleType") }}</label>
          <p class="body-sm mb-3">{{ t("vehicles.add.hintType") }}</p>

          <select
            v-model="vehicleType"
            class="input"
          >
            <option v-for="opt in vehicleTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <button
          class="btn btn-primary w-full"
          :disabled="loading || !vehicleType"
          type="submit"
        >
          {{ loading ? t("auth.working") : t("vehicles.add.create") }}
        </button>
      </form>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

import MobileShell from "../components/MobileShell.vue"

import { useVehiclesStore } from "../stores/vehicles"
import type { VehicleType } from "../types/api"

const { t } = useI18n()
const router = useRouter()
const vehiclesStore = useVehiclesStore()

const loading = ref(false)
const error = ref("")
const vehicleType = ref<VehicleType>("tow_truck")

const vehicleTypeOptions = computed(() => {
  const types: VehicleType[] = [
    "excavator",
    "backhoe",
    "bulldozer",
    "wheel_loader",
    "skid_steer",
    "dump_truck",
    "articulated_dump_truck",
    "semi_truck",
    "tractor_truck",
    "trailer",
    "forklift",
    "telehandler",
    "crane",
    "tower_crane",
    "knuckle_boom_crane",
    "grader",
    "roller",
    "asphalt_paver",
    "compactor",
    "tractor",
    "agricultural_implement",
    "service_truck",
    "fuel_truck",
    "water_truck",
    "tow_truck",
    "maintenance_vehicle",
    "demolition_machine",
    "drill_rig",
    "conveyor",
    "rock_crusher",
    "specialty",
  ]

  return types.map((value) => ({
    value,
    label: t(`vehicles.vehicleTypes.${value}`),
  }))
})

async function submit() {
  loading.value = true
  error.value = ""
  try {
    await vehiclesStore.createNewVehicle({
      vehicle_type: vehicleType.value,
    })

    await vehiclesStore.fetchVehicles()

    // After create: go to vehicles page
    router.push("/vehicles")
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    loading.value = false
  }
}
</script>
