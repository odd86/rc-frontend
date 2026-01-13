<template>
  <MobileShell>
    <div class="ds-page">
      <Card
        :eyebrow="t('scoreboard.titleEyebrow')"
        :title="t('scoreboard.title')"
        :subtitle="t('scoreboard.subtitle')"
        badge="Leaderboard"
      >
        <div class="space-y-2">
          <ListRow title="Grus Kongen" subtitle="XP 999">
            <template #icon>
              <Badge variant="success">#1</Badge>
            </template>
            <template #trailing>
              <Icon name="lucide:crown" size="sm" />
            </template>
          </ListRow>

          <ListRow title="Towie Master" subtitle="XP 700">
            <template #icon>
              <Badge variant="neutral">#2</Badge>
            </template>
            <template #trailing>
              <Icon name="lucide:medal" size="sm" />
            </template>
          </ListRow>

          <EmptyState :title="t('common.comingSoon')" subtitle="More ranking insights will land soon." />
        </div>
      </Card>
    </div>
  </MobileShell>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import MobileShell from "@/components/MobileShell.vue"
import Card from "@/components/ui/Card.vue"
import ListRow from "@/components/ui/ListRow.vue"
import Badge from "@/components/ui/Badge.vue"
import EmptyState from "@/components/ui/EmptyState.vue"
import Icon from "@/components/ui/Icon.vue"

const { t } = useI18n()
</script>
