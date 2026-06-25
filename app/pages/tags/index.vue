<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ t('tags.title') }}</h1>
      <UButton icon="i-lucide-plus" @click="showCreateModal = true">
        {{ t('tags.create') }}
      </UButton>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
    </div>

    <div
      v-else-if="!tags?.length"
      class="text-center py-12 text-(--ui-text-muted)"
    >
      {{ t('tags.noTags') }}
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <UCard v-for="tag in tags" :key="tag.id">
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ tag.name }}</span>
          <UButton
            variant="ghost"
            color="error"
            icon="i-lucide-trash-2"
            size="sm"
            @click="confirmDelete(tag.id)"
          />
        </div>
      </UCard>
    </div>

    <!-- Create Modal -->
    <UModal v-model:open="showCreateModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">{{ t('tags.create') }}</h3>
          <form @submit.prevent="handleCreate">
            <UFormField :label="t('tags.name')" :error="nameError">
              <UInput
                v-model="newTagName"
                :placeholder="t('tags.name')"
                class="w-full"
              />
            </UFormField>
            <div class="flex justify-end gap-2 mt-4">
              <UButton
                variant="ghost"
                :label="t('common.cancel')"
                @click="showCreateModal = false"
              />
              <UButton
                type="submit"
                :disabled="newTagName.length < 2"
                :loading="creating"
                :label="t('common.save')"
              />
            </div>
          </form>
        </div>
      </template>
    </UModal>

    <!-- Delete Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">{{ t('common.confirm') }}</h3>
          <p class="text-(--ui-text-muted) mb-6">
            {{ t('tags.confirmDelete') }}
          </p>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              :label="t('common.cancel')"
              @click="showDeleteModal = false"
            />
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
  </div>
</template>

<script setup lang="ts">
const { fetchTags, createTag, deleteTag } = useTags()

const {
  data: tags,
  refresh,
  status,
} = useAsyncData('tags-page', () => fetchTags())

const { t } = useI18n()
const toast = useToast()

const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const tagToDelete = ref<string | null>(null)
const newTagName = ref('')
const creating = ref(false)
const deleting = ref(false)

const nameError = computed(() => {
  if (newTagName.value.length > 0 && newTagName.value.length < 2) {
    return t('tags.nameMinLength')
  }

  return undefined
})

async function handleCreate() {
  if (newTagName.value.length < 2) {
    return
  }

  creating.value = true

  try {
    await createTag({ name: newTagName.value })
    toast.add({ title: t('tags.created'), color: 'success' })
    newTagName.value = ''
    showCreateModal.value = false
    await refresh()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    creating.value = false
  }
}

function confirmDelete(id: string) {
  tagToDelete.value = id
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!tagToDelete.value) {
    return
  }

  deleting.value = true

  try {
    await deleteTag(tagToDelete.value)
    toast.add({ title: t('tags.deleted'), color: 'success' })
    showDeleteModal.value = false
    tagToDelete.value = null
    await refresh()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    deleting.value = false
  }
}

useHead({ title: t('tags.title') })
</script>
