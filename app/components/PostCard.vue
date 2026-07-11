<template>
  <u-card>
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <u-link
          :to="localePath(`/posts/${id}`)"
          class="text-lg font-semibold hover:underline text-(--ui-text-highlighted)"
        >
          {{ title }}
        </u-link>
        <p class="mt-1 text-(--ui-text-muted) line-clamp-2">
          {{ content }}
        </p>

        <div v-if="tagIds.length > 0" class="flex gap-1.5 mt-3">
          <template v-for="tagId in tagIds" :key="tagId">
            <u-badge v-if="tagsStatus === 'success'" variant="subtle" size="sm">
              {{ tagName(tagId) }}
            </u-badge>
          </template>
        </div>
      </div>
    </div>
  </u-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  title: string
  content: string
  tagIds: string[]
}>()

const localePath = useLocalePath()
const { fetchTags } = useTags()

const { data: tags, status: tagsStatus } = await useLazyAsyncData(
  'all-tags',
  fetchTags,
)

function tagName(id: string) {
  return tags.value?.find((t) => t.id === id)?.name ?? id
}
</script>
