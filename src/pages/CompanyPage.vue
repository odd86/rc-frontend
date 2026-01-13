<template>
  <MobileShell>
    <div class="ds-page">
      <Card
        :eyebrow="t('company.titleEyebrow')"
        :title="t('company.title')"
        :subtitle="t('company.subtitle')"
        badge="Company"
      >
        <div class="grid grid-cols-2 gap-3">
          <StatTile :label="t('company.jobsCompleted')" :value="company?.jobs_completed ?? 0">
            <template #icon>
              <Icon name="lucide:check-circle" size="sm" />
            </template>
          </StatTile>

          <StatTile :label="t('company.totalDistance')" :value="company?.total_distance ?? 0" hint="km">
            <template #icon>
              <Icon name="lucide:route" size="sm" />
            </template>
          </StatTile>
        </div>

        <div class="mt-4">
          <EmptyState :title="t('common.comingSoon')" subtitle="More company insights are on the way." />
        </div>
      </Card>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import MobileShell from "../components/MobileShell.vue"
import Card from "@/components/ui/Card.vue"
import StatTile from "@/components/ui/StatTile.vue"
import EmptyState from "@/components/ui/EmptyState.vue"
import Icon from "@/components/ui/Icon.vue"
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
