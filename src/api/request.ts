import axios, {
  type AxiosError,
  type AxiosInstance,
} from 'axios'

import { mockRequest } from '@/mock'

// --- 关键修改：扩展 Axios 的类型定义 ---
declare module 'axios' {
  interface AxiosInstance {
    // 覆盖接口，让 request<T>() 直接返回 T
    request<T = any, R = T>(config: AxiosRequestConfig): Promise<R>;
    get<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    put<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    delete<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
  }
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000
})

request.interceptors.request.use((config) => {
  if (USE_MOCK) {
    const mockResult = mockRequest(config)
    if (mockResult) {
      // 通过 reject 传递 mock 数据
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
    // 正常响应只返回 data
    return response.data
  },
  async (error: AxiosError & { __MOCK__?: boolean; data?: unknown }) => {
    // 处理 Mock 逻辑
    if (error.__MOCK__) {
      return error.data
    }

    const status = error.response?.status
    const config = error.config

    if ((status === 404 || status === 405) && config) {
      const mockResult = mockRequest(config)
      if (mockResult) {
        return mockResult
      }
    }

    return Promise.reject(error)
  }
)

export default request