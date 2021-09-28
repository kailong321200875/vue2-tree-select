import ResizeObserver from 'resize-observer-polyfill'

const isServer = typeof window === 'undefined'

/* istanbul ignore next */
const resizeHandler = function (entries: any[]) {
  for (const entry of entries) {
    const listeners = entry.target.__resizeListeners__ || []
    if (listeners.length) {
      listeners.forEach((fn: Fn) => {
        fn()
      })
    }
  }
}

/* istanbul ignore next */
export const addResizeListener = function (element: HTMLElement | any, fn: Fn) {
  if (isServer) return
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = []
    element.__ro__ = new ResizeObserver(resizeHandler)
    element.__ro__.observe(element)
  }
  element.__resizeListeners__.push(fn)
}

/* istanbul ignore next */
export const removeResizeListener = function (element: HTMLElement | any, fn: Fn) {
  if (!element || !element.__resizeListeners__) return
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1)
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect()
  }
}
