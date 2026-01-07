<template>
  <MobileShell>
    <div class="py-6 space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="heading-2">🏢 {{ t('company.title') }}</h1>
        <p class="body-sm mt-2 text-slate-600">{{ t('company.subtitle') }}</p>
      </div>

      <!-- Loading -->
      <div v-if="companyStore.loading" class="card p-6 text-center body-sm">
        {{ t('auth.working') }}
      </div>

      <!-- Error -->
      <div v-else-if="companyStore.error" class="alert alert-error">
        {{ companyStore.error }}
      </div>

      <!-- No data -->
      <div v-else-if="!company" class="card p-6">
        <div class="heading-3">{{ t('common.noData') }}</div>
        <p class="body-sm mt-2 text-slate-600">{{ t('company.noDataHint') }}</p>
      </div>

      <!-- Company stats -->
      <div v-else class="space-y-6">
        <!-- Overview -->
        <div class="card p-6">
          <div class="heading-2 mb-4">{{ company.name }}</div>
          <div class="grid grid-cols-2 gap-4">
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

        <!-- Stats -->
        <div>
          <h2 class="heading-3 mb-3">📊 {{ t('company.stats') }}</h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="card p-4">
              <div class="body-sm text-slate-600">{{ t('company.jobsCompleted') }}</div>
              <div class="heading-2 mt-1">{{ company.jobs_completed }}</div>
            </div>
            <div class="card p-4">
              <div class="body-sm text-slate-600">{{ t('company.totalDistance') }}</div>
              <div class="heading-2 mt-1">{{ company.total_distance }} km</div>
            </div>
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

onMounted(async () => {
  if (!companyStore.company) {
    await companyStore.fetchMyCompany().catch(() => null)
  }
})
</script>
