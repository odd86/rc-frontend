<template>
  <MobileShell>
    <div class="py-6 section">
      <!-- Page header -->
      <div class="mb-6">
        <h1 class="heading-1">{{ t('company.title') }}</h1>
        <p class="body-sm mt-2">{{ t('company.subtitle') }}</p>
      </div>

      <!-- Loading state -->
      <div v-if="companyStore.loading" class="card p-6 text-center">
        <div class="body-sm">{{ t('auth.working') }}</div>
      </div>

      <!-- Error state -->
      <div v-else-if="companyStore.error" class="alert alert-error">
        <div class="font-semibold">{{ t('common.error') }}</div>
        <p class="mt-1">{{ companyStore.error }}</p>
      </div>

      <!-- No data state -->
      <div v-else-if="!company" class="card p-6">
        <div class="heading-3 text-slate-700">{{ t('common.noData') }}</div>
        <p class="body-sm mt-2">{{ t('company.noDataHint') }}</p>
      </div>

      <!-- Company stats -->
      <div v-else class="section-compact">
        <!-- Overview card -->
        <div class="card p-6">
          <div class="heading-2">{{ company.name }}</div>
          <div class="flex items-center gap-4 mt-4">
            <div>
              <div class="body-sm text-slate-600">XP</div>
              <div class="heading-2 mt-1">{{ company.xp }}</div>
            </div>
            <div>
              <div class="body-sm text-slate-600">{{ t('topbar.balance') }}</div>
              <div class="heading-2 mt-1">{{ company.money }}</div>
            </div>
          </div>
        </div>

        <!-- Performance metrics -->
        <div>
          <h2 class="heading-3 mb-3">{{ t('company.performance') }}</h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="card p-4">
              <div class="body-sm text-slate-600">{{ t('company.jobsCompleted') }}</div>
              <div class="heading-2 mt-1">{{ company.jobs_completed }}</div>
            </div>

            <div class="card p-4">
              <div class="body-sm text-slate-600">{{ t('company.totalDistance') }}</div>
              <div class="heading-2 mt-1">{{ company.total_distance }} km</div>
            </div>
          </div>
        </div>

        <!-- Financial summary -->
        <div>
          <h2 class="heading-3 mb-3">{{ t('company.financials') }}</h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="card p-4">
              <div class="body-sm text-slate-600">{{ t('company.moneyEarned') }}</div>
              <div class="heading-2 mt-1">{{ company.money_earned }}</div>
            </div>

            <div class="card p-4">
              <div class="body-sm text-slate-600">{{ t('company.moneySpent') }}</div>
              <div class="heading-2 mt-1">{{ company.money_spent }}</div>
            </div>
          </div>
        </div>

        <!-- Company info -->
        <div class="card p-4">
          <div class="body-sm text-slate-600">{{ t('company.companyId') }}</div>
          <div class="body mt-1 font-mono text-xs break-all">{{ company.company_id }}</div>

          <div class="body-sm text-slate-600 mt-3">{{ t('company.createdAt') }}</div>
          <div class="body mt-1">{{ formatDate(company.created_at) }}</div>
        </div>
      </div>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import { useCompanyStore } from "@/stores/company"

const { t } = useI18n()
const companyStore = useCompanyStore()

const company = computed(() => companyStore.company)

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

onMounted(async () => {
  if (!companyStore.company) {
    await companyStore.fetchMyCompany().catch(() => null)
  }
})
</script>
