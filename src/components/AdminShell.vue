<template>
  <div class="min-h-screen bg-[var(--ds-bg)]">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <div>
          <div class="text-xs font-semibold text-slate-500">{{ t("admin.titleEyebrow") }}</div>
          <div class="text-lg font-semibold text-slate-900">{{ t("admin.title") }}</div>
        </div>

        <div class="flex items-center gap-2">
          <SecondaryButton to="/dashboard">
            {{ t("admin.backToApp") }}
          </SecondaryButton>
        </div>
      </div>

      <div class="mx-auto max-w-5xl px-4 pb-4">
        <div class="flex gap-2">
          <RouterLink class="admin-tab" to="/admin/dashboard">{{ t("admin.nav.dashboard") }}</RouterLink>
          <RouterLink class="admin-tab" to="/admin/jobs">{{ t("admin.nav.jobs") }}</RouterLink>
          <RouterLink class="admin-tab" to="/admin/users">{{ t("admin.nav.users") }}</RouterLink>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import SecondaryButton from "./ui/SecondaryButton.vue"
const { t } = useI18n()
</script>

<style scoped>
.admin-tab {
  display: inline-block;
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  background: white;
  border: 1px solid rgb(226 232 240);
  color: rgb(51 65 85);
  font-weight: 600;
}
.admin-tab.router-link-active {
  background: rgb(15 23 42);
  color: white;
  border-color: rgb(15 23 42);
}
</style>
