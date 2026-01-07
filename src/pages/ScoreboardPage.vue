<template>
  <MobileShell>
    <div class="py-6 space-y-4">
      <!-- Page header -->
      <div>
        <h1 class="heading-2">🏆 {{ t('scoreboard.title') }}</h1>
        <p class="body-sm mt-2 text-slate-600">{{ t('scoreboard.subtitle') }}</p>
      </div>

      <!-- Leaderboard -->
      <div class="space-y-2">
        <div class="card p-4 bg-gradient-to-r from-amber-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🥇</div>
              <div>
                <div class="heading-3">Grus Kongen</div>
                <div class="body-sm text-slate-600">XP 999</div>
              </div>
            </div>
            <div class="heading-3">#1</div>
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
            <div class="heading-3">#2</div>
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
            <div class="heading-3">#3</div>
          </div>
        </div>
      </div>

      <!-- Coming soon -->
      <div class="card p-6 border-dashed">
        <div class="heading-3">{{ t("common.comingSoon") }}</div>
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
