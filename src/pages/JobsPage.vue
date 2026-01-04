<template>
  <MobileShell>
    <div class="ds-page">
      <!-- Sticky header (inside MobileShell content area) -->
      <div class="sticky top-0 z-10 bg-slate-50/95 backdrop-blur border-b -mx-4 px-4">
        <div class="pt-3 pb-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-[11px] font-semibold text-slate-500">🧰 {{ t("nav.jobs") }}</div>
              <div class="mt-0.5 truncate text-base font-semibold text-slate-900">
                {{ jobsStore.active.length }} aktive • {{ filteredPending.length }} ledige
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                class="rounded-2xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                :disabled="jobsStore.loadingPending || jobsStore.loadingActive"
                @click="refresh"
                type="button"
                aria-label="Refresh"
              >
                🔄 {{ (jobsStore.loadingPending || jobsStore.loadingActive) ? t("auth.working") : t("common.refresh") }}
              </button>
            </div>
          </div>

          <!-- Segmented tabs -->
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button
              class="rounded-2xl border px-3 py-2 text-sm font-semibold"
              :class="tab === 'active' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'"
              @click="tab = 'active'"
              type="button"
            >
              🔧 {{ t("jobs.activeTitle") }}
              <span class="ml-1 text-xs font-semibold" :class="tab === 'active' ? 'text-white/80' : 'text-slate-500'">
                ({{ jobsStore.active.length }})
              </span>
            </button>

            <button
              class="rounded-2xl border px-3 py-2 text-sm font-semibold"
              :class="tab === 'pending' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'"
              @click="tab = 'pending'"
              type="button"
            >
              📋 {{ t("jobs.pendingTitle") }}
              <span class="ml-1 text-xs font-semibold" :class="tab === 'pending' ? 'text-white/80' : 'text-slate-500'">
                ({{ filteredPending.length }})
              </span>
            </button>
          </div>

          <!-- Filters (only when browsing pending jobs) -->
          <div v-if="tab === 'pending'" class="mt-3">
            <div class="flex items-center justify-between gap-2">
              <div class="text-xs font-semibold text-slate-700">🎛️ {{ t("jobs.filtersTitle") }}</div>
              <div class="flex items-center gap-2">
                <button
                  class="rounded-2xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="clearFilters"
                  type="button"
                >
                  👀 Alle
                </button>
                <button
                  class="rounded-2xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  @click="resetFiltersToGarage"
                  type="button"
                >
                  🧰 Mine
                </button>
              </div>
            </div>

            <!-- Horizontal chip row -->
            <div class="mt-2 -mx-4 px-4 flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
              <button
                v-for="vt in garageVehicleTypes"
                :key="vt"
                class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold"
                :class="selectedTypes.has(vt) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'"
                @click="toggleType(vt)"
                type="button"
              >
                {{ vehicleTypeEmoji(vt) }} {{ t(`vehicles.vehicleTypes.${vt}`) }}
              </button>
            </div>

            <div class="mt-1 text-[11px] text-slate-500">
              Viser jobber som passer filteret ditt.
              <span v-if="selectedTypes.size">({{ selectedTypes.size }} valgt)</span>
              <span v-else>(viser alle)</span>
            </div>
          </div>

          <!-- Errors consolidated -->
          <div v-if="jobsStore.errorActive || jobsStore.errorPending" class="mt-3 rounded-2xl border bg-red-50 px-3 py-2 text-sm text-red-700">
            <div class="font-semibold">⚠️ Noe gikk galt</div>
            <div v-if="jobsStore.errorActive" class="mt-1">{{ jobsStore.errorActive }}</div>
            <div v-if="jobsStore.errorPending" class="mt-1">{{ jobsStore.errorPending }}</div>
          </div>

          <!-- Success feedback -->
          <div v-if="jobsStore.completeSuccess || jobsStore.takeSuccess" class="mt-3 rounded-2xl border bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <div class="font-semibold">✅ Ferdig</div>
            <div v-if="jobsStore.completeSuccess" class="mt-1">{{ t("jobs.completeOk") }}</div>
            <div v-if="jobsStore.takeSuccess" class="mt-1">{{ t("jobs.takeOk") }}</div>
          </div>

          <div v-if="jobsStore.completeError || jobsStore.takeError" class="mt-3 rounded-2xl border bg-red-50 px-3 py-2 text-sm text-red-700">
            <div class="font-semibold">❌ Klarte ikke</div>
            <div v-if="jobsStore.completeError" class="mt-1">{{ jobsStore.completeError }}</div>
            <div v-if="jobsStore.takeError" class="mt-1">{{ jobsStore.takeError }}</div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="pt-2">
        <!-- Active tab -->
        <div v-if="tab === 'active'">
          <div v-if="jobsStore.loadingActive" class="text-sm text-slate-600">⏳ {{ t("auth.working") }}</div>

          <div v-else-if="jobsStore.active.length === 0" class="rounded-2xl border bg-white px-4 py-4 text-sm text-slate-700">
            <div class="font-semibold">🧘 {{ t("jobs.activeEmpty") }}</div>
            <div class="mt-1 text-xs text-slate-600">Ta en jobb fra «{{ t("jobs.pendingTitle") }}» når du er klar.</div>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="aj in jobsStore.active"
              :key="aj.job_id"
              class="rounded-2xl border bg-white px-3 py-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-semibold text-slate-900">
                    🧾 {{ aj.title || t("jobs.unknownTitle") }}
                  </div>
                  <div class="mt-1 text-xs text-slate-600">
                    {{ aj.description || "" }}
                  </div>

                  <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      🚜 {{ t("jobs.vehicle") }}:
                      {{ vehiclesStore.vehicles.find(v => v.vehicle_id === aj.vehicle_id)?.name || t("jobs.unknownVehicle") }}
                    </span>

                    <span v-if="aj.job_units" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      <span v-if="aj.job_units === 'distance'">🛣️ {{ aj.unit_amount }} km</span>
                      <span v-else-if="aj.job_units === 'time'">⏱️ {{ aj.unit_amount }} timer</span>
                      <span v-else>📦 {{ aj.unit_amount }}</span>
                    </span>

                    <span v-if="typeof aj.reward_amount === 'number'" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      💰 {{ t("jobs.reward") }} {{ aj.reward_amount }}
                    </span>
                  </div>
                </div>

                <button
                  class="shrink-0 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  :disabled="jobsStore.completingVehicleId === aj.vehicle_id"
                  @click="complete(aj.vehicle_id)"
                  type="button"
                >
                  ✅ {{ jobsStore.completingVehicleId === aj.vehicle_id ? t("auth.working") : t("jobs.complete") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending tab -->
        <div v-else>
          <div v-if="jobsStore.loadingPending" class="text-sm text-slate-600">⏳ {{ t("auth.working") }}</div>

          <div v-else-if="filteredPending.length === 0" class="rounded-2xl border bg-white px-4 py-4 text-sm text-slate-700">
            <div class="font-semibold">🫥 {{ t("jobs.empty") }}</div>
            <div class="mt-1 text-xs text-slate-600">
              Ingen jobber matcher filteret. Trykk «👀 Alle» for å se alt.
            </div>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="job in filteredPending"
              :key="job.job_id"
              class="rounded-2xl border bg-white px-3 py-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-semibold text-slate-900">🧾 {{ job.title }}</div>
                  <div class="mt-1 text-xs text-slate-600">{{ job.description }}</div>

                  <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span v-if="job.job_units" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      <span v-if="job.job_units === 'distance'">🛣️ {{ job.unit_amount }} km</span>
                      <span v-else-if="job.job_units === 'time'">⏱️ {{ job.unit_amount }} timer</span>
                      <span v-else>📦 {{ job.unit_amount }}</span>
                    </span>

                    <span v-if="typeof job.reward_amount === 'number'" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      💰 {{ t("jobs.reward") }} {{ job.reward_amount }}
                    </span>
                  </div>

                  <div class="mt-2 text-[11px] text-slate-500">
                    🚜 {{ t("jobs.allowed") }}:
                    <span class="font-semibold">
                      {{ job.allowed_vehicle_types.map(v => t(`vehicles.vehicleTypes.${v}`)).join(", ") }}
                    </span>
                  </div>
                </div>

                <button
                  class="shrink-0 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  :disabled="jobsStore.taking"
                  @click="openTake(job.batch_id, job.allowed_vehicle_types, job)"
                  type="button"
                >
                  🧲 {{ jobsStore.taking ? t("auth.working") : t("jobs.take") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom sheet: Job preview + vehicle picker -->
    <div
      v-if="showVehiclePicker"
      class="fixed inset-0 z-50 flex items-end bg-black/40"
      @click.self="closePicker"
    >
      <div class="w-full rounded-t-3xl bg-white">
        <div class="px-4 py-3 border-b flex items-center justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-slate-500">🚧 {{ t("jobs.pickVehicleEyebrow") }}</div>
            <div class="truncate text-lg font-semibold text-slate-900">{{ t("jobs.pickVehicleTitle") }}</div>
          </div>
          <button
            class="rounded-2xl border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            @click="closePicker"
            type="button"
          >
            ✖️ {{ t("common.close") }}
          </button>
        </div>

        <!-- Job preview -->
        <div v-if="pendingJob" class="px-4 py-3 border-b bg-slate-50">
          <div class="truncate text-sm font-semibold text-slate-900">🧾 {{ pendingJob.title }}</div>
          <div class="mt-1 text-xs text-slate-600">{{ pendingJob.description }}</div>

          <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
            <span v-if="pendingJob.job_units" class="rounded-full bg-white border px-2 py-1 font-semibold text-slate-700">
              <span v-if="pendingJob.job_units === 'distance'">🛣️ {{ pendingJob.unit_amount }} km</span>
              <span v-else-if="pendingJob.job_units === 'time'">⏱️ {{ pendingJob.unit_amount }} timer</span>
              <span v-else>📦 {{ pendingJob.unit_amount }}</span>
            </span>
            <span v-if="typeof pendingJob.reward_amount === 'number'" class="rounded-full bg-white border px-2 py-1 font-semibold text-slate-700">
              💰 {{ t("jobs.reward") }} {{ pendingJob.reward_amount }}
            </span>
            <span class="rounded-full bg-white border px-2 py-1 font-semibold text-slate-700">
              🚜 {{ t("jobs.allowed") }}: {{ pendingJob.allowed_vehicle_types.map(v => t(`vehicles.vehicleTypes.${v}`)).join(", ") }}
            </span>
          </div>
        </div>

        <div class="divide-y max-h-[55vh] overflow-auto">
          <button
            v-for="v in eligibleVehicles"
            :key="v.vehicle_id"
            class="w-full px-4 py-3 text-left bg-white hover:bg-slate-50"
            @click="confirmTake(v.vehicle_id)"
            type="button"
          >
            <span class="flex items-center justify-between gap-3">
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold text-slate-900">🚜 {{ v.name }}</span>
                <span class="mt-1 block text-xs text-slate-600">
                  {{ vehicleTypeEmoji(v.vehicle_type as any) }} {{ t(`vehicles.vehicleTypes.${v.vehicle_type}`) }} • {{ v.model }}
                </span>
              </span>
              <span class="text-xs font-semibold text-slate-500">id: {{ v.vehicle_id }}</span>
            </span>
          </button>

          <div v-if="!eligibleVehicles.length" class="px-4 py-6 text-sm text-slate-700">
            <div class="font-semibold">😬 Ingen kompatible kjøretøy</div>
            <div class="mt-1 text-xs text-slate-600">Prøv å endre filteret eller legg til et nytt kjøretøy.</div>
          </div>
        </div>

        <div class="px-4 py-3 text-xs text-slate-500">
          💡 {{ t("jobs.pickVehicleHint") }}
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

const tab = ref<'active' | 'pending'>('active')

const selectedTypes = ref<Set<VehicleType>>(new Set())

const pendingBatchId = ref<string>("")
const pendingAllowedTypes = ref<VehicleType[]>([])
const pendingJob = ref<any | null>(null)

const showVehiclePicker = ref(false)

const garageVehicleTypes = computed<VehicleType[]>(() => {
  const types = new Set<VehicleType>()
  for (const v of vehiclesStore.vehicles) types.add(v.vehicle_type as VehicleType)
  return Array.from(types)
})

function clearFilters() {
  selectedTypes.value = new Set()
}

function resetFiltersToGarage() {
  selectedTypes.value = new Set(garageVehicleTypes.value)
}

function toggleType(vt: VehicleType) {
  const s = new Set(selectedTypes.value)
  if (s.has(vt)) s.delete(vt)
  else s.add(vt)
  selectedTypes.value = s
}

function vehicleTypeEmoji(vt: VehicleType | string) {
  // Keep it simple + broadly supported emojis
  switch (String(vt)) {
    case 'excavator':
      return '⛏️'
    case 'backhoe':
      return '🚜'
    case 'dump_truck':
      return '🚚'
    case 'loader':
      return '🏗️'
    case 'tractor':
      return '🚜'
    default:
      return '🚧'
  }
}

const filteredPending = computed(() => {
  const types = selectedTypes.value
  if (types.size === 0) return jobsStore.pending

  return jobsStore.pending.filter((job) => {
    return job.allowed_vehicle_types?.some((vt: VehicleType) => types.has(vt))
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

function openTake(batchId: string, allowed: VehicleType[], job: any) {
  pendingBatchId.value = batchId
  pendingAllowedTypes.value = allowed || []
  pendingJob.value = job || null

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
  pendingJob.value = null

  await jobsStore.refreshAll()

  // After taking a job, jump users to Active tab (more rewarding)
  tab.value = 'active'
}

function closePicker() {
  showVehiclePicker.value = false
  pendingBatchId.value = ""
  pendingAllowedTypes.value = []
  pendingJob.value = null
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
