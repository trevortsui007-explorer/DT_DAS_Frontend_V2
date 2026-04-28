import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig
} from 'axios'

import { mockRequest } from '@/mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000
})

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
  (response) => response.data,
  async (error: AxiosError & { __MOCK__?: boolean; data?: unknown }) => {
    if (error.__MOCK__) {
      return error.data
    }

    const status = error.response?.status
    const config = error.config as AxiosRequestConfig | undefined

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