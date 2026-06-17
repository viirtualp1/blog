export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  tagIds: string[]
  authorId?: string
}

export interface Tag {
  id: string
  name: string
  postId?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedPosts {
  data: Post[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  statusCode: number
  message: string
  timestamp: string
  path: string
}

export interface CreatePostDto {
  title: string
  content: string
  tagIds?: string[]
}

export interface UpdatePostDto {
  title?: string
  content?: string
  tagIds?: string[]
}

export interface CreateTagDto {
  name: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  name: string
  password: string
}
