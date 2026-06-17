<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { fetchPost, deletePost } = usePosts()
const { fetchTags } = useTags()
const { showAuthenticated } = useAuth()
const toast = useToast()
const localePath = useLocalePath()

const postId = route.params.id as string

const { data: post, status } = await useAsyncData(`post-${postId}`, () => fetchPost(postId))
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

<template>
  <div>
    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
    </div>

    <template v-else-if="post">
      <div class="mb-6">
        <UButton :to="localePath('/')" variant="ghost" icon="i-lucide-arrow-left">
          {{ t('posts.backToList') }}
        </UButton>
      </div>

      <UCard>
        <div class="flex items-start justify-between mb-4">
          <h1 class="text-2xl font-bold">{{ post.title }}</h1>
          <ClientOnly>
            <div v-if="showAuthenticated" class="flex gap-2 shrink-0">
              <UButton
                :to="localePath(`/posts/${post.id}/edit`)"
                variant="soft"
                icon="i-lucide-pencil"
                :label="t('posts.edit')"
              />
              <UButton
                variant="soft"
                color="error"
                icon="i-lucide-trash-2"
                :label="t('posts.delete')"
                @click="showDeleteModal = true"
              />
            </div>
          </ClientOnly>
        </div>

        <div v-if="post.tagIds?.length" class="flex gap-1.5 mb-4">
          <UBadge v-for="tagId in post.tagIds" :key="tagId" variant="subtle" size="sm">
            {{ tagName(tagId) }}
          </UBadge>
        </div>

        <div class="prose max-w-none whitespace-pre-wrap">
          {{ post.content }}
        </div>
      </UCard>

      <UModal v-model:open="showDeleteModal">
        <template #content>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2">{{ t('common.confirm') }}</h3>
            <p class="text-(--ui-text-muted) mb-6">{{ t('posts.confirmDelete') }}</p>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" :label="t('common.cancel')" @click="showDeleteModal = false" />
              <UButton
                color="error"
                :label="t('common.delete')"
                :loading="deleting"
                @click="handleDelete"
              />
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </div>
</template>
