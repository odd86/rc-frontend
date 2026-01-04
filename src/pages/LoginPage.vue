<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div class="w-full rounded-3xl border bg-white p-6 shadow-sm">
        <h1 class="text-xl font-semibold text-slate-900">{{ t("auth.appName") }}</h1>
        <p class="mt-1 text-sm text-slate-600">{{ t("auth.tagline") }}</p>

        <div class="mt-6 flex gap-2">
          <button
              class="flex-1 rounded-2xl px-3 py-2 text-sm font-semibold"
              :class="mode === 'login' ? 'bg-slate-900 text-white' : 'border bg-white text-slate-800'"
              @click="mode = 'login'"
              type="button"
          >
            {{ t("auth.login") }}
          </button>

          <button
              class="flex-1 rounded-2xl px-3 py-2 text-sm font-semibold"
              :class="mode === 'register' ? 'bg-slate-900 text-white' : 'border bg-white text-slate-800'"
              @click="mode = 'register'"
              type="button"
          >
            {{ t("auth.register") }}
          </button>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label class="text-sm text-slate-600">{{ t("auth.username") }}</label>
            <input
                v-model="username"
                class="mt-1 w-full rounded-2xl border px-3 py-2"
                autocomplete="username"
            />
          </div>

          <div>
            <label class="text-sm text-slate-600">{{ t("auth.password") }}</label>
            <input
                v-model="password"
                class="mt-1 w-full rounded-2xl border px-3 py-2"
                type="password"
                autocomplete="current-password"
            />
          </div>

          <button
              class="w-full rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              :disabled="loading || !username || !password"
              type="submit"
          >
            {{ loading ? t("auth.working") : mode === "login" ? t("auth.loginCta") : t("auth.registerCta") }}
          </button>

          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        </form>

        <p class="mt-6 text-xs text-slate-500">
          {{ t("auth.apiKeyNote") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useAuthStore } from "@/stores/auth"
import { createUser, login } from "@/api/endpoints"

const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()

const mode = ref<"login" | "register">("login")
const username = ref("")
const password = ref("")
const loading = ref(false)
const error = ref("")

async function submit() {
  loading.value = true
  error.value = ""
  try {
    const body = { username: username.value.trim(), password: password.value }
    const res = mode.value === "login" ? await login(body) : await createUser(body)
    auth.setApiKey(res.api_key)
    router.push("/dashboard")
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    loading.value = false
  }
}
</script>
