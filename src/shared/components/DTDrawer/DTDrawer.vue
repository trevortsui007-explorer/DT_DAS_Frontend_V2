<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

type DrawerPlacement = 'right' | 'left'
type DrawerWidth = string | number

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    width?: DrawerWidth
    placement?: DrawerPlacement
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
    showClose?: boolean
    showFooter?: boolean
    confirmText?: string
    cancelText?: string
    loading?: boolean
    destroyOnClose?: boolean
  }>(),
  {
    title: '',
    width: '520px',
    placement: 'right',
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
    showFooter: false,
    confirmText: '确认',
    cancelText: '取消',
    loading: false,
    destroyOnClose: false
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
  close: []
  opened: []
  closed: []
}>()

const shouldRender = computed(() => {
  if (!props.destroyOnClose) return true
  return props.open
})

const drawerStyle = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width

  return {
    width
  }
})

function closeDrawer() {
  if (props.loading) return

  emit('update:open', false)
  emit('close')
}

function handleCancel() {
  if (props.loading) return

  emit('cancel')
  closeDrawer()
}

function handleConfirm() {
  if (props.loading) return

  emit('confirm')
}

function handleOverlayClick() {
  if (!props.closeOnOverlay) return

  closeDrawer()
}

function handleEsc(event: KeyboardEvent) {
  if (!props.open) return
  if (!props.closeOnEsc) return

  if (event.key === 'Escape') {
    closeDrawer()
  }
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      emit('opened')
      document.body.classList.add('dt-drawer-lock')
    } else {
      emit('closed')
      document.body.classList.remove('dt-drawer-lock')
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleEsc)

  if (props.open) {
    document.body.classList.add('dt-drawer-lock')
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
  document.body.classList.remove('dt-drawer-lock')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dt-drawer-fade">
      <div
        v-if="open"
        class="dt-drawer-overlay"
        @click.self="handleOverlayClick"
      >
        <Transition :name="`dt-drawer-slide-${placement}`">
          <aside
            v-if="shouldRender"
            class="dt-drawer"
            :class="`dt-drawer--${placement}`"
            :style="drawerStyle"
            role="dialog"
            aria-modal="true"
            :aria-label="title || '抽屉'"
          >
            <header
              v-if="title || $slots.header || showClose"
              class="dt-drawer__header"
            >
              <slot name="header">
                <div>
                  <h3 class="dt-drawer__title">{{ title }}</h3>
                  <p v-if="$slots.description" class="dt-drawer__description">
                    <slot name="description" />
                  </p>
                </div>
              </slot>

              <button
                v-if="showClose"
                class="dt-drawer__close"
                type="button"
                aria-label="关闭抽屉"
                :disabled="loading"
                @click="closeDrawer"
              >
                ×
              </button>
            </header>

            <main class="dt-drawer__body">
              <slot />
            </main>

            <footer
              v-if="showFooter || $slots.footer"
              class="dt-drawer__footer"
            >
              <slot name="footer">
                <button
                  class="dt-button dt-button--default dt-button--md"
                  type="button"
                  :disabled="loading"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </button>

                <button
                  class="dt-button dt-button--primary dt-button--md"
                  type="button"
                  :disabled="loading"
                  @click="handleConfirm"
                >
                  <span
                    v-if="loading"
                    class="dt-drawer__spinner"
                  />
                  <span>{{ loading ? '处理中...' : confirmText }}</span>
                </button>
              </slot>
            </footer>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.dt-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 2400;
  display: flex;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(3px);
}

.dt-drawer {
  display: flex;
  max-width: calc(100vw - 24px);
  height: 100vh;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dt-border-subtle);
  background: var(--dt-bg-elevated);
  box-shadow: var(--dt-shadow-md);
}

.dt-drawer--right {
  margin-left: auto;
  border-top-left-radius: var(--dt-radius-xl);
  border-bottom-left-radius: var(--dt-radius-xl);
}

.dt-drawer--left {
  margin-right: auto;
  border-top-right-radius: var(--dt-radius-xl);
  border-bottom-right-radius: var(--dt-radius-xl);
}

.dt-drawer__header {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
  padding: 0 var(--dt-space-5);
  border-bottom: 1px solid var(--dt-border-subtle);
}

.dt-drawer__title {
  margin: 0;
  color: var(--dt-text-primary);
  font-size: 17px;
  font-weight: 700;
}

.dt-drawer__description {
  margin: 4px 0 0;
  color: var(--dt-text-muted);
  font-size: 13px;
}

.dt-drawer__close {
  display: inline-grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border: none;
  border-radius: 999px;
  color: var(--dt-text-muted);
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  transition: 0.18s ease;
}

.dt-drawer__close:hover:not(:disabled) {
  color: var(--dt-text-primary);
  background: var(--dt-bg-muted);
}

.dt-drawer__close:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.dt-drawer__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--dt-space-5);
}

.dt-drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--dt-space-3);
  padding: var(--dt-space-4) var(--dt-space-5);
  border-top: 1px solid var(--dt-border-subtle);
  background: color-mix(in srgb, var(--dt-bg-muted) 46%, transparent);
}

.dt-drawer__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-top-color: var(--dt-text-inverse);
  border-radius: 999px;
  animation: dt-drawer-spin 0.75s linear infinite;
}

.dt-drawer-fade-enter-active,
.dt-drawer-fade-leave-active {
  transition: opacity 0.18s ease;
}

.dt-drawer-fade-enter-from,
.dt-drawer-fade-leave-to {
  opacity: 0;
}

.dt-drawer-slide-right-enter-active,
.dt-drawer-slide-right-leave-active,
.dt-drawer-slide-left-enter-active,
.dt-drawer-slide-left-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.dt-drawer-slide-right-enter-from,
.dt-drawer-slide-right-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.dt-drawer-slide-left-enter-from,
.dt-drawer-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

@keyframes dt-drawer-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style lang="scss">
body.dt-drawer-lock {
  overflow: hidden;
}
</style>