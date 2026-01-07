<template>
  <MobileShell>
    <div class="px-4 pt-4 space-y-4">
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-slate-500">{{ t("vehicles.add.titleEyebrow") }}</div>
            <div class="mt-0.5 truncate text-lg font-semibold text-slate-900">{{ t("vehicles.add.title") }}</div>
            <div class="mt-0.5 text-sm text-slate-600">{{ t("vehicles.add.subtitle") }}</div>
          </div>
          <div class="shrink-0 rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            🚙
          </div>
        </div>

        <div class="rounded-3xl border bg-white p-4">
          <form class="space-y-4" @submit.prevent="submit">
            <div>
              <label class="text-sm font-semibold text-slate-700">{{ t("vehicles.add.vehicleType") }}</label>
              <p class="mt-1 text-xs text-slate-500">{{ t("vehicles.add.hintType") }}</p>

              <select
                v-model="vehicleType"
                class="mt-2 w-full rounded-2xl border bg-white px-3 py-3 text-sm"
              >
                <option v-for="opt in vehicleTypeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <button
              class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              :disabled="loading || !vehicleType"
              type="submit"
            >
              {{ loading ? t("auth.working") : t("vehicles.add.create") }}
            </button>

            <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          </form>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-slate-500">Tips</div>
            <div class="mt-0.5 truncate text-lg font-semibold text-slate-900">Gøy det er lov</div>
            <div class="mt-0.5 text-sm text-slate-600">Velg noe som føles riktig</div>
          </div>
          <div class="shrink-0 rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            😄
          </div>
        </div>

        <div class="rounded-3xl border border-dashed bg-white p-4 text-sm text-slate-700">
          Dette er bare en mal. Senere kan vi legge inn ikon, farge og stats per kjøretøytype.
        </div>
      </div>
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

    // Etter create: gå til vehicles siden
    router.push("/vehicles")
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    loading.value = false
  }
}
</script>
