import type { RouteRecordRaw } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'

import OverviewPage from '@/pages/OverviewPage.vue'
import ConfigsPage from '@/pages/ConfigsPage.vue'
import TasksPage from '@/pages/TasksPage.vue'
import TaskLogsPage from '@/pages/TaskLogsPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: OverviewPage,
        meta: {
          title: '总览',
          theme: 'monitor'
        }
      },
      {
        path: 'configs',
        name: 'Configs',
        component: ConfigsPage,
        meta: {
          title: '配置管理',
          theme: 'default'
        }
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: TasksPage,
        meta: {
          title: '任务管理',
          theme: 'default'
        }
      },
      {
        path: 'task-logs',
        name: 'TaskLogs',
        component: TaskLogsPage,
        meta: {
          title: '执行日志',
          theme: 'default'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage
  }
]