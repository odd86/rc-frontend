<template>
  <MobileShell>
    <div class="ds-page">
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-slate-500">{{ t('dashboard.titleEyebrow') }}</div>
            <div class="mt-0.5 truncate text-lg font-semibold text-slate-900">{{ t('dashboard.title') }}</div>
            <div class="mt-0.5 text-sm text-slate-600">{{ t('dashboard.subtitle') }}</div>
          </div>

          <div class="shrink-0 rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            🚀
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <RouterLink
            to="/jobs"
            class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white text-center hover:bg-slate-800"
          >
            🧲 {{ t('dashboard.startJob') }}
          </RouterLink>
          <RouterLink
            to="/vehicles"
            class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 text-center hover:bg-slate-200"
          >
            🚙 {{ t('dashboard.seeJobs') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import MobileShell from "../components/MobileShell.vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>
