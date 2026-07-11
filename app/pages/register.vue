<template>
  <div class="max-w-md mx-auto mt-12">
    <u-card>
      <template #header>
        <h1 class="text-xl font-bold text-center">
          {{ t('auth.registerTitle') }}
        </h1>
      </template>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <u-alert
          v-if="error"
          color="error"
          :title="error"
          icon="i-lucide-alert-circle"
        />

        <u-form-field :label="t('auth.name')">
          <u-input
            v-model="name"
            :placeholder="t('auth.name')"
            required
            class="w-full"
          />
        </u-form-field>

        <u-form-field :label="t('auth.email')">
          <u-input
            v-model="email"
            type="email"
            :placeholder="t('auth.email')"
            required
            class="w-full"
          />
        </u-form-field>

        <u-form-field :label="t('auth.password')">
          <u-input
            v-model="password"
            type="password"
            :placeholder="t('auth.password')"
            required
            class="w-full"
          />
        </u-form-field>

        <u-button type="submit" block :loading="loading">
          {{ t('auth.register') }}
        </u-button>
      </form>

      <template #footer>
        <p class="text-center text-sm text-(--ui-text-muted)">
          {{ t('auth.hasAccount') }}
          <u-link
            :to="localePath('/login')"
            class="text-(--ui-primary) hover:underline"
          >
            {{ t('auth.login') }}
          </u-link>
        </p>
      </template>
    </u-card>
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
