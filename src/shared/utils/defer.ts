export function deferInitialLoad(loader: () => void | Promise<void>) {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      void loader()
    }, 0)
  })
}
