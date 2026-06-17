<script setup lang="ts">
const { t } = useI18n()
const { login } = useAuth()
const toast = useToast()
const localePath = useLocalePath()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login({ email: email.value, password: password.value })
    toast.add({ title: t('auth.loginSuccess'), color: 'success' })
    await navigateTo(localePath('/'))
  } catch (e: any) {
    error.value = e?.message ?? t('common.error')
  } finally {
    loading.value = false
  }
}

useHead({ title: t('auth.login') })
</script>

<template>
  <div class="max-w-md mx-auto mt-12">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold text-center">{{ t('auth.loginTitle') }}</h1>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UAlert v-if="error" color="error" :title="error" icon="i-lucide-alert-circle" />

        <UFormField :label="t('auth.email')">
          <UInput v-model="email" type="email" :placeholder="t('auth.email')" required class="w-full" />
        </UFormField>

        <UFormField :label="t('auth.password')">
          <UInput v-model="password" type="password" :placeholder="t('auth.password')" required class="w-full" />
        </UFormField>

        <UButton type="submit" block :loading="loading">
          {{ t('auth.login') }}
        </UButton>
      </form>

      <template #footer>
        <p class="text-center text-sm text-(--ui-text-muted)">
          {{ t('auth.noAccount') }}
          <ULink :to="localePath('/register')" class="text-(--ui-primary) hover:underline">
            {{ t('auth.register') }}
          </ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>
