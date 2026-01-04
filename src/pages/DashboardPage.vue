<template>
  <MobileShell>
    <div class="ds-page">
      <FunCard
        :eyebrow="t('dashboard.titleEyebrow')"
        :title="t('dashboard.title')"
        :subtitle="t('dashboard.subtitle')"
        badge="🚀"
      >
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
      </FunCard>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import MobileShell from "../components/MobileShell.vue"
import FunCard from "../components/FunCard.vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>
