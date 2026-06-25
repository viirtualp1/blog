import type { ApiError } from '@/types/api'

export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuth()

  async function api<T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> {
    const headers: Record<string, string> = {}

    if (auth.accessToken.value) {
      headers.Authorization = `Bearer ${auth.accessToken.value}`
    }

    try {
      return await $fetch<T>(url, {
        baseURL: config.public.apiBase as string,
        credentials: 'include',
        headers,
        ...options,
      })
    } catch (err: any) {
      if (err?.response?.status === 401 && auth.accessToken.value) {
        try {
          await auth.refresh()

          headers.Authorization = `Bearer ${auth.accessToken.value}`
          return await $fetch<T>(url, {
            baseURL: config.public.apiBase as string,
            credentials: 'include',
            headers,
            ...options,
          })
        } catch {
          auth.clearAuth()
          await navigateTo('/login')
          throw err
        }
      }

      const apiError = err?.data as ApiError | undefined
      throw apiError ?? err
    }
  }

  return { api }
}
