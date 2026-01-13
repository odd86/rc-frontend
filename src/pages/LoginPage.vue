<template>
  <div class="min-h-screen bg-[var(--ds-bg)]">
    <div class="mx-auto flex min-h-screen max-w-md items-center px-4">
      <Card variant="strong" class="w-full">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="truncate text-xl font-semibold text-slate-900">{{ t("auth.appName") }}</h1>
            <p class="mt-1 text-sm text-slate-600">{{ t("auth.tagline") }}</p>
          </div>
          <Badge>Driver</Badge>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-2">
          <SecondaryButton
            :class="mode === 'login' ? 'bg-slate-900 text-white hover:bg-slate-800' : ''"
            @click="mode = 'login'"
            type="button"
          >
            {{ t("auth.login") }}
          </SecondaryButton>

          <SecondaryButton
            :class="mode === 'register' ? 'bg-slate-900 text-white hover:bg-slate-800' : ''"
            @click="mode = 'register'"
            type="button"
          >
            {{ t("auth.register") }}
          </SecondaryButton>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <TextInput
            v-model="username"
            :label="t('auth.username')"
            autocomplete="username"
            placeholder="driver123"
          />

          <TextInput
            v-model="password"
            :label="t('auth.password')"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
          />

          <PrimaryButton class="w-full" :disabled="loading || !username || !password" type="submit">
            {{ loading ? t("auth.working") : mode === "login" ? t("auth.loginCta") : t("auth.registerCta") }}
          </PrimaryButton>

          <div v-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ error }}
          </div>
        </form>

        <p class="mt-6 text-xs text-slate-500">
          {{ t("auth.apiKeyNote") }}
        </p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useAuthStore } from "@/stores/auth"
import { createUser, login } from "@/api/endpoints"
import Card from "@/components/ui/Card.vue"
import Badge from "@/components/ui/Badge.vue"
import PrimaryButton from "@/components/ui/PrimaryButton.vue"
import SecondaryButton from "@/components/ui/SecondaryButton.vue"
import TextInput from "@/components/ui/TextInput.vue"

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
