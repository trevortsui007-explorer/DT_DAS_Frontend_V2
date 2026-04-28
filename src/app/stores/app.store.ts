import { defineStore } from 'pinia'

export type AppTheme = 'default' | 'monitor'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarCollapsed: false,
    theme: 'default' as AppTheme
  }),

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setTheme(theme: AppTheme) {
      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
    }
  }
})