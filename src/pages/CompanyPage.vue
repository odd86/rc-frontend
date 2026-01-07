<template>
  <MobileShell>
    <div class="px-4 pt-4 space-y-4">
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-slate-500">{{ t("company.titleEyebrow") }}</div>
            <div class="mt-0.5 truncate text-lg font-semibold text-slate-900">{{ t("company.title") }}</div>
            <div class="mt-0.5 text-sm text-slate-600">{{ t("company.subtitle") }}</div>
          </div>
          <div class="shrink-0 rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            🏢
          </div>
        </div>

        <div class="rounded-3xl border bg-white p-4 space-y-4">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-2xl bg-slate-50 p-4">
              <div class="text-xs text-slate-500">✅ {{ t("company.jobsCompleted") }}</div>
              <div class="mt-1 text-lg font-semibold text-slate-900">
                {{ company?.jobs_completed ?? 0 }}
              </div>
            </div>

            <div class="rounded-2xl bg-slate-50 p-4">
              <div class="text-xs text-slate-500">🛣️ {{ t("company.totalDistance") }}</div>
              <div class="mt-1 text-lg font-semibold text-slate-900">
                {{ company?.total_distance ?? 0 }}
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-dashed p-4 text-sm text-slate-600">
            🧪 {{ t("common.comingSoon") }}
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

onMounted(async () => {
  if (!companyStore.company) {
    await companyStore.fetchMyCompany().catch(() => null)
  }
})

const company = computed(() => companyStore.company)
</script>
