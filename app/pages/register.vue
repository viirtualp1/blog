<template>
  <div class="max-w-md mx-auto mt-12">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold text-center">
          {{ t('auth.registerTitle') }}
        </h1>
      </template>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <UAlert
          v-if="error"
          color="error"
          :title="error"
          icon="i-lucide-alert-circle"
        />

        <UFormField :label="t('auth.name')">
          <UInput
            v-model="name"
            :placeholder="t('auth.name')"
            required
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('auth.email')">
          <UInput
            v-model="email"
            type="email"
            :placeholder="t('auth.email')"
            required
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('auth.password')">
          <UInput
            v-model="password"
            type="password"
            :placeholder="t('auth.password')"
            required
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" block :loading="loading">
          {{ t('auth.register') }}
        </UButton>
      </form>

      <template #footer>
        <p class="text-center text-sm text-(--ui-text-muted)">
          {{ t('auth.hasAccount') }}
          <ULink
            :to="localePath('/login')"
            class="text-(--ui-primary) hover:underline"
          >
            {{ t('auth.login') }}
          </ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { register, login } = useAuth()
const toast = useToast()
const localePath = useLocalePath()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''
  loading.value = true

  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
    })

    toast.add({ title: t('auth.registerSuccess'), color: 'success' })

    await login({ email: email.value, password: password.value })
    await navigateTo(localePath('/'))
  } catch (e: any) {
    error.value = e?.message ?? t('common.error')
  } finally {
    loading.value = false
  }
}

useHead({ title: t('auth.register') })
</script>
