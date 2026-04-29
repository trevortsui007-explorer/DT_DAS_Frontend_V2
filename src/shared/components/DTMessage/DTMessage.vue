<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

export type DTMessageType =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'loading'

export type DTMessageOptions = {
  content: string
  type?: DTMessageType
  duration?: number
}

export type DTMessageItem = Required<DTMessageOptions> & {
  id: string
}

const DEFAULT_DURATION = 3000

const messages = ref<DTMessageItem[]>([])
const timers = new Map<string, number>()

const typeIconMap: Record<DTMessageType, string> = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '×',
  loading: ''
}

const hasMessages = computed(() => messages.value.length > 0)

function createMessageId() {
  return `dt-message-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function close(id: string) {
  messages.value = messages.value.filter((item) => item.id !== id)

  const timer = timers.get(id)

  if (timer) {
    window.clearTimeout(timer)
    timers.delete(id)
  }
}

function clear() {
  messages.value = []

  timers.forEach((timer) => {
    window.clearTimeout(timer)
  })

  timers.clear()
}

function add(options: DTMessageOptions) {
  const message: DTMessageItem = {
    id: createMessageId(),
    content: options.content,
    type: options.type ?? 'info',
    duration: options.duration ?? DEFAULT_DURATION
  }

  messages.value.push(message)

  if (message.duration > 0) {
    const timer = window.setTimeout(() => {
      close(message.id)
    }, message.duration)

    timers.set(message.id, timer)
  }

  return () => close(message.id)
}

onBeforeUnmount(() => {
  clear()
})

defineExpose({
  add,
  close,
  clear
})
</script>

<template>
  <Teleport to="body">
    <div v-if="hasMessages" class="dt-message-container">
      <TransitionGroup name="dt-message" tag="div">
        <div
          v-for="item in messages"
          :key="item.id"
          class="dt-message"
          :class="`dt-message--${item.type}`"
          role="status"
        >
          <span class="dt-message__icon">
            <span
              v-if="item.type === 'loading'"
              class="dt-message__spinner"
            />
            <span v-else>
              {{ typeIconMap[item.type] }}
            </span>
          </span>

          <span class="dt-message__content">
            {{ item.content }}
          </span>

          <button
            class="dt-message__close"
            type="button"
            aria-label="关闭消息"
            @click="close(item.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.dt-message-container {
  position: fixed;
  top: 24px;
  left: 50%;
  z-index: 3000;
  display: flex;
  width: min(520px, calc(100vw - 32px));
  transform: translateX(-50%);
  pointer-events: none;
}

.dt-message-container > div {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: var(--dt-space-3);
  align-items: center;
}

.dt-message {
  display: inline-flex;
  min-height: 42px;
  max-width: 100%;
  align-items: center;
  gap: var(--dt-space-3);
  padding: 10px 14px;
  border: 1px solid var(--dt-border-subtle);
  border-radius: var(--dt-radius-lg);
  color: var(--dt-text-primary);
  background: var(--dt-bg-elevated);
  box-shadow: var(--dt-shadow-md);
  pointer-events: auto;
}

.dt-message__icon {
  display: inline-grid;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  color: var(--dt-text-inverse);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.dt-message__content {
  min-width: 0;
  color: var(--dt-text-primary);
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.dt-message__close {
  display: inline-grid;
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  place-items: center;
  border: none;
  border-radius: 999px;
  color: var(--dt-text-muted);
  background: transparent;
  cursor: pointer;
  transition: 0.18s ease;
}

.dt-message__close:hover {
  color: var(--dt-text-primary);
  background: var(--dt-bg-muted);
}

.dt-message--success .dt-message__icon {
  background: var(--dt-color-success);
}

.dt-message--info .dt-message__icon {
  background: var(--dt-color-info);
}

.dt-message--warning .dt-message__icon {
  background: var(--dt-color-warning);
}

.dt-message--error .dt-message__icon {
  background: var(--dt-color-danger);
}

.dt-message--loading .dt-message__icon {
  background: var(--dt-color-primary);
}

.dt-message__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.38);
  border-top-color: var(--dt-text-inverse);
  border-radius: 999px;
  animation: dt-message-spin 0.75s linear infinite;
}

.dt-message-enter-active,
.dt-message-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.dt-message-enter-from,
.dt-message-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dt-message-move {
  transition: transform 0.18s ease;
}

@keyframes dt-message-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>