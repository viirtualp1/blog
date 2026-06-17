<script setup lang="ts">
const { t } = useI18n()
const { showAuthenticated, logout, markHydrated } = useAuth()
const toast = useToast()
const localePath = useLocalePath()

onMounted(() => {
  markHydrated()
})

async function handleLogout() {
  await logout()
  toast.add({ title: t('auth.logoutSuccess'), color: 'success' })
  await navigateTo(localePath('/'))
}
</script>

<template>
  <div class="min-h-screen bg-(--ui-bg)">
    <header class="border-b border-(--ui-border)">
      <UContainer>
        <nav class="flex items-center justify-between h-16">
          <div class="flex items-center gap-6">
            <ULink :to="localePath('/')" class="text-xl font-bold text-(--ui-text-highlighted)">
              Blog
            </ULink>
            <div class="flex items-center gap-4">
              <UButton :to="localePath('/')" variant="ghost" :label="t('nav.posts')" />
              <UButton :to="localePath('/tags')" variant="ghost" :label="t('nav.tags')" />
              <UButton
                v-if="showAuthenticated"
                :to="localePath('/profile')"
                variant="ghost"
                :label="t('nav.profile')"
              />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <LangSwitcher />
            <template v-if="showAuthenticated">
              <UButton variant="soft" color="error" :label="t('nav.logout')" @click="handleLogout" />
            </template>
            <template v-else>
              <UButton :to="localePath('/login')" variant="soft" :label="t('nav.login')" />
              <UButton :to="localePath('/register')" :label="t('nav.register')" />
            </template>
          </div>
        </nav>
      </UContainer>
    </header>

    <main class="py-8">
      <UContainer>
        <slot />
      </UContainer>
    </main>
  </div>
</template>
