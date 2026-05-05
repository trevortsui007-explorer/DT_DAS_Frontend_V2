import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig
} from 'axios'

import { mockRequest } from '@/mock'

declare module 'axios' {
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
      throw new Error(response.info || '请求失败')
    }

    return response.data
  }

  return payload as T
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
    return unwrapResponse(response.data) as any
  },
  async (error: AxiosError & { __MOCK__?: boolean; data?: unknown }) => {
    if (error.__MOCK__) {
      return unwrapResponse(error.data)
    }

    const status = error.response?.status
    const config = error.config as AxiosRequestConfig | undefined

    if ((status === 404 || status === 405) && config) {
      const mockResult = mockRequest(config)

      if (mockResult) {
        return unwrapResponse(mockResult)
      }
    }

    return Promise.reject(error)
  }
)

export default request