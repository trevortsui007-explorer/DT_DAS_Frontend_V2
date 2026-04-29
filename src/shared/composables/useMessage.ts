import { createVNode, render, type VNode } from 'vue'

import DTMessage from '@/shared/components/DTMessage'
import type {
  DTMessageOptions,
  DTMessageType
} from '@/shared/components/DTMessage'

type DTMessageExpose = {
  add: (options: DTMessageOptions) => () => void
  close: (id: string) => void
  clear: () => void
}

type DTMessageApi = {
  open: (options: DTMessageOptions) => () => void
  success: (content: string, duration?: number) => () => void
  info: (content: string, duration?: number) => () => void
  warning: (content: string, duration?: number) => () => void
  error: (content: string, duration?: number) => () => void
  loading: (content: string, duration?: number) => () => void
  clear: () => void
}

let container: HTMLDivElement | null = null
let vnode: VNode | null = null

function getMessageInstance(): DTMessageExpose | null {
  if (typeof document === 'undefined') {
    return null
  }

  if (!container) {
    container = document.createElement('div')
    container.className = 'dt-message-root'

    vnode = createVNode(DTMessage)
    render(vnode, container)

    document.body.appendChild(container)
  }

  return vnode?.component?.exposed as DTMessageExpose
}

function open(options: DTMessageOptions) {
  const instance = getMessageInstance()

  if (!instance) {
    return () => undefined
  }

  return instance.add(options)
}

function createTypedMessage(type: DTMessageType) {
  return (content: string, duration?: number) => {
    return open({
      content,
      type,
      duration
    })
  }
}

export const message: DTMessageApi = {
  open,

  success: createTypedMessage('success'),
  info: createTypedMessage('info'),
  warning: createTypedMessage('warning'),
  error: createTypedMessage('error'),

  loading(content: string, duration = 0) {
    return open({
      content,
      type: 'loading',
      duration
    })
  },

  clear() {
    const instance = getMessageInstance()
    instance?.clear()
  }
}

export function useMessage() {
  return message
}