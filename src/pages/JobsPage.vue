<template>
  <MobileShell>
    <div class="px-3 pb-24">
      <!-- Top bar -->
      <div class="sticky top-0 z-10 -mx-3 bg-white/90 backdrop-blur border-b">

        <!-- Filters -->
        <div class="px-3 pb-3">
          <div class="flex items-center">
            <div class="flex-grow text-sm font-semibold text-slate-900">{{ t("jobs.filtersTitle") }}</div>
            <button
                class="rounded-xl border mr-1 bg-white px-3 p-1 mt-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                @click="resetFiltersToGarage"
                type="button"
            >
              Nullstill Filter
            </button>
            <button
                class="rounded-xl border bg-white px-3 p-1 mt-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                :disabled="jobsStore.loadingPending || jobsStore.loadingActive"
                @click="refresh"
                type="button"
            >
              {{ (jobsStore.loadingPending || jobsStore.loadingActive) ? t("auth.working") : t("common.refresh") }}
            </button>
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <button
                v-for="vt in garageVehicleTypes"
                :key="vt"
                class="rounded-full border px-3 py-1 text-xs font-semibold"
                :class="selectedTypes.has(vt) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'"
                @click="toggleType(vt)"
                type="button"
            >
              {{ t(`vehicles.vehicleTypes.${vt}`) }}
            </button>
          </div>

          <div class="mt-2 text-xs text-slate-500">
            Filtrer jobber etter kjøretøy du har.
          </div>
        </div>
      </div>

      <!-- Errors -->
      <div v-if="jobsStore.errorActive" class="mt-3 text-sm text-red-600">{{ jobsStore.errorActive }}</div>
      <div v-if="jobsStore.errorPending" class="mt-2 text-sm text-red-600">{{ jobsStore.errorPending }}</div>

      <!-- Active jobs list -->
      <div class="mt-4">
        <div class="flex items-center justify-between">
          <div class="text-sm font-semibold text-slate-900">{{ t("jobs.activeTitle") }}</div>
          <div class="text-xs text-slate-600">
            <span v-if="jobsStore.loadingActive">{{ t("auth.working") }}</span>
            <span v-else>{{ t("jobs.count", { count: jobsStore.active.length }) }}</span>
          </div>
        </div>

        <div v-if="!jobsStore.loadingActive && jobsStore.active.length === 0" class="mt-2 text-sm text-slate-600">
          {{ t("jobs.activeEmpty") }}
        </div>

        <div v-else class="mt-2 border rounded-2xl overflow-hidden">
          <div class="divide-y">
            <div v-for="aj in jobsStore.active" :key="aj.job_id" class="p-3 bg-white">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-slate-900">
                    {{ aj.title || t("jobs.unknownTitle") }}
                  </div>
                  <div class="mt-1 text-xs text-slate-600">
                    {{ aj.description || "" }}
                  </div>

                  <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">

                      {{ t("jobs.vehicle") }}: {{ vehiclesStore.vehicles.find(v => v.vehicle_id === aj.vehicle_id)?.name || t("jobs.unknownVehicle") }}
                    </span>
                    <span v-if="aj.job_units" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      <span v-if="aj.job_units === 'distance'">{{aj.unit_amount}} km</span>
                      <span v-if="aj.job_units === 'time'">{{aj.unit_amount}} timer</span>
                    </span>
                    <span v-if="typeof aj.reward_amount === 'number'" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      {{ t("jobs.reward") }} {{ aj.reward_amount }} 💰
                    </span>
                  </div>
                </div>

                <button
                    class="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    :disabled="jobsStore.completingVehicleId === aj.vehicle_id"
                    @click="complete(aj.vehicle_id)"
                    type="button"
                >
                  {{ jobsStore.completingVehicleId === aj.vehicle_id ? t("auth.working") : t("jobs.complete") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="jobsStore.completeError" class="mt-2 text-sm text-red-600">{{ jobsStore.completeError }}</div>
        <div v-if="jobsStore.completeSuccess" class="mt-2 text-sm text-emerald-700">{{ t("jobs.completeOk") }}</div>
      </div>

      <!-- Pending jobs list -->
      <div class="mt-6">
        <div class="flex items-center justify-between">
          <div class="text-sm font-semibold text-slate-900">{{ t("jobs.pendingTitle") }}</div>
          <div class="text-xs text-slate-600">
            <span v-if="jobsStore.loadingPending">{{ t("auth.working") }}</span>
            <span v-else>{{ t("jobs.count", { count: filteredPending.length }) }}</span>
          </div>
        </div>

        <div v-if="!jobsStore.loadingPending && filteredPending.length === 0" class="mt-2 text-sm text-slate-600">
          {{ t("jobs.empty") }}
        </div>

        <div v-else class="mt-2 border rounded-2xl overflow-hidden">
          <div class="divide-y">
            <div v-for="job in filteredPending" :key="job.job_id" class="p-3 bg-white">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-slate-900">{{ job.title }}</div>
                  <div class="mt-1 text-xs text-slate-600">{{ job.description }}</div>

                  <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span v-if="job.job_units" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      <span v-if="job.job_units === 'distance'">{{job.unit_amount}} km</span>
                      <span v-if="job.job_units === 'time'">{{job.unit_amount}} timer</span>
                    </span>
                    <span v-if="typeof job.reward_amount === 'number'" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      {{ t("jobs.reward") }} {{ job.reward_amount }} 💰
                    </span>
                  </div>

                  <div class="mt-2 text-[11px] text-slate-500">
                    {{ t("jobs.allowed") }}:
                    <span class="font-semibold">
                      {{ job.allowed_vehicle_types.map(v => t(`vehicles.vehicleTypes.${v}`)).join(", ") }}
                    </span>
                  </div>
                </div>

                <button
                    class="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    :disabled="jobsStore.taking"
                    @click="startTake(job.batch_id, job.allowed_vehicle_types)"
                    type="button"
                >
                  {{ jobsStore.taking ? t("auth.working") : t("jobs.take") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="jobsStore.takeError" class="mt-2 text-sm text-red-600">{{ jobsStore.takeError }}</div>
        <div v-if="jobsStore.takeSuccess" class="mt-2 text-sm text-emerald-700">{{ t("jobs.takeOk") }}</div>
      </div>
    </div>

    <!-- Vehicle picker bottom sheet -->
    <div
        v-if="showVehiclePicker"
        class="fixed inset-0 z-50 flex items-end bg-black/40"
        @click.self="closePicker"
    >
      <div class="w-full rounded-t-3xl bg-white">
        <div class="px-4 py-3 border-b flex items-center justify-between">
          <div>
            <div class="text-xs font-semibold text-slate-500">{{ t("jobs.pickVehicleEyebrow") }}</div>
            <div class="text-lg font-semibold text-slate-900">{{ t("jobs.pickVehicleTitle") }}</div>
          </div>
          <button
              class="rounded-2xl border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="closePicker"
              type="button"
          >
            {{ t("common.close") }}
          </button>
        </div>

        <div class="divide-y">
          <button
              v-for="v in eligibleVehicles"
              :key="v.vehicle_id"
              class="w-full px-4 py-3 text-left bg-white hover:bg-slate-50"
              @click="confirmTake(v.vehicle_id)"
              type="button"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold text-slate-900">{{ v.name }}</div>
                <div class="mt-1 text-xs text-slate-600">
                  {{ t(`vehicles.vehicleTypes.${v.vehicle_type}`) }} • {{ v.model }}
                </div>
              </div>
              <div class="text-xs font-semibold text-slate-500">id: {{ v.vehicle_id }}</div>
            </div>
          </button>
        </div>

        <div class="px-4 py-3 text-xs text-slate-500">
          {{ t("jobs.pickVehicleHint") }}
        </div>
      </div>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import MobileShell from "@/components/MobileShell.vue"
import { useVehiclesStore } from "@/stores/vehicles"
import { useJobsStore } from "@/stores/jobs"
import type { VehicleType } from "@/types/api"

const { t } = useI18n()

const vehiclesStore = useVehiclesStore()
const jobsStore = useJobsStore()

const selectedTypes = ref<Set<VehicleType>>(new Set())

const pendingBatchId = ref<string>("")
const pendingAllowedTypes = ref<VehicleType[]>([])

const showVehiclePicker = ref(false)

const garageVehicleTypes = computed<VehicleType[]>(() => {
  const types = new Set<VehicleType>()
  for (const v of vehiclesStore.vehicles) types.add(v.vehicle_type as VehicleType)
  return Array.from(types)
})

function resetFiltersToGarage() {
  selectedTypes.value = new Set(garageVehicleTypes.value)
}

function toggleType(vt: VehicleType) {
  const s = new Set(selectedTypes.value)
  if (s.has(vt)) s.delete(vt)
  else s.add(vt)
  selectedTypes.value = s
}

const filteredPending = computed(() => {
  const types = selectedTypes.value
  if (types.size === 0) return jobsStore.pending

  return jobsStore.pending.filter((job) => {
    return job.allowed_vehicle_types?.some((vt) => types.has(vt))
  })
})

const eligibleVehicles = computed(() => {
  const allowed = new Set(pendingAllowedTypes.value)
  if (allowed.size === 0) return vehiclesStore.vehicles
  return vehiclesStore.vehicles.filter((v) => allowed.has(v.vehicle_type as VehicleType))
})

async function refresh() {
  if (!vehiclesStore.vehicles.length) {
    await vehiclesStore.fetchVehicles().catch(() => null)
  }
  await jobsStore.refreshAll()
}

function startTake(batchId: string, allowed: VehicleType[]) {
  pendingBatchId.value = batchId
  pendingAllowedTypes.value = allowed || []

  const eligible = eligibleVehicles.value

  if (eligible.length === 1) {
    confirmTake(eligible[0].vehicle_id)
    return
  }

  showVehiclePicker.value = true
}

async function confirmTake(vehicleId: string) {
  showVehiclePicker.value = false
  const batchId = pendingBatchId.value
  if (!batchId) return

  await jobsStore.takeJob(batchId, vehicleId).catch(() => null)

  pendingBatchId.value = ""
  pendingAllowedTypes.value = []

  await jobsStore.refreshAll()
}

function closePicker() {
  showVehiclePicker.value = false
  pendingBatchId.value = ""
  pendingAllowedTypes.value = []
}

async function complete(vehicleId: string) {
  await jobsStore.completeJob(vehicleId).catch(() => null)
  await jobsStore.refreshAll()
  await vehiclesStore.fetchVehicles().catch(() => null)
}

onMounted(async () => {
  await refresh()

  if (selectedTypes.value.size === 0) {
    resetFiltersToGarage()
  }
})
</script>
