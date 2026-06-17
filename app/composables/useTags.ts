import type { Tag, CreateTagDto } from '~/types/api'

export function useTags() {
  const { api } = useApi()

  function fetchTags() {
    return api<Tag[]>('/tags')
  }

  function fetchTag(id: string) {
    return api<Tag>(`/tags/${id}`)
  }

  function createTag(dto: CreateTagDto) {
    return api<Tag>('/tags', { method: 'POST', body: dto })
  }

  function deleteTag(id: string) {
    return api<{ success: boolean }>(`/tags/${id}`, { method: 'DELETE' })
  }

  return { fetchTags, fetchTag, createTag, deleteTag }
}
