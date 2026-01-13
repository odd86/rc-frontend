<template>
  <MobileShell>
    <div class="ds-page">
      <LoadingState v-if="!vehicle" :title="t('auth.working')" />

      <Card
        v-else
        :eyebrow="t('vehicles.titleEyebrow')"
        :title="vehicle.name"
        :subtitle="t(`vehicles.vehicleTypes.${vehicle.vehicle_type}`)"
        badge="Vehicle"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="text-[11px] text-slate-500">
            id: <span class="font-semibold text-slate-700">{{ vehicle.vehicle_id }}</span>
          </div>
          <img
            :src="`/src/assets/icons/vehicles/${vehicle.vehicle_type}.svg`"
            class="h-10 w-10"
            alt=""
          />
        </div>

        <div class="mt-3 grid grid-cols-1 gap-2 text-sm">
          <ListRow
            :title="t('vehicles.jobs')"
            :subtitle="String(vehicle.jobs_completed ?? 0)"
          >
            <template #icon>
              <Icon name="lucide:check-circle" size="sm" />
            </template>
          </ListRow>

          <ListRow
            :title="vehicleUnitLabel"
            :subtitle="String(vehicle.total_units ?? 0)"
          >
            <template #icon>
              <Icon name="lucide:route" size="sm" />
            </template>
          </ListRow>

          <ListRow
            :title="t('vehicles.service')"
            :subtitle="String(vehicle.service_status ?? 'OK')"
          >
            <template #icon>
              <Icon name="lucide:tool" size="sm" />
            </template>
          </ListRow>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <PrimaryButton @click="rename" type="button">
            {{ t("common.rename") ?? "Rename" }}
          </PrimaryButton>

          <SecondaryButton @click="service" type="button">
            {{ t("vehicles.maintenance") }}
          </SecondaryButton>

          <DestructiveButton class="col-span-2" @click="remove" type="button">
            {{ t("common.delete") ?? "Delete" }}
          </DestructiveButton>
        </div>
      </Card>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import Card from "@/components/ui/Card.vue"
import ListRow from "@/components/ui/ListRow.vue"
import Icon from "@/components/ui/Icon.vue"
import LoadingState from "@/components/ui/LoadingState.vue"
import PrimaryButton from "@/components/ui/PrimaryButton.vue"
import SecondaryButton from "@/components/ui/SecondaryButton.vue"
import DestructiveButton from "@/components/ui/DestructiveButton.vue"
import { useVehiclesStore } from "@/stores/vehicles"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const vehiclesStore = useVehiclesStore()

const id = computed(() => String(route.params.id))
const vehicle = computed(() => vehiclesStore.vehicles.find(v => v.vehicle_id === id.value))

const vehicleUnitLabel = computed(() => {
  if (!vehicle.value) return ""
  if (vehicle.value.vehicle_units === "distance") return "Distanse"
  if (vehicle.value.vehicle_units === "time") return "Timer"
  return "Enheter"
})

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
