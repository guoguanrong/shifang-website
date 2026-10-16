// 登录/注册弹窗的全局状态：任意组件都能通过 useAuthModal() 打开、关闭或切换模式。
import { nextTick, readonly, ref } from 'vue'

// 模块级单例，全站共享同一份弹窗状态。
const isOpen = ref(false)
const mode = ref('login')
let authenticatedCallback = null

export function useAuthModal() {
  // 打开弹窗，可指定 login / register，非法值一律按 login 处理。
  function openAuthModal(nextMode = 'login', onAuthenticated = null) {
    mode.value = nextMode === 'register' ? 'register' : 'login'
    authenticatedCallback = typeof onAuthenticated === 'function' ? onAuthenticated : null
    isOpen.value = true
  }

  function closeAuthModal() {
    authenticatedCallback = null
    isOpen.value = false
  }

  // 需要登录后继续的操作在会话建立后执行；普通登录仍显示原有成功提示。
  async function onAuthenticated() {
    if (!authenticatedCallback) return
    const callback = authenticatedCallback
    authenticatedCallback = null
    isOpen.value = false
    await nextTick()
    callback()
  }

  // 只切换模式而不改变弹窗的展开状态。
  function switchAuthMode(nextMode) {
    mode.value = nextMode === 'register' ? 'register' : 'login'
  }

  // 状态以只读 ref 暴露，避免外部绕过这些方法直接改写。
  return {
    isOpen: readonly(isOpen),
    mode: readonly(mode),
    openAuthModal,
    closeAuthModal,
    onAuthenticated,
    switchAuthMode,
  }
}
