<template>
  <div class="h-full w-full overflow-hidden bg-slate-50 flex flex-col">
    <header class="fixed top-0 left-0 w-full z-40 border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-xl items-center justify-between px-4 py-4">
        <div class="min-w-0 flex-1">
          <div class="truncate text-base font-semibold text-slate-900">
            {{ companyName }}
          </div>
          <div class="mt-1 text-xs text-slate-600">
            XP {{ xp }}
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="text-xs text-slate-600">{{ t("topbar.balance") }}</div>
            <div class="text-base font-semibold text-slate-900">{{ balance }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Content area with consistent spacing -->
    <main class="overflow-y-auto overflow-x-hidden pt-16 pb-20 flex-1">
      <div class="mx-auto max-w-xl px-4">
        <slot />
      </div>
    </main>

    <!-- Bottom navigation -->
    <nav class="fixed bottom-0 left-0 w-full z-40 border-t border-slate-200 bg-white">
      <div class="mx-auto grid max-w-xl grid-cols-5">
        <TabLink to="/dashboard" labelKey="nav.dashboard" icon="🏠" />
        <TabLink to="/company" labelKey="nav.company" icon="🏢" />
        <TabLink to="/vehicles" labelKey="nav.vehicles" icon="🚙" />
        <TabLink to="/jobs" labelKey="nav.jobs" icon="🧰" />
        <TabLink to="/scoreboard" labelKey="nav.scoreboard" icon="🏆" />
      </div>
    </nav>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

import TabLink from "./TabLink.vue"
import { setLanguage } from "@/i18n"

import { useCompanyStore } from "@/stores/company"
import { useVehiclesStore } from "@/stores/vehicles"

const { t, locale } = useI18n()
const router = useRouter()

const companyStore = useCompanyStore()
const vehiclesStore = useVehiclesStore()

const companyName = computed(() => companyStore.company?.name || t("nav.company"))
const xp = computed(() => companyStore.company?.xp ?? 0)
const balance = computed(() => companyStore.company?.money ?? 0)

function onLangChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as "nb" | "en"
  setLanguage(value)
}

onMounted(async () => {
  // Load company
  if (!companyStore.company) {
    await companyStore.fetchMyCompany().catch(() => null)
  }

  // Load vehicles
  if (!vehiclesStore.vehicles.length) {
    await vehiclesStore.fetchVehicles().catch(() => null)
  }

  // Force onboarding if no vehicles
  if (vehiclesStore.needsVehicle) {
    router.replace("/vehicles/add")
  }
})
</script>
