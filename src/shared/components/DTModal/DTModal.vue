<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

type ModalWidth = string | number

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    width?: ModalWidth
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
    showFooter?: boolean
    showClose?: boolean
    confirmText?: string
    cancelText?: string
    loading?: boolean
    destroyOnClose?: boolean
  }>(),
  {
    title: '',
    width: '560px',
    closeOnOverlay: true,
    closeOnEsc: true,
    showFooter: true,
    showClose: true,
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

const modalStyle = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width

  return {
    width
  }
})

function closeModal() {
  if (props.loading) return

  emit('update:open', false)
  emit('close')
}

function handleCancel() {
  if (props.loading) return

  emit('cancel')
  closeModal()
}

function handleConfirm() {
  if (props.loading) return

  emit('confirm')
}

function handleOverlayClick() {
  if (!props.closeOnOverlay) return

  closeModal()
}

function handleEsc(event: KeyboardEvent) {
  if (!props.open) return
  if (!props.closeOnEsc) return

  if (event.key === 'Escape') {
    closeModal()
  }
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      emit('opened')
      document.body.classList.add('dt-modal-lock')
    } else {
      emit('closed')
      document.body.classList.remove('dt-modal-lock')
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleEsc)

  if (props.open) {
    document.body.classList.add('dt-modal-lock')
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
  document.body.classList.remove('dt-modal-lock')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dt-modal-fade">
      <div
        v-if="open"
        class="dt-modal-overlay"
        @click.self="handleOverlayClick"
      >
        <Transition name="dt-modal-zoom">
          <section
            v-if="shouldRender"
            class="dt-modal"
            :style="modalStyle"
            role="dialog"
            aria-modal="true"
            :aria-label="title || '弹窗'"
          >
            <header
              v-if="title || $slots.header || showClose"
              class="dt-modal__header"
            >
              <slot name="header">
                <h3 class="dt-modal__title">{{ title }}</h3>
              </slot>

              <button
                v-if="showClose"
                class="dt-modal__close"
                type="button"
                aria-label="关闭弹窗"
                :disabled="loading"
                @click="closeModal"
              >
                ×
              </button>
            </header>

            <main class="dt-modal__body">
              <slot />
            </main>

            <footer
              v-if="showFooter || $slots.footer"
              class="dt-modal__footer"
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
                    class="dt-modal__spinner"
                  />
                  <span>{{ loading ? '处理中...' : confirmText }}</span>
                </button>
              </slot>
            </footer>
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.dt-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--dt-space-6);
  background: rgba(15, 23, 42, 0.46);
  backdrop-filter: blur(4px);
}

.dt-modal {
  display: flex;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 48px);
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-xl);
  background: var(--dt-bg-elevated);
  box-shadow: var(--dt-shadow-md);
}

.dt-modal__header {
  display: flex;
  min-height: 58px;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-4);
  padding: 0 var(--dt-space-5);
  border-bottom: 1px solid var(--dt-border-subtle);
}

.dt-modal__title {
  margin: 0;
  color: var(--dt-text-primary);
  font-size: 17px;
  font-weight: 700;
}

.dt-modal__close {
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

.dt-modal__close:hover:not(:disabled) {
  color: var(--dt-text-primary);
  background: var(--dt-bg-muted);
}

.dt-modal__close:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.dt-modal__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--dt-space-5);
}

.dt-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--dt-space-3);
  padding: var(--dt-space-4) var(--dt-space-5);
  border-top: 1px solid var(--dt-border-subtle);
  background: color-mix(in srgb, var(--dt-bg-muted) 46%, transparent);
}

.dt-modal__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-top-color: var(--dt-text-inverse);
  border-radius: 999px;
  animation: dt-modal-spin 0.75s linear infinite;
}

.dt-modal-fade-enter-active,
.dt-modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.dt-modal-fade-enter-from,
.dt-modal-fade-leave-to {
  opacity: 0;
}

.dt-modal-zoom-enter-active,
.dt-modal-zoom-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.dt-modal-zoom-enter-from,
.dt-modal-zoom-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

@keyframes dt-modal-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style lang="scss">
body.dt-modal-lock {
  overflow: hidden;
}
</style>