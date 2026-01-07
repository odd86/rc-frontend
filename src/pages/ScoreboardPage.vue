<template>
  <MobileShell>
    <div class="px-4 pt-4 space-y-4">
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold text-slate-500">{{ t("scoreboard.titleEyebrow") }}</div>
            <div class="mt-0.5 truncate text-lg font-semibold text-slate-900">{{ t("scoreboard.title") }}</div>
            <div class="mt-0.5 text-sm text-slate-600">{{ t("scoreboard.subtitle") }}</div>
          </div>
          <div class="shrink-0 rounded-2xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            🏆
          </div>
        </div>

        <div class="rounded-3xl border bg-white p-4 space-y-2">
          <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="text-lg">🥇</div>
              <div>
                <div class="text-sm font-semibold text-slate-900">Grus Kongen</div>
                <div class="text-xs text-slate-600">✨ XP 999</div>
              </div>
            </div>
            <div class="text-sm font-semibold text-slate-900">1</div>
          </div>

          <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="text-lg">🥈</div>
              <div>
                <div class="text-sm font-semibold text-slate-900">Towie Master</div>
                <div class="text-xs text-slate-600">✨ XP 700</div>
              </div>
            </div>
            <div class="text-sm font-semibold text-slate-900">2</div>
          </div>

          <div class="rounded-2xl border border-dashed p-4 text-sm text-slate-600">
            🧪 {{ t("common.comingSoon") }}
          </div>
        </div>
      </div>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import MobileShell from "@/components/MobileShell.vue"

const { t } = useI18n()
</script>
