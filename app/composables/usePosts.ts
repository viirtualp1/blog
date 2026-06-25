import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PaginationParams,
  PaginatedPosts,
} from '@/types/api'

export function usePosts() {
  const { api } = useApi()

  function fetchPosts(params?: PaginationParams) {
    const query = new URLSearchParams()

    if (params?.page) {
      query.set('page', String(params.page))
    }

    if (params?.limit) {
      query.set('limit', String(params.limit))
    }

    const qs = query.toString()
    return api<PaginatedPosts>(`/posts${qs ? `?${qs}` : ''}`)
  }

  function fetchPost(id: string) {
    return api<Post>(`/posts/${id}`)
  }

  function createPost(dto: CreatePostDto) {
    return api<Post>('/posts', { method: 'POST', body: dto })
  }

  function updatePost(id: string, dto: UpdatePostDto) {
    return api<Post>(`/posts/${id}`, { method: 'PATCH', body: dto })
  }

  function deletePost(id: string) {
    return api<{ success: boolean }>(`/posts/${id}`, { method: 'DELETE' })
  }

  return {
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
  }
}
