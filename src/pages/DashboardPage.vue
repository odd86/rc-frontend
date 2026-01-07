<template>
  <MobileShell>
    <div class="py-6 section">
      <!-- Page header -->
      <div>
        <h1 class="heading-1">{{ t('dashboard.title') }}</h1>
        <p class="body-sm mt-2">{{ t('dashboard.subtitle') }}</p>
      </div>

      <!-- Active jobs section -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="heading-3">{{ t('jobs.activeTitle') }}</h2>
          <RouterLink to="/jobs" class="text-xs font-semibold text-slate-600">
            {{ t('common.viewAll') }}
          </RouterLink>
        </div>

        <div v-if="jobsStore.loadingActive" class="card p-6 text-center">
          <div class="body-sm">{{ t('auth.working') }}</div>
        </div>

        <div v-else-if="jobsStore.active.length === 0" class="card p-6">
          <div class="heading-3 text-slate-700">{{ t('jobs.activeEmpty') }}</div>
          <p class="body-sm mt-2">{{ t('jobs.activeEmptyHint') }}</p>
          <RouterLink to="/jobs" class="btn btn-primary mt-4">
            {{ t('jobs.browseJobs') }}
          </RouterLink>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="job in jobsStore.active"
            :key="job.job_id"
            class="card p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <div class="heading-3 truncate">{{ job.title || t('jobs.unknownTitle') }}</div>
                <p class="body-sm mt-1">{{ job.description || '' }}</p>

                <div class="flex flex-wrap gap-2 mt-3">
                  <span class="chip chip-inactive">
                    {{ vehicleName(job.vehicle_id) }}
                  </span>
                  <span v-if="job.job_units" class="chip chip-inactive">
                    <span v-if="job.job_units === 'distance'">{{ job.unit_amount }} km</span>
                    <span v-else-if="job.job_units === 'time'">{{ job.unit_amount }}h</span>
                    <span v-else>{{ job.unit_amount }}</span>
                  </span>
                  <span v-if="typeof job.reward_amount === 'number'" class="chip chip-inactive">
                    {{ job.reward_amount }} {{ t('common.currency') }}
                  </span>
                </div>
              </div>

              <button
                class="btn-sm btn-primary shrink-0"
                :disabled="jobsStore.completingVehicleId === job.vehicle_id"
                @click="complete(job.vehicle_id)"
                type="button"
              >
                {{ jobsStore.completingVehicleId === job.vehicle_id ? t('auth.working') : t('jobs.complete') }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Fleet summary -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="heading-3">{{ t('nav.vehicles') }}</h2>
          <RouterLink to="/vehicles" class="text-xs font-semibold text-slate-600">
            {{ t('common.viewAll') }}
          </RouterLink>
        </div>

        <div v-if="vehiclesStore.loading" class="card p-6 text-center">
          <div class="body-sm">{{ t('auth.working') }}</div>
        </div>

        <div v-else-if="vehiclesStore.vehicles.length === 0" class="card p-6">
          <div class="heading-3 text-slate-700">{{ t('vehicles.noVehicles') }}</div>
          <p class="body-sm mt-2">{{ t('vehicles.noVehiclesHint') }}</p>
          <RouterLink to="/vehicles/add" class="btn btn-primary mt-4">
            {{ t('vehicles.addVehicle') }}
          </RouterLink>
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <div class="card p-4">
            <div class="body-sm text-slate-600">{{ t('vehicles.totalVehicles') }}</div>
            <div class="heading-2 mt-1">{{ vehiclesStore.vehicles.length }}</div>
          </div>
          <div class="card p-4">
            <div class="body-sm text-slate-600">{{ t('vehicles.activeJobs') }}</div>
            <div class="heading-2 mt-1">{{ jobsStore.active.length }}</div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section>
        <h2 class="heading-3 mb-4">{{ t('company.stats') }}</h2>

        <div v-if="companyStore.loading" class="card p-6 text-center">
          <div class="body-sm">{{ t('auth.working') }}</div>
        </div>

        <div v-else-if="!companyStore.company" class="card p-6">
          <div class="body-sm text-slate-600">{{ t('common.noData') }}</div>
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <div class="card p-4">
            <div class="body-sm text-slate-600">{{ t('company.jobsCompleted') }}</div>
            <div class="heading-2 mt-1">{{ companyStore.company.jobs_completed }}</div>
          </div>
          <div class="card p-4">
            <div class="body-sm text-slate-600">{{ t('company.totalDistance') }}</div>
            <div class="heading-2 mt-1">{{ companyStore.company.total_distance }} km</div>
          </div>
        </div>
      </section>

      <!-- Quick actions -->
      <section>
        <h2 class="heading-3 mb-4">{{ t('dashboard.quickActions') }}</h2>
        <div class="grid grid-cols-2 gap-3">
          <RouterLink to="/jobs" class="btn btn-primary">
            {{ t('dashboard.browseJobs') }}
          </RouterLink>
          <RouterLink to="/vehicles" class="btn btn-secondary">
            {{ t('dashboard.manageVehicles') }}
          </RouterLink>
        </div>
      </section>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MobileShell from '@/components/MobileShell.vue'
import { useJobsStore } from '@/stores/jobs'
import { useVehiclesStore } from '@/stores/vehicles'
import { useCompanyStore } from '@/stores/company'

const { t } = useI18n()
const jobsStore = useJobsStore()
const vehiclesStore = useVehiclesStore()
const companyStore = useCompanyStore()

function vehicleName(vehicleId: string): string {
  const vehicle = vehiclesStore.vehicles.find(v => v.vehicle_id === vehicleId)
  return vehicle?.name || t('jobs.unknownVehicle')
}

async function complete(vehicleId: string) {
  await jobsStore.completeJob(vehicleId).catch(() => null)
  await jobsStore.refreshAll()
  await vehiclesStore.fetchVehicles().catch(() => null)
  await companyStore.fetchMyCompany().catch(() => null)
}

onMounted(async () => {
  // Load all dashboard data
  await Promise.allSettled([
    jobsStore.fetchActive(),
    vehiclesStore.vehicles.length === 0 ? vehiclesStore.fetchVehicles() : Promise.resolve(),
    companyStore.company === null ? companyStore.fetchMyCompany() : Promise.resolve(),
  ])
})
</script>
