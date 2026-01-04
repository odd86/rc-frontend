<template>
  <MobileShell>
    <div class="space-y-4 min-h-screen bg-white p-4">
        <div v-if="!vehicle" class="text-sm text-slate-600">
          Loading…
        </div>

        <div v-else class="space-y-3">
          <div class="bg-white p-4">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="font-semibold text-slate-900 truncate">
                  {{ vehicle.name }}
                </div>
                <div class="mt-1 text-sm text-slate-600">
                  {{ t(`vehicles.vehicleTypes.${vehicle.vehicle_type}`) }}
                </div>
              </div>
              <img
                  :src="`/src/assets/icons/vehicles/${vehicle.vehicle_type}.svg`"
                  class="h-10 w-10"
                  alt=""
              />
            </div>

            <div class="mt-3">
              <div class="flex">
                <div v-if="vehicle.vehicle_units === 'distance'" class="flex-grow">Distanse</div>
                <div v-if="vehicle.vehicle_units === 'time'" class="flex-grow">Timer</div>
                <div>{{ vehicle.total_units ?? 0 }}</div>
              </div>
              <div class="flex">
                <div class="flex-grow">{{t("vehicles.jobs") }}</div>
                <div>{{ vehicle.jobs_completed ?? 0 }}</div>
              </div>
              <div class="flex">
                <div class="flex-grow">{{t("vehicles.service") }}</div>
                <div>{{ vehicle.service_status ?? "OK" }}</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white" @click="rename()">
              ✏️ {{ t("common.rename") ?? "Rename" }}
            </button>
            <button class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800" @click="service()">
              🛠️ {{ t("vehicles.maintenance") }}
            </button>
            <button class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" @click="remove()">
              🗑️ {{ t("common.delete") ?? "Delete" }}
            </button>
          </div>
        </div>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import { useVehiclesStore } from "@/stores/vehicles"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const vehiclesStore = useVehiclesStore()

const id = computed(() => String(route.params.id))
const vehicle = computed(() => vehiclesStore.vehicles.find(v => v.vehicle_id === id.value))

onMounted(async () => {
  if (!vehiclesStore.vehicles.length) {
    await vehiclesStore.fetchVehicles().catch(() => null)
  }
})

function rename() {
  if (!vehicle.value) return
  const current = vehicle.value.name || ""
  const next = window.prompt("New vehicle name", current)?.trim()
  if (!next || next === current) return
  vehiclesStore.renameVehicle(id.value, next).catch(() => null)
}

function service() {
  // later: router.push(`/vehicles/${id.value}/service`)
}

function stats() {
  // later: router.push(`/vehicles/${id.value}/stats`)
}

function remove() {
  if (!vehicle.value) return
  const ok = window.confirm(`Delete ${vehicle.value.name}? This cannot be undone.`)
  if (!ok) return
  vehiclesStore.deleteVehicle(id.value).then(() => router.push("/vehicles")).catch(() => null)
}
</script>
