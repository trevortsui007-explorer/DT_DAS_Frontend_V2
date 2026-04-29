import { createVNode, render, type VNode } from 'vue'

import DTConfirm from '@/shared/components/DTConfirm'

import type {
  DTConfirmOptions,
  DTConfirmResult
} from '@/shared/components/DTConfirm'

type DTConfirmExpose = {
  ask: (options?: DTConfirmOptions) => Promise<DTConfirmResult>
}

let container: HTMLDivElement | null = null
let vnode: VNode | null = null

function getConfirmInstance(): DTConfirmExpose | null {
  if (typeof document === 'undefined') {
    return null
  }

  if (!container) {
    container = document.createElement('div')
    container.className = 'dt-confirm-root'

    vnode = createVNode(DTConfirm)
    render(vnode, container)

    document.body.appendChild(container)
  }

  return vnode?.component?.exposed as DTConfirmExpose
}

export function confirm(options: DTConfirmOptions = {}) {
  const instance = getConfirmInstance()

  if (!instance) {
    return Promise.resolve(false)
  }

  return instance.ask(options)
}

export function useConfirm() {
  return confirm
}