<template>
  <div class="h-full w-full overflow-hidden bg-[var(--ds-bg)] flex flex-col">
    <TopBar :title="companyName" :subtitle="`${t('topbar.xp')} ${xp}`">
      <template #actions>
        <div class="text-right">
          <div class="text-xs text-slate-500">{{ t("topbar.balance") }}</div>
          <div class="text-sm font-semibold text-slate-900">{{ balance }}</div>
        </div>
      </template>
    </TopBar>

    <main class="overflow-y-auto overflow-x-hidden pt-16 pb-20 flex-1">
      <div class="mx-auto max-w-xl px-2 py-4">
        <slot />
      </div>
    </main>

    <BottomNav :items="navItems" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

import TopBar from "./ui/TopBar.vue"
import BottomNav from "./ui/BottomNav.vue"

import { useCompanyStore } from "@/stores/company"
import { useVehiclesStore } from "@/stores/vehicles"

const { t } = useI18n()
const router = useRouter()

const companyStore = useCompanyStore()
const vehiclesStore = useVehiclesStore()

const companyName = computed(() => companyStore.company?.name || t("nav.company"))
const xp = computed(() => companyStore.company?.xp ?? 0)
const balance = computed(() => companyStore.company?.money ?? 0)

const navItems = computed(() => [
  { to: "/dashboard", label: t("nav.dashboard"), icon: "lucide:home" },
  { to: "/company", label: t("nav.company"), icon: "lucide:building-2" },
  { to: "/vehicles", label: t("nav.vehicles"), icon: "lucide:truck" },
  { to: "/jobs", label: t("nav.jobs"), icon: "lucide:briefcase" },
  { to: "/scoreboard", label: t("nav.scoreboard"), icon: "lucide:trophy" },
])

onMounted(async () => {
  if (!companyStore.company) {
    await companyStore.fetchMyCompany().catch(() => null)
  }

  if (!vehiclesStore.vehicles.length) {
    await vehiclesStore.fetchVehicles().catch(() => null)
  }

  if (vehiclesStore.needsVehicle) {
    router.replace("/vehicles/add")
  }
})
</script>
