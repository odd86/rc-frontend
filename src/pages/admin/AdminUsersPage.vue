<template>
  <AdminShell>
    <div class="space-y-4">
      <div class="rounded-3xl border bg-white p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-xs font-semibold text-slate-500">{{ t("admin.users.eyebrow") }}</div>
            <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.users.title") }}</div>
            <div class="mt-1 text-sm text-slate-600">{{ t("admin.users.subtitle") }}</div>
          </div>

          <button
              class="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              :disabled="loading"
              @click="refresh"
              type="button"
          >
            {{ t("admin.actions.refresh") }}
          </button>
        </div>

        <div class="mt-4 flex gap-2">
          <input
              v-model="q"
              class="flex-1 rounded-2xl border px-3 py-2 text-sm"
              :placeholder="t('admin.users.search')"
          />
        </div>

        <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>

        <div v-if="!loading && filtered.length === 0" class="mt-4 rounded-2xl border border-dashed p-4 text-sm text-slate-600">
          {{ t("admin.users.empty") }}
        </div>

        <div class="mt-4 space-y-3">
          <div
              v-for="u in filtered"
              :key="u.user_id"
              class="rounded-3xl border bg-white p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate font-semibold text-slate-900">{{ u.username }}</div>
                <div class="mt-1 text-xs text-slate-600">
                  id: {{ u.user_id }}
                </div>

                <div class="mt-2 flex flex-wrap gap-2 text-xs">
                  <span v-if="u.is_admin" class="rounded-2xl bg-slate-900 px-3 py-1 font-semibold text-white">
                    admin
                  </span>
                  <span v-if="u.deleted" class="rounded-2xl bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                    deleted
                  </span>
                </div>
              </div>

              <button
                  class="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  @click="openChange(u.user_id, u.username)"
                  type="button"
              >
                {{ t("admin.users.changePassword") }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="mt-4 text-sm text-slate-600">{{ t("auth.working") }}</div>
      </div>

      <!-- Change password panel -->
      <div v-if="showChange" class="rounded-3xl border bg-white p-5">
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

          <button
              class="rounded-2xl border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="closeChange"
              type="button"
          >
            {{ t("admin.actions.close") }}
          </button>
        </div>

        <form class="mt-4 space-y-3" @submit.prevent="submitChange">
          <div>
            <label class="text-sm font-semibold text-slate-700">{{ t("admin.users.newPassword") }}</label>
            <input v-model="newPassword" type="password" class="mt-1 w-full rounded-2xl border px-3 py-2" minlength="8" />
          </div>

          <button
              class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              :disabled="changing || newPassword.length < 8"
          >
            {{ changing ? t("auth.working") : t("admin.users.savePassword") }}
          </button>

          <p v-if="changeError" class="text-sm text-red-600">{{ changeError }}</p>
          <p v-if="changeSuccess" class="text-sm text-emerald-700">{{ changeSuccess }}</p>
        </form>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import AdminShell from "@/components/AdminShell.vue"
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
