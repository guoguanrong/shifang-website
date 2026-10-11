import { computed, readonly, ref } from 'vue'
import { clearToken } from '@/api/http'

const storageKey = 'shifang-demo-session'

function restoreSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null')
    if (saved?.version === 1 && typeof saved.name === 'string' && saved.name.trim()) {
      return { name: saved.name.slice(0, 80), phone: typeof saved.phone === 'string' ? saved.phone.slice(0, 30) : '', email: typeof saved.email === 'string' ? saved.email.slice(0, 254) : '', id: null, verified: false }
    }
  } catch {
    // 浏览器禁用存储时仍可使用当前页面内的登录状态。
  }
  return null
}

const user = ref(restoreSession())
const isLoggedIn = computed(() => user.value !== null)

export function useUserSession() {
  // 仅衔接现有前端演示登录，不代表服务端身份认证，不保存验证码或令牌。
  function startDemoSession(email) {
    user.value = { name: email.split('@')[0].slice(0, 80), email, phone: '', id: null, verified: false }
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ version: 1, name: user.value.name, email, phone: '' }))
    } catch {
      // 存储不可用不影响本次页面会话。
    }
  }

  // 与演示登录使用同一会话，退出时一起清除；不代表服务端资料已更新。
  function updateDemoProfile({ name, phone, email }) {
    if (!user.value || !name.trim()) return { saved: false, persisted: false }
    const profile = { name: name.trim().slice(0, 80), phone: phone.trim().slice(0, 30), email: email.trim().slice(0, 254) }
    user.value = { ...user.value, ...profile }
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ version: 1, ...profile }))
      return { saved: true, persisted: true }
    } catch {
      return { saved: true, persisted: false }
    }
  }

  function signOut() {
    user.value = null
    clearToken()
    try {
      sessionStorage.removeItem(storageKey)
    } catch {
      // 内存中的会话始终退出。
    }
  }

  return { user: readonly(user), isLoggedIn, startDemoSession, updateDemoProfile, signOut }
}
