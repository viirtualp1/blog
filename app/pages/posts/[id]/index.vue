<template>
  <div>
    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <u-icon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
    </div>

    <template v-else-if="post">
      <div class="mb-6">
        <u-button
          :to="localePath('/')"
          variant="ghost"
          icon="i-lucide-arrow-left"
        >
          {{ t('posts.backToList') }}
        </u-button>
      </div>

      <u-card>
        <div class="flex items-start justify-between mb-4">
          <h1 class="text-2xl font-bold">{{ post.title }}</h1>
          <client-only>
            <div v-if="showAuthenticated" class="flex gap-2 shrink-0">
              <u-button
                :to="localePath(`/posts/${post.id}/edit`)"
                variant="soft"
                icon="i-lucide-pencil"
                :label="t('posts.edit')"
              />
              <u-button
                variant="soft"
                color="error"
                icon="i-lucide-trash-2"
                :label="t('posts.delete')"
                @click="showDeleteModal = true"
              />
            </div>
          </client-only>
        </div>

        <div v-if="post.tagIds?.length" class="flex gap-1.5 mb-4">
          <u-badge
            v-for="tagId in post.tagIds"
            :key="tagId"
            variant="subtle"
            size="sm"
          >
            {{ tagName(tagId) }}
          </u-badge>
        </div>

        <div class="prose max-w-none whitespace-pre-wrap">
          {{ post.content }}
        </div>
      </u-card>

      <u-modal v-model:open="showDeleteModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2">
              {{ t('common.confirm') }}
            </h3>
            <p class="text-(--ui-text-muted) mb-6">
              {{ t('posts.confirmDelete') }}
            </p>
            <div class="flex justify-end gap-2">
              <u-button
                variant="ghost"
                :label="t('common.cancel')"
                @click="showDeleteModal = false"
              />
              <u-button
                color="error"
                :label="t('common.delete')"
                :loading="deleting"
                @click="handleDelete"
              />
            </div>
          </div>
        </template>
      </u-modal>
    </template>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { fetchPost, deletePost } = usePosts()
const { fetchTags } = useTags()
const { showAuthenticated } = useAuth()
const toast = useToast()
const localePath = useLocalePath()

const postId = route.params.id as string

const { data: post, status } = await useAsyncData(`post-${postId}`, () =>
  fetchPost(postId),
)
const { data: tags } = await useAsyncData('all-tags', () => fetchTags())

function tagName(id: string) {
  return tags.value?.find((t) => t.id === id)?.name ?? id
}

const showDeleteModal = ref(false)
const deleting = ref(false)

async function handleDelete() {
  deleting.value = true

  try {
    await deletePost(postId)
    toast.add({ title: t('posts.deleted'), color: 'success' })
    await navigateTo(localePath('/'))
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

useHead({ title: computed(() => post.value?.title ?? '') })
</script>
