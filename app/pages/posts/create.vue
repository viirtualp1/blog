<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const { createPost } = usePosts()
const { fetchTags } = useTags()
const toast = useToast()
const localePath = useLocalePath()

const { data: tags } = useAsyncData('all-tags', () => fetchTags())

const loading = ref(false)

async function handleSubmit(data: { title: string; content: string; tagIds: string[] }) {
  loading.value = true
  try {
    const post = await createPost(data)
    toast.add({ title: t('posts.created'), color: 'success' })
    await navigateTo(localePath(`/posts/${post.id}`))
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

useHead({ title: t('posts.create') })
</script>

<template>
  <div>
    <div class="mb-6">
      <u-button :to="localePath('/')" variant="ghost" icon="i-lucide-arrow-left">
        {{ t('posts.backToList') }}
      </u-button>
    </div>

    <u-card>
      <template #header>
        <h1 class="text-xl font-bold">{{ t('posts.create') }}</h1>
      </template>
      <post-form :tags="tags ?? []" :loading="loading" @submit="handleSubmit" />
    </u-card>
  </div>
</template>
