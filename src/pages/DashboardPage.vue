<template>
  <MobileShell>
    <div class="py-6 space-y-6">
      <!-- Active jobs -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="heading-2">🧰 {{ t('jobs.activeTitle') }}</h2>
          <RouterLink to="/jobs" class="text-xs font-semibold text-slate-700">
            {{ t('common.viewAll') }} →
          </RouterLink>
        </div>

        <div v-if="jobsStore.loadingActive" class="card p-6 text-center body-sm">
          {{ t('auth.working') }}
        </div>

        <div v-else-if="jobsStore.active.length === 0" class="card p-5">
          <div class="heading-3">{{ t('jobs.activeEmpty') }}</div>
          <p class="body-sm mt-2 text-slate-600">{{ t('jobs.activeEmptyHint') }}</p>
          <RouterLink to="/jobs" class="btn btn-primary mt-4 w-full">
            {{ t('jobs.browseJobs') }}
          </RouterLink>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="job in jobsStore.active.slice(0, 3)"
            :key="job.job_id"
            class="card p-4"
          >
            <div class="flex items-start gap-3">
              <div class="min-w-0 flex-1">
                <div class="heading-3 truncate">{{ job.title || t('jobs.unknownTitle') }}</div>
                <p class="body-sm mt-1 text-slate-600">{{ job.description || '' }}</p>

                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="chip chip-inactive text-[11px]">
                    {{ vehicleName(job.vehicle_id) }}
                  </span>
                  <span v-if="typeof job.reward_amount === 'number'" class="chip chip-inactive text-[11px]">
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
                {{ jobsStore.completingVehicleId === job.vehicle_id ? '...' : t('jobs.complete') }}
              </button>
            </div>
          </div>
          
          <RouterLink v-if="jobsStore.active.length > 3" to="/jobs" class="block text-center body-sm text-slate-700 hover:text-slate-900 font-semibold py-2">
            {{ t('common.viewAll') }} ({{ jobsStore.active.length }})
          </RouterLink>
        </div>
      </section>

      <!-- Quick stats -->
      <section>
        <h2 class="heading-2 mb-3">📊 {{ t('company.stats') }}</h2>

        <div class="grid grid-cols-3 gap-3">
          <div class="card p-4 text-center">
            <div class="body-sm text-slate-600">{{ t('vehicles.totalVehicles') }}</div>
            <div class="heading-2 mt-1">{{ vehiclesStore.vehicles.length }}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="body-sm text-slate-600">{{ t('company.jobsCompleted') }}</div>
            <div class="heading-2 mt-1">{{ companyStore.company?.jobs_completed ?? 0 }}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="body-sm text-slate-600">XP</div>
            <div class="heading-2 mt-1">{{ companyStore.company?.xp ?? 0 }}</div>
          </div>
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
  await Promise.allSettled([
    jobsStore.fetchActive(),
    vehiclesStore.vehicles.length === 0 ? vehiclesStore.fetchVehicles() : Promise.resolve(),
    companyStore.company === null ? companyStore.fetchMyCompany() : Promise.resolve(),
  ])
})
</script>
