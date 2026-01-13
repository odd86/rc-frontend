<template>
  <MobileShell>
    <div class="ds-page">
      <Card
        :eyebrow="t('dashboard.titleEyebrow')"
        :title="t('dashboard.title')"
        :subtitle="t('dashboard.subtitle')"
        badge="Driver"
        variant="strong"
      >
        <div class="grid grid-cols-2 gap-3">
          <PrimaryButton to="/jobs">
            {{ t('dashboard.startJob') }}
          </PrimaryButton>
          <SecondaryButton to="/vehicles">
            {{ t('dashboard.seeJobs') }}
          </SecondaryButton>
        </div>
      </Card>

      <div class="grid grid-cols-2 gap-3">
        <StatTile :label="t('company.jobsCompleted')" :value="jobsCompleted" :hint="t('dashboard.subtitle')">
          <template #icon>
            <Icon name="lucide:check-circle" size="sm" />
          </template>
        </StatTile>
        <StatTile :label="t('company.totalDistance')" :value="totalDistance" hint="km">
          <template #icon>
            <Icon name="lucide:route" size="sm" />
          </template>
        </StatTile>
      </div>

      <ChartCard
        :eyebrow="t('dashboard.titleEyebrow')"
        :title="t('dashboard.subtitle')"
        subtitle="Last 7 sessions"
        :config="chartConfig"
      />
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import Card from "@/components/ui/Card.vue"
import PrimaryButton from "@/components/ui/PrimaryButton.vue"
import SecondaryButton from "@/components/ui/SecondaryButton.vue"
import StatTile from "@/components/ui/StatTile.vue"
import ChartCard from "@/components/ui/ChartCard.vue"
import Icon from "@/components/ui/Icon.vue"
import { useCompanyStore } from "@/stores/company"

const { t } = useI18n()
const companyStore = useCompanyStore()

onMounted(async () => {
  if (!companyStore.company) {
    await companyStore.fetchMyCompany().catch(() => null)
  }
})

const jobsCompleted = computed(() => companyStore.company?.jobs_completed ?? 0)
const totalDistance = computed(() => companyStore.company?.total_distance ?? 0)

const chartConfig = computed(() => {
  const base = Number(jobsCompleted.value) || 4
  const data = [base - 2, base - 1, base, base + 2, base + 1, base + 3, base + 4].map((v) =>
    Math.max(1, v)
  )

  return {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data,
          borderColor: "#111827",
          backgroundColor: "rgba(17, 24, 39, 0.08)",
          tension: 0.4,
          fill: true,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#111827",
          titleColor: "#fff",
          bodyColor: "#fff",
          displayColors: false,
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#94A3B8", font: { size: 10 } } },
        y: { display: false },
      },
    },
  }
})
</script>
