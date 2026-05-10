import { defineStore } from 'pinia'

export type AppTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'dt-das-theme'

function getStoredTheme(): AppTheme {
  const value = window.localStorage.getItem(THEME_STORAGE_KEY)

  return value === 'dark' ? 'dark' : 'light'
}

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarCollapsed: false,
    theme: getStoredTheme()
  }),

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setTheme(theme: AppTheme) {
      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    },

    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },

    initTheme() {
      this.setTheme(this.theme)
    }
  }
})
