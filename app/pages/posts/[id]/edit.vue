<template>
  <div>
    <div class="mb-6">
      <u-button
        :to="localePath(`/posts/${postId}`)"
        variant="ghost"
        icon="i-lucide-arrow-left"
      >
        {{ t('common.back') }}
      </u-button>
    </div>

    <div v-if="postStatus === 'pending'" class="flex justify-center py-12">
      <u-icon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
    </div>

    <u-card v-else-if="post">
      <template #header>
        <h1 class="text-xl font-bold">{{ t('posts.edit') }}</h1>
      </template>
      <post-form
        :key="post.id"
        :post="post"
        :tags="tags ?? []"
        :loading="loading"
        @submit="handleSubmit"
      />
    </u-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const { fetchPost, updatePost } = usePosts()
const { fetchTags } = useTags()
const toast = useToast()
const localePath = useLocalePath()

const postId = route.params.id as string

const { data: post, status: postStatus } = await useAsyncData(
  `post-${postId}`,
  () => fetchPost(postId),
)
const { data: tags } = await useAsyncData('all-tags', () => fetchTags())

const loading = ref(false)

async function handleSubmit(data: {
  title: string
  content: string
  tagIds: string[]
}) {
  loading.value = true

  try {
    await updatePost(postId, data)
    toast.add({ title: t('posts.updated'), color: 'success' })
    await navigateTo(localePath(`/posts/${postId}`))
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

useHead({ title: t('posts.edit') })
</script>
