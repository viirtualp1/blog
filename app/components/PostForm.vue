<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <u-form-field :label="t('posts.title')" :error="titleError">
      <u-input v-model="title" :placeholder="t('posts.title')" class="w-full" />
    </u-form-field>

    <u-form-field :label="t('posts.content')" :error="contentError">
      <u-textarea
        v-model="content"
        :placeholder="t('posts.content')"
        :rows="8"
        class="w-full"
      />
    </u-form-field>

    <u-form-field :label="t('posts.tags')">
      <u-select-menu
        v-model="selectedTagIds"
        :items="tagItems"
        multiple
        value-key="value"
        :placeholder="t('posts.selectTags')"
        class="w-full"
      />
    </u-form-field>

    <div class="flex justify-end gap-2 pt-4">
      <u-button type="submit" :disabled="!isValid" :loading="loading">
        {{ t('common.save') }}
      </u-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Post, Tag } from '@/types/api'

const props = defineProps<{
  post?: Post
  tags: Tag[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    data: { title: string; content: string; tagIds: string[] },
  ): void
}>()

const { t } = useI18n()

const title = ref('')
const content = ref('')
const selectedTagIds = ref<string[]>([])

const tagItems = computed(() => {
  return props.tags.map((tag) => ({ label: tag.name, value: tag.id }))
})

const titleError = computed(() => {
  if (title.value.length > 0 && title.value.length < 3) {
    return t('posts.titleMinLength')
  }

  return undefined
})

const contentError = computed(() => {
  if (content.value.length > 0 && content.value.length < 10) {
    return t('posts.contentMinLength')
  }

  return undefined
})

const isValid = computed(() => {
  return title.value.length >= 3 && content.value.length >= 10
})

function handleSubmit() {
  emit('submit', {
    title: title.value,
    content: content.value,
    tagIds: selectedTagIds.value,
  })
}

watch(
  () => props.post,
  (post) => {
    if (!post) {
      return
    }

    title.value = post.title
    content.value = post.content
    selectedTagIds.value = [...(post.tagIds ?? [])]
  },
  { immediate: true },
)
</script>
