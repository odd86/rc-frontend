<template>
  <MobileShell>
    <div class="ds-page">
      <Card :eyebrow="t('vehicles.titleEyebrow')" :subtitle="t('vehicles.subtitle')" badge="Fleet">
        <div class="space-y-3">
          <RouterLink
            v-for="vehicle in vehiclesStore.vehicles"
            :key="vehicle.vehicle_id"
            :to="`/vehicles/${vehicle.vehicle_id}`"
            class="block"
          >
            <ListRow
              :title="vehicle?.name || 'Gravel King'"
              :subtitle="t(`vehicles.vehicleTypes.${vehicle?.vehicle_type}`)"
            >
              <template #icon>
                <div class="relative">
                  <div
                    class="h-10 w-10 rounded-2xl grid place-items-center border bg-slate-50"
                    :class="statusRingClass(vehicle)"
                  >
                    <img
                      :src="`/src/assets/icons/vehicles/${vehicle?.vehicle_type}.svg`"
                      class="h-6 w-6"
                      alt=""
                    />
                  </div>
                  <div
                    v-if="status(vehicle).level !== 'ok'"
                    class="absolute -right-1 -top-1 min-w-5 rounded-full border px-1 text-[10px] font-bold"
                    :class="statusDotClass(vehicle)"
                    @click.prevent
                  >
                    {{ status(vehicle).badge }}
                  </div>
                </div>
              </template>
              <template #trailing>
                <Badge :variant="statusBadgeVariant(vehicle)">
                  {{ status(vehicle).label }}
                </Badge>
              </template>
            </ListRow>

            <div v-if="status(vehicle).hint" class="mt-2 text-xs" :class="statusHintClass(vehicle)">
              {{ status(vehicle).hint }}
            </div>
          </RouterLink>
        </div>

        <div class="mt-4">
          <SecondaryButton to="/vehicles/add" class="w-full">
            {{ t("vehicles.addVehicle") }}
          </SecondaryButton>
        </div>
      </Card>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import Card from "@/components/ui/Card.vue"
import ListRow from "@/components/ui/ListRow.vue"
import Badge from "@/components/ui/Badge.vue"
import SecondaryButton from "@/components/ui/SecondaryButton.vue"
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
    return { level: "error", label: "ERROR", badge: errors > 9 ? "9+" : String(errors), hint: "Needs attention" }
  }
  if (serviceDue || (typeof health === "number" && health < 35)) {
    return { level: "warn", label: "WARN", badge: "!", hint: "Service recommended" }
  }
  return { level: "ok", label: "OK", badge: "", hint: "" }
}

function statusRingClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "border-red-300"
  if (lvl === "warn") return "border-amber-300"
  return "border-emerald-200"
}

function statusDotClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "bg-red-100 border-red-200 text-red-700"
  return "bg-amber-100 border-amber-200 text-amber-800"
}

function statusBadgeVariant(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "danger"
  if (lvl === "warn") return "warning"
  return "success"
}

function statusHintClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "text-red-700"
  return "text-amber-800"
}
</script>
