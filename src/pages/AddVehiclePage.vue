<template>
  <MobileShell>
    <div class="ds-page">
      <FunCard
          :eyebrow="t('vehicles.add.titleEyebrow')"
          :title="t('vehicles.add.title')"
          :subtitle="t('vehicles.add.subtitle')"
          badge="🚙"
      >
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
      </FunCard>

      <FunCard
          eyebrow="Tips"
          title="Gøy det er lov"
          subtitle="Velg noe som føles riktig"
          badge="😄"
      >
        <div class="text-sm text-slate-700">
          Dette er bare en mal. Senere kan vi legge inn ikon, farge og stats per kjøretøytype.
        </div>
      </FunCard>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

import MobileShell from "../components/MobileShell.vue"
import FunCard from "../components/FunCard.vue"

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
