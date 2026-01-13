<template>
  <AdminShell>
    <div class="space-y-4">
      <Card>
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-xs font-semibold text-slate-500">{{ t("admin.users.eyebrow") }}</div>
            <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.users.title") }}</div>
            <div class="mt-1 text-sm text-slate-600">{{ t("admin.users.subtitle") }}</div>
          </div>

          <SecondaryButton :disabled="loading" @click="refresh" type="button">
            {{ t("admin.actions.refresh") }}
          </SecondaryButton>
        </div>

        <div class="mt-4">
          <TextInput v-model="q" :label="t('admin.users.search')" :placeholder="t('admin.users.search')" />
        </div>

        <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>

        <EmptyState v-if="!loading && filtered.length === 0" :title="t('admin.users.empty')" />

        <div class="mt-4 space-y-3">
          <Card v-for="u in filtered" :key="u.user_id">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate font-semibold text-slate-900">{{ u.username }}</div>
                <div class="mt-1 text-xs text-slate-600">
                  id: {{ u.user_id }}
                </div>

                <div class="mt-2 flex flex-wrap gap-2 text-xs">
                  <Badge v-if="u.is_admin" variant="neutral">admin</Badge>
                  <Badge v-if="u.deleted" variant="warning">deleted</Badge>
                </div>
              </div>

              <PrimaryButton size="sm" @click="openChange(u.user_id, u.username)" type="button">
                {{ t("admin.users.changePassword") }}
              </PrimaryButton>
            </div>
          </Card>
        </div>

        <div v-if="loading" class="mt-4 text-sm text-slate-600">{{ t("auth.working") }}</div>
      </Card>

      <Card v-if="showChange">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-xs font-semibold text-slate-500">{{ t("admin.users.changePassword") }}</div>
            <div class="mt-1 text-lg font-semibold text-slate-900">
              {{ selectedUsername }}
            </div>
            <div class="mt-1 text-sm text-slate-600">
              {{ t("admin.users.passwordHint") }}
            </div>
          </div>

          <SecondaryButton size="sm" @click="closeChange" type="button">
            {{ t("admin.actions.close") }}
          </SecondaryButton>
        </div>

        <form class="mt-4 space-y-3" @submit.prevent="submitChange">
          <TextInput
            v-model="newPassword"
            :label="t('admin.users.newPassword')"
            type="password"
            autocomplete="new-password"
          />

          <PrimaryButton class="w-full" :disabled="changing || newPassword.length < 8" type="submit">
            {{ changing ? t("auth.working") : t("admin.users.savePassword") }}
          </PrimaryButton>

          <p v-if="changeError" class="text-sm text-red-600">{{ changeError }}</p>
          <p v-if="changeSuccess" class="text-sm text-emerald-700">{{ changeSuccess }}</p>
        </form>
      </Card>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import AdminShell from "@/components/AdminShell.vue"
import Card from "@/components/ui/Card.vue"
import TextInput from "@/components/ui/TextInput.vue"
import PrimaryButton from "@/components/ui/PrimaryButton.vue"
import SecondaryButton from "@/components/ui/SecondaryButton.vue"
import Badge from "@/components/ui/Badge.vue"
import EmptyState from "@/components/ui/EmptyState.vue"
import type { AdminUser } from "@/types/api"
import { adminChangeUserPassword, adminGetAllUsers } from "@/api/endpoints"

const { t } = useI18n()

const loading = ref(false)
const error = ref("")
const users = ref<AdminUser[]>([])
const q = ref("")

const showChange = ref(false)
const selectedUserId = ref("")
const selectedUsername = ref("")
const newPassword = ref("")
const changing = ref(false)
const changeError = ref("")
const changeSuccess = ref("")

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase()
  if (!query) return users.value
  return users.value.filter((u) => u.username.toLowerCase().includes(query) || u.user_id.includes(query))
})

async function refresh() {
  loading.value = true
  error.value = ""
  try {
    const data = await adminGetAllUsers()
    users.value = Array.isArray(data) ? data : []
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refresh()
})

function openChange(userId: string, username: string) {
  showChange.value = true
  selectedUserId.value = userId
  selectedUsername.value = username
  newPassword.value = ""
  changeError.value = ""
  changeSuccess.value = ""
}

function closeChange() {
  showChange.value = false
  selectedUserId.value = ""
  selectedUsername.value = ""
  newPassword.value = ""
}

async function submitChange() {
  changing.value = true
  changeError.value = ""
  changeSuccess.value = ""
  try {
    await adminChangeUserPassword({
      user_id: selectedUserId.value,
      password: newPassword.value,
    })
    changeSuccess.value = t("admin.users.passwordChanged")
    newPassword.value = ""
  } catch (e: any) {
    changeError.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    changing.value = false
  }
}
</script>
