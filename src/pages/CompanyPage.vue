<template>
  <MobileShell>
    <div class="px-4 pt-4 space-y-4">
      <FunCard
        :eyebrow="t('company.titleEyebrow')"
        :title="t('company.title')"
        :subtitle="t('company.subtitle')"
        badge="🏢"
      >
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-2xl bg-slate-50 p-4">
            <div class="text-xs text-slate-500">✅ {{ t('company.jobsCompleted') }}</div>
            <div class="mt-1 text-lg font-semibold text-slate-900">
              {{ company?.jobs_completed ?? 0 }}
            </div>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <div class="text-xs text-slate-500">🛣️ {{ t('company.totalDistance') }}</div>
            <div class="mt-1 text-lg font-semibold text-slate-900">
              {{ company?.total_distance ?? 0 }}
            </div>
          </div>
        </div>

        <div class="mt-4 rounded-2xl border border-dashed p-4 text-sm text-slate-600">
          🧪 {{ t('common.comingSoon') }}
        </div>
      </FunCard>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import FunCard from "../components/FunCard.vue"
import { useCompanyStore } from "@/stores/company"

const { t } = useI18n()
const companyStore = useCompanyStore()

onMounted(async () => {
  if (!companyStore.company) {
    await companyStore.fetchMyCompany().catch(() => null)
  }
})

const company = computed(() => companyStore.company)
</script>
