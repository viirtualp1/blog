<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ t('posts.allPosts') }}</h1>
      <u-button :to="localePath('/posts/create')" icon="i-lucide-plus">
        {{ t('posts.create') }}
      </u-button>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <u-icon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
    </div>

    <div
      v-else-if="!posts?.length"
      class="text-center py-12 text-(--ui-text-muted)"
    >
      {{ t('posts.noPosts') }}
    </div>

    <div v-else class="space-y-4">
      <post-card
        v-for="post in posts"
        :key="post.id"
        :id="post.id"
        :title="post.title"
        :content="post.content"
        :tag-ids="post.tagIds"
      />
    </div>

    <div v-if="total > limit" class="flex justify-center mt-8">
      <u-pagination
        v-model:page="page"
        :total="total"
        :items-per-page="limit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { fetchPosts } = usePosts()
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

useHead({ title: t('posts.allPosts') })
</script>
