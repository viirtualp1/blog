import type { User, LoginDto, RegisterDto } from '@/types/api'

let authInitPromise: Promise<void> | null = null

export function useAuth() {
  const config = useRuntimeConfig()
  const accessToken = useState<string | null>('auth:token', () => null)
  const user = useState<User | null>('auth:user', () => null)
  const isInitialized = useState('auth:initialized', () => false)
  const isHydrated = useState('auth:hydrated', () => false)
  const isAuthenticated = computed(() => !!accessToken.value)
  const showAuthenticated = computed(
    () => isHydrated.value && isAuthenticated.value,
  )

  function markInitialized() {
    isInitialized.value = true
  }

  function markHydrated() {
    isHydrated.value = true
  }

  async function login(dto: LoginDto) {
    const data = await $fetch<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      baseURL: config.public.apiBase as string,
      credentials: 'include',
      body: dto,
    })

    accessToken.value = data.accessToken
    await fetchMe()
    markInitialized()
    markHydrated()
  }

  async function register(dto: RegisterDto) {
    await $fetch('/auth/register', {
      method: 'POST',
      baseURL: config.public.apiBase as string,
      body: dto,
    })
  }

  async function refresh() {
    const data = await $fetch<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      baseURL: config.public.apiBase as string,
      credentials: 'include',
    })

    accessToken.value = data.accessToken
  }

  async function fetchMe() {
    if (!accessToken.value) return

    user.value = await $fetch<User>('/users/me', {
      baseURL: config.public.apiBase as string,
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
  }

  async function logout() {
    try {
      await $fetch('/auth/logout', {
        method: 'POST',
        baseURL: config.public.apiBase as string,
        credentials: 'include',
        headers: accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : {},
      })
    } finally {
      clearAuth()
    }
  }

  function clearAuth() {
    accessToken.value = null
    user.value = null
  }

  async function initAuth() {
    try {
      await refresh()
      await fetchMe()
    } catch {
      clearAuth()
    } finally {
      markInitialized()
    }
  }

  function waitUntilReady() {
    if (isInitialized.value) {
      return Promise.resolve()
    }

    authInitPromise ??= initAuth()
    return authInitPromise
  }

  return {
    accessToken,
    user,
    isAuthenticated,
    isInitialized,
    isHydrated,
    showAuthenticated,
    markHydrated,
    waitUntilReady,
    login,
    register,
    refresh,
    fetchMe,
    logout,
    clearAuth,
  }
}
