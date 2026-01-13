<template>
  <MobileShell>
    <div class="ds-page">
      <Card
        :eyebrow="t('vehicles.add.titleEyebrow')"
        :title="t('vehicles.add.title')"
        :subtitle="t('vehicles.add.subtitle')"
        badge="New"
      >
        <form class="space-y-4" @submit.prevent="submit">
          <Select
            v-model="vehicleType"
            :label="t('vehicles.add.vehicleType')"
            :hint="t('vehicles.add.hintType')"
          >
            <option v-for="opt in vehicleTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </Select>

          <PrimaryButton class="w-full" :disabled="loading || !vehicleType" type="submit">
            {{ loading ? t("auth.working") : t("vehicles.add.create") }}
          </PrimaryButton>

          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        </form>
      </Card>

      <Card eyebrow="Tips" title="Gøy det er lov" subtitle="Velg noe som føles riktig" badge="Guide">
        <div class="text-sm text-slate-700">
          Dette er bare en mal. Senere kan vi legge inn ikon, farge og stats per kjøretøytype.
        </div>
      </Card>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

import MobileShell from "../components/MobileShell.vue"
import Card from "@/components/ui/Card.vue"
import Select from "@/components/ui/Select.vue"
import PrimaryButton from "@/components/ui/PrimaryButton.vue"

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

    router.push("/vehicles")
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    loading.value = false
  }
}
</script>
