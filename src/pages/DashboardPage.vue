<template>
  <MobileShell>
    <div class="space-y-4">
      <FunCard
          :eyebrow="t('dashboard.titleEyebrow')"
          :title="t('dashboard.title')"
          :subtitle="t('dashboard.subtitle')"
          badge="🚀"
      >
        <div class="grid grid-cols-2 gap-3">
          <button class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            {{ t("dashboard.startJob") }}
          </button>
          <button class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
            {{ t("dashboard.seeJobs") }}
          </button>
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
