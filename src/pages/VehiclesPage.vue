<template>
  <MobileShell>
    <div class="px-4 pt-4 space-y-4">
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-slate-500">{{ t("vehicles.titleEyebrow") }}</div>
            <div class="mt-0.5 text-lg font-semibold text-slate-900">{{ t("nav.vehicles") }}</div>
            <div class="mt-0.5 text-sm text-slate-600">{{ t("vehicles.subtitle") }}</div>
          </div>

          <div class="shrink-0 rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            🔧
          </div>
        </div>

        <div class="rounded-3xl border bg-white overflow-hidden">
          <div class="divide-y">
            <RouterLink
              v-for="vehicle in vehiclesStore.vehicles"
              :key="vehicle.vehicle_id"
              :to="`/vehicles/${vehicle.vehicle_id}`"
              class="group block"
            >
              <div class="px-3 py-3 transition group-hover:bg-slate-50 active:scale-[0.99]">
                <div class="flex items-center gap-3">
                  <!-- Icon + status ring -->
                  <div class="relative">
                    <div
                      class="h-10 w-10 rounded-2xl grid place-items-center border bg-slate-50"
                      :class="statusRingClass(vehicle)"
                    >
                      <img
                        :src="`/src/assets/icons/vehicles/${vehicle?.vehicle_type}.svg`"
                        class="h-6 w-6"
                        alt=""
                      />
                    </div>

                    <!-- Tiny warning dot -->
                    <div
                      v-if="status(vehicle).level !== 'ok'"
                      class="absolute -right-1 -top-1 h-5 min-w-5 px-1 rounded-full text-[10px] font-bold grid place-items-center border"
                      :class="statusDotClass(vehicle)"
                      @click.prevent
                    >
                      {{ status(vehicle).badge }}
                    </div>
                  </div>

                  <!-- Main text -->
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <div class="truncate flex-grow font-semibold text-slate-900">
                        {{ vehicle?.name || "Gravel King" }}
                      </div>

                      <!-- Small status pill -->
                      <div
                        class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold border"
                        :class="statusPillClass(vehicle)"
                      >
                        {{ status(vehicle).label }}
                      </div>
                    </div>

                    <div class="mt-1 flex items-center gap-2 text-xs text-slate-600">
                      <span class="truncate">
                        {{ t(`vehicles.vehicleTypes.${vehicle?.vehicle_type}`) }}
                      </span>
                    </div>
                  </div>

                  <!-- Quick actions -->
                  <div class="flex items-center gap-2">
                    <!-- Select quick button -->

                    <!-- More menu -->
                    <div class="relative">
                      <div
                        v-if="openMenuId === vehicle.id"
                        class="absolute right-0 mt-2 w-44 rounded-2xl border bg-white shadow-lg overflow-hidden z-20"
                        @click.prevent
                      >
                        <button
                          class="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                          @click="goTo(vehicle.id)"
                        >
                          🧾 <span>{{ t("common.details") ?? "Details" }}</span>
                        </button>

                        <button
                          class="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                          @click="rename(vehicle)"
                        >
                          ✏️ <span>{{ t("common.rename") ?? "Rename" }}</span>
                        </button>

                        <button
                          class="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                          @click="service(vehicle)"
                        >
                          🛠️ <span>{{ t("vehicles.maintenance") }}</span>
                        </button>

                        <button
                          class="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-700 flex items-center gap-2"
                          @click="confirmDelete(vehicle)"
                        >
                          🗑️ <span>{{ t("common.delete") ?? "Delete" }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Optional: tiny “flavor line” when there is an issue -->
                <div v-if="status(vehicle).hint" class="mt-2 text-xs" :class="statusHintClass(vehicle)">
                  {{ status(vehicle).hint }}
                </div>
              </div>
            </RouterLink>
          </div>

          <div class="border-t border-dashed">
            <RouterLink
              to="/vehicles/add"
              class="block w-full px-4 py-4 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {{ t("vehicles.addVehicle") }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import MobileShell from "../components/MobileShell.vue"
import { useVehiclesStore } from "@/stores/vehicles"

const { t } = useI18n()
const router = useRouter()
const vehiclesStore = useVehiclesStore()

const openMenuId = ref<string | null>(null)

const deleteTarget = ref<any | null>(null)
const deleteInput = ref("")

const DELETE_WORD = computed(() => {
  // Use i18n if you want different languages
  // Example translations:
  // en: "delete"
  // no: "slett"
  return t("common.deleteConfirmWord") || "delete"
})

const canConfirmDelete = computed(() => {
  return deleteInput.value.trim().toLowerCase() === DELETE_WORD.value.toLowerCase()
})

onMounted(async () => {
  if (!vehiclesStore.vehicles.length) {
    await vehiclesStore.fetchVehicles().catch(() => null)
  }
  // Close menu when tapping elsewhere
  window.addEventListener("click", () => (openMenuId.value = null))
})

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function goTo(id: string) {
  openMenuId.value = null
  router.push(`/vehicles/${id}`)
}

function selectVehicle(id: string) {
  openMenuId.value = null
  vehiclesStore.selectVehicle(id)
}

function rename(vehicle: any) {
  openMenuId.value = null
  const current = vehicle?.name || ""
  const next = window.prompt("New vehicle name", current)?.trim()
  if (!next || next === current) return
  vehiclesStore.renameVehicle(vehicle.id, next).catch(() => null)
}

function service(vehicle: any) {
  openMenuId.value = null
  // You can route to a service subpage later:
  // router.push(`/vehicles/${vehicle.id}/service`)
  router.push(`/vehicles/${vehicle.id}`)
}

function confirmDelete(vehicle: any) {
  openMenuId.value = null
  const name = vehicle?.name || "this vehicle"
  const ok = window.confirm(`Delete ${name}? This cannot be undone.`)
  if (!ok) return
  vehiclesStore.deleteVehicle(vehicle.id).catch(() => null)
}

/**
 * Status logic
 * Replace these heuristics with your real fields when available.
 * Suggested fields to add later:
 * - vehicle.errors_count
 * - vehicle.has_error
 * - vehicle.service_due_km
 * - vehicle.health (0-100)
 */
function status(vehicle: any) {
  const errors = Number(vehicle?.errors_count ?? 0)
  const serviceDue = Boolean(vehicle?.service_due) // or vehicle.service_due_km <= 0
  const health = vehicle?.health ?? null // optional

  if (errors > 0) {
    return { level: "error", label: "ERROR", badge: errors > 9 ? "9+" : String(errors), hint: "Needs attention" }
  }
  if (serviceDue || (typeof health === "number" && health < 35)) {
    return { level: "warn", label: "WARN", badge: "!", hint: "Service recommended" }
  }
  return { level: "ok", label: "OK", badge: "", hint: "" }
}

function statusRingClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "border-red-300"
  if (lvl === "warn") return "border-amber-300"
  return "border-emerald-200"
}

function statusDotClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "bg-red-100 border-red-200 text-red-700"
  return "bg-amber-100 border-amber-200 text-amber-800"
}

function statusPillClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "bg-red-50 border-red-200 text-red-700"
  if (lvl === "warn") return "bg-amber-50 border-amber-200 text-amber-800"
  return "bg-emerald-50 border-emerald-200 text-emerald-800"
}

function statusHintClass(vehicle: any) {
  const lvl = status(vehicle).level
  if (lvl === "error") return "text-red-700"
  return "text-amber-800"
}
</script>
