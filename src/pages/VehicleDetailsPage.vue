<template>
  <MobileShell>
    <div class="py-6 section">
      <!-- Loading state -->
      <div v-if="!vehicle" class="card p-6 text-center">
        <div class="body-sm">{{ t("auth.working") }}</div>
      </div>

      <div v-else class="section-compact">
        <!-- Vehicle header -->
        <div class="card p-6">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="min-w-0 flex-1">
              <div class="body-sm text-slate-600">{{ t('vehicles.titleEyebrow') }}</div>
              <h1 class="heading-1 mt-1">{{ vehicle.name }}</h1>
              <p class="body-sm mt-2">{{ t(`vehicles.vehicleTypes.${vehicle.vehicle_type}`) }}</p>
            </div>

            <img
              :src="`/src/assets/icons/vehicles/${vehicle.vehicle_type}.svg`"
              class="h-16 w-16 shrink-0"
              alt=""
            />
          </div>

          <div class="body-sm text-slate-500 font-mono">
            ID: {{ vehicle.vehicle_id }}
          </div>
        </div>

        <!-- Stats -->
        <div>
          <h2 class="heading-3 mb-3">{{ t('vehicles.stats') }}</h2>
          <div class="space-y-2">
            <div class="card p-4 flex items-center justify-between">
              <div class="body text-slate-600">
                <span v-if="vehicle.vehicle_units === 'distance'">{{ t('vehicles.distance') }}</span>
                <span v-else-if="vehicle.vehicle_units === 'time'">{{ t('vehicles.time') }}</span>
                <span v-else>{{ t('vehicles.units') }}</span>
              </div>
              <div class="heading-3">{{ vehicle.total_units ?? 0 }}</div>
            </div>

            <div class="card p-4 flex items-center justify-between">
              <div class="body text-slate-600">{{ t("vehicles.jobs") }}</div>
              <div class="heading-3">{{ vehicle.jobs_completed ?? 0 }}</div>
            </div>

            <div class="card p-4 flex items-center justify-between">
              <div class="body text-slate-600">{{ t("vehicles.service") }}</div>
              <div class="heading-3">{{ vehicle.service_status ?? "OK" }}</div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div>
          <h2 class="heading-3 mb-3">{{ t('common.actions') }}</h2>
          <div class="grid grid-cols-2 gap-3">
            <button
              class="btn btn-primary"
              @click="rename()"
              type="button"
            >
              {{ t("common.rename") ?? "Rename" }}
            </button>

            <button
              class="btn btn-secondary"
              @click="service()"
              type="button"
            >
              {{ t("vehicles.maintenance") }}
            </button>

            <button
              class="btn col-span-2"
              style="background-color: rgb(254 242 242); color: rgb(185 28 28); border-color: rgb(254 226 226);"
              @click="remove()"
              type="button"
            >
              {{ t("common.delete") ?? "Delete" }}
            </button>
          </div>
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

function remove() {
  if (!vehicle.value) return
  const ok = window.confirm(`Delete ${vehicle.value.name}? This cannot be undone.`)
  if (!ok) return
  vehiclesStore.deleteVehicle(id.value).then(() => router.push("/vehicles")).catch(() => null)
}
</script>
