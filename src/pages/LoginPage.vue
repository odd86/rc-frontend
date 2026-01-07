<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div class="w-full card p-6">
        <div class="mb-6">
          <h1 class="heading-1">{{ t("auth.appName") }}</h1>
          <p class="body-sm mt-2">{{ t("auth.tagline") }}</p>
        </div>

        <!-- Mode switcher -->
        <div class="grid grid-cols-2 gap-2 mb-6">
          <button
            class="btn"
            :class="mode === 'login' ? 'btn-primary' : 'btn-ghost'"
            @click="mode = 'login'"
            type="button"
          >
            {{ t("auth.login") }}
          </button>

          <button
            class="btn"
            :class="mode === 'register' ? 'btn-primary' : 'btn-ghost'"
            @click="mode = 'register'"
            type="button"
          >
            {{ t("auth.register") }}
          </button>
        </div>

        <!-- Login form -->
        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label class="body font-semibold block mb-2">{{ t("auth.username") }}</label>
            <input
              v-model="username"
              class="input"
              autocomplete="username"
              :placeholder="t('auth.usernamePlaceholder')"
            />
          </div>

          <div>
            <label class="body font-semibold block mb-2">{{ t("auth.password") }}</label>
            <input
              v-model="password"
              class="input"
              type="password"
              autocomplete="current-password"
              :placeholder="t('auth.passwordPlaceholder')"
            />
          </div>

          <button
            class="btn btn-primary w-full"
            :disabled="loading || !username || !password"
            type="submit"
          >
            {{ loading ? t("auth.working") : mode === "login" ? t("auth.loginCta") : t("auth.registerCta") }}
          </button>

          <div v-if="error" class="alert alert-error">
            {{ error }}
          </div>
        </form>

        <p class="body-sm text-slate-500 mt-6">
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
