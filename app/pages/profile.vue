<template>
  <div class="max-w-lg mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-6">{{ t('profile.title') }}</h1>

    <UCard v-if="user">
      <div class="space-y-4">
        <div class="flex justify-between">
          <span class="text-(--ui-text-muted)">{{ t('profile.name') }}</span>
          <span class="font-medium">{{ user.name }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-(--ui-text-muted)">{{ t('profile.email') }}</span>
          <span class="font-medium">{{ user.email }}</span>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-(--ui-text-muted)">{{ t('profile.role') }}</span>
          <UBadge variant="subtle">{{ user.role }}</UBadge>
        </div>
        <USeparator />
        <div class="flex justify-between">
          <span class="text-(--ui-text-muted)">{{
            t('profile.memberSince')
          }}</span>
          <span class="font-medium">
            {{
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '—'
            }}
          </span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const { user, fetchMe } = useAuth()

onMounted(fetchMe)

useHead({ title: t('profile.title') })
</script>
