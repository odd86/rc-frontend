<template>
  <AdminShell>
    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-3xl border bg-white p-5">
        <div class="text-xs font-semibold text-slate-500">{{ t("admin.cards.jobsEyebrow") }}</div>
        <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.cards.jobsTitle") }}</div>
        <div class="mt-2 text-sm text-slate-600">{{ t("admin.cards.jobsSubtitle") }}</div>
        <RouterLink
            to="/admin/jobs"
            class="mt-4 inline-block rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {{ t("admin.cards.go") }}
        </RouterLink>
      </div>

      <div class="rounded-3xl border bg-white p-5">
        <div class="text-xs font-semibold text-slate-500">{{ t("admin.cards.usersEyebrow") }}</div>
        <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.cards.usersTitle") }}</div>
        <div class="mt-2 text-sm text-slate-600">{{ t("admin.cards.usersSubtitle") }}</div>
        <RouterLink
            to="/admin/users"
            class="mt-4 inline-block rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {{ t("admin.cards.go") }}
        </RouterLink>
      </div>

      <div class="rounded-3xl border bg-white p-5">
        <div class="text-xs font-semibold text-slate-500">{{ t("admin.cards.settingsEyebrow") }}</div>
        <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.cards.settingsTitle") }}</div>
        <div class="mt-2 text-sm text-slate-600">{{ t("admin.cards.settingsSubtitle") }}</div>
        <div class="mt-4 rounded-2xl border border-dashed p-4 text-sm text-slate-600">
          {{ t("common.comingSoon") }}
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import AdminShell from "@/components/AdminShell.vue"
const { t } = useI18n()
</script>
