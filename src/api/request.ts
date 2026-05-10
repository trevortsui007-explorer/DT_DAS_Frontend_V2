import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig
} from 'axios'

import { mockRequest } from '@/mock'

declare module 'axios' {
  interface AxiosRequestConfig {
    mockFallback?: boolean
    mockValidate?: (data: unknown) => boolean
  }

  interface AxiosInstance {
    request<T = unknown, R = T>(config: AxiosRequestConfig): Promise<R>
    get<T = unknown, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>
    post<T = unknown, R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R>
    put<T = unknown, R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R>
    patch<T = unknown, R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R>
    delete<T = unknown, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>
  }
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000
})

function unwrapResponse<T = unknown>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'code' in payload &&
    'data' in payload
  ) {
    const response = payload as {
      code: number
      info?: string
      data: T
    }

    if (response.code !== 1) {
      throw Object.assign(new Error(response.info || '请求失败'), {
        __API_UNWRAP_ERROR__: true
      })
    }

    return response.data
  }

  return payload as T
}

function getMockFallback<T = unknown>(
  config?: AxiosRequestConfig,
  reason = '接口不可用，已回退到 mock 数据'
) {
  if (!ENABLE_MOCK_FALLBACK || !config) return undefined
  if (config.mockFallback === false) return undefined

  const mockResult = mockRequest(config)

  if (!mockResult) return undefined

  if (import.meta.env.DEV) {
    console.warn(`[mock fallback] ${config.method || 'get'} ${config.url}: ${reason}`)
  }

  return unwrapResponse<T>(mockResult)
}

function shouldFallback(error: AxiosError) {
  const status = error.response?.status

  if (!status) return true

  return status === 400 ||
    status === 404 ||
    status === 405 ||
    status === 409 ||
    status === 422 ||
    status >= 500
}

request.interceptors.request.use((config) => {
  if (USE_MOCK) {
    const mockResult = mockRequest(config)

    if (mockResult) {
      return Promise.reject({
        __MOCK__: true,
        data: mockResult
      })
    }
  }

  return config
})

request.interceptors.response.use(
  (response) => {
    try {
      const data = unwrapResponse(response.data)

      if (response.config.mockValidate && !response.config.mockValidate(data)) {
        const fallback = getMockFallback(response.config, '接口响应结构不匹配')

        if (fallback !== undefined) {
          return fallback as any
        }
      }

      return data as any
    } catch (error) {
      const fallback = getMockFallback(response.config, (error as Error).message)

      if (fallback !== undefined) {
        return fallback as any
      }

      throw error
    }
  },
  async (error: AxiosError & { __MOCK__?: boolean; data?: unknown }) => {
    if (error.__MOCK__) {
      return unwrapResponse(error.data)
    }

    const config = error.config as AxiosRequestConfig | undefined

    if (shouldFallback(error)) {
      const fallback = getMockFallback(config, error.message)

      if (fallback !== undefined) {
        return fallback
      }
    }

    return Promise.reject(error)
  }
)

export default request
