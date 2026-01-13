<template>
  <AdminShell>
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <div class="text-xs font-semibold text-slate-500">{{ t("admin.cards.jobsEyebrow") }}</div>
        <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.cards.jobsTitle") }}</div>
        <div class="mt-2 text-sm text-slate-600">{{ t("admin.cards.jobsSubtitle") }}</div>
        <PrimaryButton to="/admin/jobs" class="mt-4">
          {{ t("admin.cards.go") }}
        </PrimaryButton>
      </Card>

      <Card>
        <div class="text-xs font-semibold text-slate-500">{{ t("admin.cards.usersEyebrow") }}</div>
        <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.cards.usersTitle") }}</div>
        <div class="mt-2 text-sm text-slate-600">{{ t("admin.cards.usersSubtitle") }}</div>
        <PrimaryButton to="/admin/users" class="mt-4">
          {{ t("admin.cards.go") }}
        </PrimaryButton>
      </Card>

      <Card>
        <div class="text-xs font-semibold text-slate-500">{{ t("admin.cards.settingsEyebrow") }}</div>
        <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.cards.settingsTitle") }}</div>
        <div class="mt-2 text-sm text-slate-600">{{ t("admin.cards.settingsSubtitle") }}</div>
        <div class="mt-4 rounded-2xl border border-dashed p-4 text-sm text-slate-600">
          {{ t("common.comingSoon") }}
        </div>
      </Card>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import AdminShell from "@/components/AdminShell.vue"
import Card from "@/components/ui/Card.vue"
import PrimaryButton from "@/components/ui/PrimaryButton.vue"
const { t } = useI18n()
</script>
