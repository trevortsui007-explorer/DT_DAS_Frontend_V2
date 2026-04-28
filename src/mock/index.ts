import type { AxiosRequestConfig } from 'axios'

import { mockDashboard } from './handlers/dashboard.mock'
import { mockConfigs } from './handlers/configs.mock'
import { mockTasks } from './handlers/tasks.mock'
import { mockLogs } from './handlers/logs.mock'

type MockHandler = (config: AxiosRequestConfig) => unknown | null

const handlers: MockHandler[] = [
  mockDashboard,
  mockConfigs,
  mockTasks,
  mockLogs
]

export function mockRequest(config: AxiosRequestConfig) {
  for (const handler of handlers) {
    const result = handler(config)

    if (result) {
      return result
    }
  }

  return null
}