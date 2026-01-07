<template>
  <MobileShell>
    <div class="py-6 space-y-4">
      <!-- Page header -->
      <div class="flex items-center justify-between">
        <h1 class="heading-2">🚙 {{ t('vehicles.title') }}</h1>
        <RouterLink to="/vehicles/add" class="btn-sm btn-primary">
          + {{ t('vehicles.addVehicle') }}
        </RouterLink>
      </div>

      <!-- Vehicle list -->
      <div v-if="vehiclesStore.loading" class="card p-6 text-center body-sm">
        {{ t('auth.working') }}
      </div>

      <div v-else-if="vehiclesStore.vehicles.length === 0" class="card p-6">
        <div class="heading-3">{{ t('vehicles.noVehicles') }}</div>
        <p class="body-sm mt-2 text-slate-600">{{ t('vehicles.noVehiclesHint') }}</p>
        <RouterLink to="/vehicles/add" class="btn btn-primary mt-4 w-full">
          {{ t('vehicles.addVehicle') }}
        </RouterLink>
      </div>

      <div v-else class="space-y-3">
        <RouterLink
          v-for="vehicle in vehiclesStore.vehicles"
          :key="vehicle.vehicle_id"
          :to="`/vehicles/${vehicle.vehicle_id}`"
          class="card-interactive block"
        >
          <div class="p-4">
            <div class="flex items-center gap-4">
              <!-- Vehicle icon with status -->
              <div class="relative shrink-0">
                <div
                  class="h-12 w-12 rounded-xl grid place-items-center border-2"
                  :class="statusRingClass(vehicle)"
                >
                  <img
                    :src="`/src/assets/icons/vehicles/${vehicle?.vehicle_type}.svg`"
                    class="h-7 w-7"
                    alt=""
                  />
                </div>
                <div
                  v-if="status(vehicle).level !== 'ok'"
                  class="absolute -right-1 -top-1 h-5 min-w-5 px-1 rounded-full text-[10px] font-bold grid place-items-center border"
                  :class="statusDotClass(vehicle)"
                >
                  {{ status(vehicle).badge }}
                </div>
              </div>

              <!-- Vehicle info -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <div class="heading-3 truncate flex-grow">
                    {{ vehicle?.name || "Vehicle" }}
                  </div>
                  <div
                    class="chip shrink-0 text-[10px]"
                    :class="statusPillClass(vehicle)"
                  >
                    {{ status(vehicle).label }}
                  </div>
                </div>

                <p class="body-sm mt-1 text-slate-600 truncate">
                  {{ t(`vehicles.vehicleTypes.${vehicle?.vehicle_type}`) }}
                </p>

                <p v-if="status(vehicle).hint" class="body-sm mt-1" :class="statusHintClass(vehicle)">
                  {{ status(vehicle).hint }}
                </p>
              </div>

              <div class="shrink-0 text-slate-400">›</div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import { useVehiclesStore } from "@/stores/vehicles"

const { t } = useI18n()
const vehiclesStore = useVehiclesStore()

onMounted(async () => {
  if (!vehiclesStore.vehicles.length) {
    await vehiclesStore.fetchVehicles().catch(() => null)
  }
})

function status(vehicle: any) {
  const errors = Number(vehicle?.errors_count ?? 0)
  const serviceDue = Boolean(vehicle?.service_due)
  const health = vehicle?.health ?? null

  if (errors > 0) {
    return { level: "error", label: "ERROR", badge: errors > 9 ? "9+" : String(errors), hint: t('vehicles.needsAttention') }
  }
  if (serviceDue || (typeof health === "number" && health < 35)) {
    return { level: "warn", label: "WARN", badge: "!", hint: t('vehicles.serviceRecommended') }
  }
  return { level: "ok", label: "OK", badge: "", hint: "" }
}

function statusRingClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "border-red-300 bg-red-50"
  if (lvl === "warn") return "border-amber-300 bg-amber-50"
  return "border-emerald-200 bg-emerald-50"
}

function statusDotClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "bg-red-100 border-red-200 text-red-700"
  return "bg-amber-100 border-amber-200 text-amber-800"
}

function statusPillClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "status-error"
  if (lvl === "warn") return "status-warn"
  return "status-ok"
}

function statusHintClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "text-red-700"
  return "text-amber-800"
}
</script>
