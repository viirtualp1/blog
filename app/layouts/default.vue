<template>
  <div class="min-h-screen bg-(--ui-bg)">
    <header class="border-b border-(--ui-border)">
      <u-container>
        <nav class="flex items-center justify-between h-16">
          <div class="flex items-center gap-6">
            <u-link
              :to="localePath('/')"
              class="text-xl font-bold text-(--ui-text-highlighted)"
            >
              Blog
            </u-link>
            <div class="flex items-center gap-4">
              <u-button
                :to="localePath('/')"
                variant="ghost"
                :label="t('nav.posts')"
              />
              <u-button
                :to="localePath('/tags')"
                variant="ghost"
                :label="t('nav.tags')"
              />
              <u-button
                v-if="showAuthenticated"
                :to="localePath('/profile')"
                variant="ghost"
                :label="t('nav.profile')"
              />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <lang-switcher />
            <template v-if="showAuthenticated">
              <u-button
                variant="soft"
                color="error"
                :label="t('nav.logout')"
                @click="handleLogout"
              />
            </template>
            <template v-else>
              <u-button
                :to="localePath('/login')"
                variant="soft"
                :label="t('nav.login')"
              />
              <u-button
                :to="localePath('/register')"
                :label="t('nav.register')"
              />
            </template>
          </div>
        </nav>
      </u-container>
    </header>

    <main class="py-8">
      <u-container>
        <slot />
      </u-container>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { showAuthenticated, logout, markHydrated } = useAuth()
const toast = useToast()
const localePath = useLocalePath()

async function handleLogout() {
  await logout()
  toast.add({ title: t('auth.logoutSuccess'), color: 'success' })
  await navigateTo(localePath('/'))
}

onMounted(() => {
  markHydrated()
})
</script>
