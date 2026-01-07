<template>
  <MobileShell>
    <div class="py-6 section">
      <!-- Page header -->
      <div class="mb-6">
        <h1 class="heading-1">{{ t('scoreboard.title') }}</h1>
        <p class="body-sm mt-2">{{ t('scoreboard.subtitle') }}</p>
      </div>

      <!-- Leaderboard -->
      <div class="space-y-2">
        <!-- Top 3 with medal styling -->
        <div class="card p-4 bg-gradient-to-r from-amber-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🥇</div>
              <div>
                <div class="heading-3">Grus Kongen</div>
                <div class="body-sm text-slate-600">XP 999</div>
              </div>
            </div>
            <div class="heading-3 text-slate-900">#1</div>
          </div>
        </div>

        <div class="card p-4 bg-gradient-to-r from-slate-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🥈</div>
              <div>
                <div class="heading-3">Towie Master</div>
                <div class="body-sm text-slate-600">XP 700</div>
              </div>
            </div>
            <div class="heading-3 text-slate-900">#2</div>
          </div>
        </div>

        <div class="card p-4 bg-gradient-to-r from-orange-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🥉</div>
              <div>
                <div class="heading-3">Excavator Pro</div>
                <div class="body-sm text-slate-600">XP 550</div>
              </div>
            </div>
            <div class="heading-3 text-slate-900">#3</div>
          </div>
        </div>
      </div>

      <!-- Coming soon notice -->
      <div class="card p-6 mt-6 border-dashed">
        <div class="heading-3 text-slate-700">{{ t("common.comingSoon") }}</div>
        <p class="body-sm mt-2 text-slate-600">
          {{ t("scoreboard.comingSoonHint") }}
        </p>
      </div>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import MobileShell from "@/components/MobileShell.vue"

const { t } = useI18n()
</script>
