<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Top bar -->
    <header class="fixed inset-x-0 top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold text-slate-900">
            {{ companyName }}
          </div>
          <div class="mt-0.5 text-xs text-slate-600">
            {{ t("topbar.xp") }} {{ xp }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-xs text-slate-600">{{ t("topbar.balance") }}</div>
            <div class="text-sm font-semibold text-slate-900">{{ balance }}</div>
          </div>

<!--          <select-->
<!--              class="rounded-xl border bg-white px-2 py-1 text-xs text-slate-700"-->
<!--              :value="locale"-->
<!--              @change="onLangChange"-->
<!--          >-->
<!--            <option value="nb">{{ t("language.norwegian") }}</option>-->
<!--            <option value="en">{{ t("language.english") }}</option>-->
<!--          </select>-->
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-xl pb-18 pt-16">
      <slot />
    </main>

    <!-- Bottom nav -->
    <nav class="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur">
      <div class="mx-auto grid max-w-xl grid-cols-5 px-2 py-2">
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
