<template>
  <div class="min-h-screen bg-gray-50">
    <header class="border-b bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-gray-900"></div>
          <div>
            <div class="text-sm text-gray-500">RC Life</div>
            <div class="text-base font-semibold leading-tight">Dashboard</div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <slot name="topright" />
          <button
              class="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
              @click="onLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto grid max-w-6xl grid-cols-12 gap-4 px-4 py-6">
      <nav class="col-span-12 md:col-span-3">
        <div class="rounded-2xl border bg-white p-3">
          <RouterLink class="navlink" to="/jobs">Jobs</RouterLink>
          <RouterLink class="navlink" to="/company">Company</RouterLink>
          <RouterLink class="navlink" to="/vehicles">Vehicles</RouterLink>
        </div>
      </nav>

      <main class="col-span-12 md:col-span-9">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth"
import { useCompanyStore } from "../stores/company"
import { useVehiclesStore } from "../stores/vehicles"
import { useRouter } from "vue-router"

const router = useRouter()
const auth = useAuthStore()
const company = useCompanyStore()
const vehicles = useVehiclesStore()

function onLogout() {
  auth.logout()
  company.clear()
  vehicles.clear()
  router.push("/login")
}
</script>

<style scoped>
.navlink {
  display: block;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  color: rgb(31 41 55);
}
.navlink.router-link-active {
  background: rgb(243 244 246);
  font-weight: 600;
}
</style>
