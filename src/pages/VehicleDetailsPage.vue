<template>
  <MobileShell>
    <div class="ds-page">
      <div v-if="!vehicle" class="text-sm text-slate-600">⏳ {{ t("auth.working") }}</div>

      <FunCard
        v-else
        :eyebrow="'🚜 ' + t('vehicles.titleEyebrow')"
        :title="vehicle.name"
        :subtitle="t(`vehicles.vehicleTypes.${vehicle.vehicle_type}`)"
        badge="🧰"
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

        <div class="mt-3 space-y-2 text-sm">
          <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <div class="text-slate-600">
              <span v-if="vehicle.vehicle_units === 'distance'">🛣️ Distanse</span>
              <span v-else-if="vehicle.vehicle_units === 'time'">⏱️ Timer</span>
              <span v-else>📦 Enheter</span>
            </div>
            <div class="font-semibold text-slate-900">{{ vehicle.total_units ?? 0 }}</div>
          </div>

          <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <div class="text-slate-600">✅ {{ t("vehicles.jobs") }}</div>
            <div class="font-semibold text-slate-900">{{ vehicle.jobs_completed ?? 0 }}</div>
          </div>

          <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <div class="text-slate-600">🛠️ {{ t("vehicles.service") }}</div>
            <div class="font-semibold text-slate-900">{{ vehicle.service_status ?? "OK" }}</div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <button
            class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            @click="rename()"
            type="button"
          >
            ✏️ {{ t("common.rename") ?? "Rename" }}
          </button>

          <button
            class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200"
            @click="service()"
            type="button"
          >
            🛠️ {{ t("vehicles.maintenance") }}
          </button>

          <button
            class="col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
            @click="remove()"
            type="button"
          >
            🗑️ {{ t("common.delete") ?? "Delete" }}
          </button>
        </div>
      </FunCard>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import FunCard from "@/components/FunCard.vue"
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
