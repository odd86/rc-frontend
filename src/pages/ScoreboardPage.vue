<template>
  <MobileShell>
    <div class="space-y-4">
      <FunCard
          :eyebrow="t('scoreboard.titleEyebrow')"
          :title="t('scoreboard.title')"
          :subtitle="t('scoreboard.subtitle')"
          badge="🏆"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="text-lg">🥇</div>
              <div>
                <div class="text-sm font-semibold text-slate-900">Grus Kongen</div>
                <div class="text-xs text-slate-600">XP 999</div>
              </div>
            </div>
            <div class="text-sm font-semibold text-slate-900">1</div>
          </div>

          <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="text-lg">🥈</div>
              <div>
                <div class="text-sm font-semibold text-slate-900">Towie Master</div>
                <div class="text-xs text-slate-600">XP 700</div>
              </div>
            </div>
            <div class="text-sm font-semibold text-slate-900">2</div>
          </div>

          <div class="rounded-2xl border border-dashed p-4 text-sm text-slate-600">
            {{ t("common.comingSoon") }}
          </div>
        </div>
      </FunCard>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import MobileShell from "@/components/MobileShell.vue"
import FunCard from "@/components/FunCard.vue"

const { t } = useI18n()
</script>
