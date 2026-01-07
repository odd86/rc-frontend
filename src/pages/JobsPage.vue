<template>
  <MobileShell>
    <!-- Sticky header -->
    <div class="sticky top-0 z-10 bg-white border-b border-slate-200 -mx-4 px-4 py-4">
      <div class="flex items-center justify-between mb-3">
        <div class="min-w-0 flex-1">
          <h1 class="heading-2">🧰 {{ t("nav.jobs") }}</h1>
          <p class="body-sm mt-1">
            {{ jobsStore.active.length }} {{ t('jobs.active') }} • {{ filteredPending.length}} {{ t('jobs.available') }}
          </p>
        </div>

        <button
          class="btn-sm btn-ghost"
          :disabled="jobsStore.loadingPending || jobsStore.loadingActive"
          @click="refresh"
          type="button"
        >
          {{ (jobsStore.loadingPending || jobsStore.loadingActive) ? '...' : '↻' }}
        </button>
      </div>

      <!-- Tab switcher -->
      <div class="grid grid-cols-2 gap-2">
        <button
          class="btn"
          :class="tab === 'active' ? 'btn-primary' : 'btn-ghost'"
          @click="tab = 'active'"
          type="button"
        >
          ⚡ {{ t("jobs.activeTitle") }} ({{ jobsStore.active.length }})
        </button>

        <button
          class="btn"
          :class="tab === 'pending' ? 'btn-primary' : 'btn-ghost'"
          @click="tab = 'pending'"
          type="button"
        >
          📋 {{ t("jobs.pendingTitle") }} ({{ filteredPending.length }})
        </button>
      </div>

      <!-- Filters (only for pending) -->
      <div v-if="tab === 'pending' && garageVehicleTypes.length > 0" class="mt-4">
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="body-sm font-semibold">{{ t("jobs.filtersTitle") }}</div>
          <div class="flex items-center gap-2">
            <button
              class="btn-sm btn-ghost text-xs"
              @click="clearFilters"
              type="button"
            >
              {{ t('jobs.filterAll') }}
            </button>
            <button
              class="btn-sm btn-ghost text-xs"
              @click="resetFiltersToGarage"
              type="button"
            >
              {{ t('jobs.filterMine') }}
            </button>
          </div>
        </div>

        <!-- Filter chips -->
        <div class="flex gap-2 overflow-x-auto -mx-4 px-4 pb-2">
          <button
            v-for="vt in garageVehicleTypes"
            :key="vt"
            class="chip shrink-0"
            :class="selectedTypes.has(vt) ? 'chip-active' : 'chip-inactive'"
            @click="toggleType(vt)"
            type="button"
          >
            {{ vehicleTypeEmoji(vt) }} {{ t(`vehicles.vehicleTypes.${vt}`) }}
          </button>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="jobsStore.errorActive || jobsStore.errorPending" class="alert alert-error mt-3">
        <div class="font-semibold">{{ t('common.error') }}</div>
        <div v-if="jobsStore.errorActive">{{ jobsStore.errorActive }}</div>
        <div v-if="jobsStore.errorPending">{{ jobsStore.errorPending }}</div>
      </div>

      <div v-if="jobsStore.completeSuccess || jobsStore.takeSuccess" class="alert alert-success mt-3">
        <div v-if="jobsStore.completeSuccess">✓ {{ t("jobs.completeOk") }}</div>
        <div v-if="jobsStore.takeSuccess">✓ {{ t("jobs.takeOk") }}</div>
      </div>

      <div v-if="jobsStore.completeError || jobsStore.takeError" class="alert alert-error mt-3">
        <div v-if="jobsStore.completeError">{{ jobsStore.completeError }}</div>
        <div v-if="jobsStore.takeError">{{ jobsStore.takeError }}</div>
      </div>
    </div>

    <!-- Content -->
    <div class="py-4">
      <!-- Active tab -->
      <div v-if="tab === 'active'">
        <div v-if="jobsStore.loadingActive" class="text-center body-sm">{{ t("auth.working") }}</div>

        <div v-else-if="jobsStore.active.length === 0" class="card p-6">
          <div class="heading-3">{{ t("jobs.activeEmpty") }}</div>
          <p class="body-sm mt-2 text-slate-600">{{ t("jobs.activeEmptyHint") }}</p>
          <button class="btn btn-secondary mt-4 w-full" @click="tab = 'pending'" type="button">
            {{ t("jobs.browseJobs") }}
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="aj in jobsStore.active"
            :key="aj.job_id"
            class="card p-4"
          >
            <div class="flex items-start gap-3">
              <div class="min-w-0 flex-1">
                <div class="heading-3 truncate">{{ aj.title || t("jobs.unknownTitle") }}</div>
                <p class="body-sm mt-1 text-slate-600">{{ aj.description || "" }}</p>

                <div class="flex flex-wrap gap-2 mt-3">
                  <span class="chip chip-inactive text-[11px]">
                    🚜 {{ vehiclesStore.vehicles.find(v => v.vehicle_id === aj.vehicle_id)?.name || t("jobs.unknownVehicle") }}
                  </span>
                  <span v-if="aj.job_units" class="chip chip-inactive text-[11px]">
                    <span v-if="aj.job_units === 'distance'">{{ aj.unit_amount }} km</span>
                    <span v-else-if="aj.job_units === 'time'">{{ aj.unit_amount }}h</span>
                    <span v-else>{{ aj.unit_amount }}</span>
                  </span>
                  <span v-if="typeof aj.reward_amount === 'number'" class="chip chip-inactive text-[11px]">
                    💰 {{ aj.reward_amount }} {{ t('common.currency') }}
                  </span>
                </div>
              </div>

              <button
                class="btn-sm btn-primary shrink-0"
                :disabled="jobsStore.completingVehicleId === aj.vehicle_id"
                @click="complete(aj.vehicle_id)"
                type="button"
              >
                {{ jobsStore.completingVehicleId === aj.vehicle_id ? '...' : t("jobs.complete") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending tab -->
      <div v-else>
        <div v-if="jobsStore.loadingPending" class="text-center body-sm">{{ t("auth.working") }}</div>

        <div v-else-if="filteredPending.length === 0" class="card p-6">
          <div class="heading-3">{{ t("jobs.empty") }}</div>
          <p class="body-sm mt-2 text-slate-600">{{ t("jobs.emptyHint") }}</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="job in filteredPending"
            :key="job.job_id"
            class="card p-4"
          >
            <div class="flex items-start gap-3">
              <div class="min-w-0 flex-1">
                <div class="heading-3 truncate">{{ job.title }}</div>
                <p class="body-sm mt-1 text-slate-600">{{ job.description }}</p>

                <div class="flex flex-wrap gap-2 mt-3">
                  <span v-if="job.job_units" class="chip chip-inactive text-[11px]">
                    <span v-if="job.job_units === 'distance'">{{ job.unit_amount }} km</span>
                    <span v-else-if="job.job_units === 'time'">{{ job.unit_amount }}h</span>
                    <span v-else>{{ job.unit_amount }}</span>
                  </span>
                  <span v-if="typeof job.reward_amount === 'number'" class="chip chip-inactive text-[11px]">
                    💰 {{ job.reward_amount }} {{ t('common.currency') }}
                  </span>
                </div>

                <p class="body-sm mt-2 text-slate-500">
                  {{ t("jobs.allowed") }}: {{ job.allowed_vehicle_types.map(v => t(`vehicles.vehicleTypes.${v}`)).join(", ") }}
                </p>
              </div>

              <button
                class="btn-sm btn-primary shrink-0"
                :disabled="jobsStore.taking"
                @click="openTake(job.batch_id, job.allowed_vehicle_types, job)"
                type="button"
              >
                {{ jobsStore.taking ? '...' : t("jobs.take") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vehicle picker modal -->
    <div
      v-if="showVehiclePicker"
      class="fixed inset-0 z-50 flex items-end bg-black/40"
      @click.self="closePicker"
    >
      <div class="w-full rounded-t-3xl bg-white max-h-[80vh] flex flex-col">
        <div class="px-4 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <div class="body-sm text-slate-600">{{ t("jobs.pickVehicleEyebrow") }}</div>
            <div class="heading-2 truncate mt-1">{{ t("jobs.pickVehicleTitle") }}</div>
          </div>
          <button
            class="btn-sm btn-ghost"
            @click="closePicker"
            type="button"
          >
            ✕
          </button>
        </div>

        <!-- Job preview -->
        <div v-if="pendingJob" class="px-4 py-4 border-b border-slate-200 bg-slate-50">
          <div class="heading-3 truncate">{{ pendingJob.title }}</div>
          <p class="body-sm mt-1">{{ pendingJob.description }}</p>

          <div class="flex flex-wrap gap-2 mt-3">
            <span v-if="pendingJob.job_units" class="chip chip-inactive text-[11px]">
              <span v-if="pendingJob.job_units === 'distance'">{{ pendingJob.unit_amount }} km</span>
              <span v-else-if="pendingJob.job_units === 'time'">{{ pendingJob.unit_amount }}h</span>
              <span v-else>{{ pendingJob.unit_amount }}</span>
            </span>
            <span v-if="typeof pendingJob.reward_amount === 'number'" class="chip chip-inactive text-[11px]">
              💰 {{ pendingJob.reward_amount }} {{ t('common.currency') }}
            </span>
          </div>
        </div>

        <div class="divide-y overflow-auto flex-1">
          <button
            v-for="v in eligibleVehicles"
            :key="v.vehicle_id"
            class="w-full px-4 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
            @click="confirmTake(v.vehicle_id)"
            type="button"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="heading-3 truncate">🚜 {{ v.name }}</div>
                <p class="body-sm mt-1">
                  {{ vehicleTypeEmoji(v.vehicle_type as any) }} {{ t(`vehicles.vehicleTypes.${v.vehicle_type}`) }}
                </p>
              </div>
            </div>
          </button>

          <div v-if="!eligibleVehicles.length" class="px-4 py-8 text-center">
            <div class="heading-3 text-slate-700">{{ t('jobs.noEligibleVehicles') }}</div>
            <p class="body-sm mt-2">{{ t('jobs.noEligibleVehiclesHint') }}</p>
          </div>
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
  switch (String(vt)) {
    case 'excavator': return '⛏️'
    case 'backhoe': return '🚜'
    case 'dump_truck': return '🚚'
    case 'loader': return '🏗️'
    case 'tractor': return '🚜'
    default: return '🚧'
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
