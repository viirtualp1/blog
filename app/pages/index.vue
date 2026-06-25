<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ t('posts.allPosts') }}</h1>
      <UButton :to="localePath('/posts/create')" icon="i-lucide-plus">
        {{ t('posts.create') }}
      </UButton>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
    </div>

    <div
      v-else-if="!posts?.length"
      class="text-center py-12 text-(--ui-text-muted)"
    >
      {{ t('posts.noPosts') }}
    </div>

    <div v-else class="space-y-4">
      <UCard v-for="post in posts" :key="post.id">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <ULink
              :to="localePath(`/posts/${post.id}`)"
              class="text-lg font-semibold hover:underline text-(--ui-text-highlighted)"
            >
              {{ post.title }}
            </ULink>
            <p class="mt-1 text-(--ui-text-muted) line-clamp-2">
              {{ post.content }}
            </p>
            <div v-if="post.tagIds?.length" class="flex gap-1.5 mt-3">
              <UBadge
                v-for="tagId in post.tagIds"
                :key="tagId"
                variant="subtle"
                size="sm"
              >
                {{ tagName(tagId) }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <div v-if="total > limit" class="flex justify-center mt-8">
      <UPagination v-model:page="page" :total="total" :items-per-page="limit" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { fetchPosts } = usePosts()
const { fetchTags } = useTags()
const localePath = useLocalePath()

const page = ref(1)
const limit = 10
const total = ref(0)

const { data: posts, status } = await useAsyncData(
  'posts',
  async () => {
    const result = await fetchPosts({ page: page.value, limit })
    total.value = result.total

    return result.data
  },
  { watch: [page] },
)

const { data: tags } = await useAsyncData('all-tags', () => fetchTags())

function tagName(id: string) {
  return tags.value?.find((t) => t.id === id)?.name ?? id
}

useHead({ title: t('posts.allPosts') })
</script>
