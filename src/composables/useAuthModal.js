// 登录/注册弹窗的全局状态：任意组件都能通过 useAuthModal() 打开、关闭或切换模式。
import { readonly, ref } from 'vue'

// 模块级单例，全站共享同一份弹窗状态。
const isOpen = ref(false)
const mode = ref('login')

export function useAuthModal() {
  // 打开弹窗，可指定 login / register，非法值一律按 login 处理。
  function openAuthModal(nextMode = 'login') {
    mode.value = nextMode === 'register' ? 'register' : 'login'
    isOpen.value = true
  }

  function closeAuthModal() {
    isOpen.value = false
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
    switchAuthMode,
  }
}
