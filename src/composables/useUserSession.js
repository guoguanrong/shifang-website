import { computed, readonly, ref } from 'vue'
import { clearToken, ResultCode, TOKEN_STORAGE_KEY } from '@/api/http'
import { getMemberInfo, updateMember } from '@/api/member'

const storageKey = 'shifang-demo-session'

function readToken() {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function clip(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function toCount(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

// 只有明确的 true 才算已实名；null、空串和 false 都保持未认证。
function isVerified(value) {
  return value === true
}

// 卡片与页头优先展示昵称，没有昵称时用手机号，再退回邮箱前缀。
function displayName(member, fallbackEmail = '') {
  const nickname = clip(member?.nickname, 80)
  const phone = clip(member?.phone, 30)
  const email = clip(member?.email || fallbackEmail, 254)
  return nickname || phone || email.split('@')[0].slice(0, 80)
}

function mapMember(member, fallbackEmail = '') {
  const email = clip(member?.email || fallbackEmail, 254)
  const name = displayName(member, fallbackEmail)
  if (!name) return null
  return {
    id: member?.id ?? null,
    name,
    nickname: clip(member?.nickname, 80),
    phone: clip(member?.phone, 30),
    email,
    avatar: clip(member?.avatar, 2000),
    verified: isVerified(member?.realNameAuth),
    status: member?.status ?? null,
    totalDonate: toCount(member?.totalDonate),
    donateCount: toCount(member?.donateCount),
    lightCount: toCount(member?.lightCount),
    worshipCount: toCount(member?.worshipCount),
  }
}

function persist(profile) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({ version: 2, ...profile }))
    return true
  } catch {
    return false
  }
}

function restoreSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null')
    if (saved?.version === 2 && typeof saved.name === 'string' && saved.name.trim()) {
      return {
        id: saved.id ?? null,
        name: clip(saved.name, 80),
        nickname: clip(saved.nickname, 80),
        phone: clip(saved.phone, 30),
        email: clip(saved.email, 254),
        avatar: clip(saved.avatar, 2000),
        verified: isVerified(saved.verified),
        status: saved.status ?? null,
        totalDonate: toCount(saved.totalDonate),
        donateCount: toCount(saved.donateCount),
        lightCount: toCount(saved.lightCount),
        worshipCount: toCount(saved.worshipCount),
      }
    }
    if (saved?.version === 1 && typeof saved.name === 'string' && saved.name.trim()) {
      return mapMember({ nickname: saved.name, phone: saved.phone, email: saved.email })
    }
  } catch {
    // 浏览器禁用存储时仍可使用当前页面内的登录状态。
  }
  return null
}

const user = ref(restoreSession())
const isLoggedIn = computed(() => user.value !== null)
let refreshPromise = null

function startDemoSession(email) {
  const profile = mapMember({ email }, email)
  if (!profile) return
  user.value = profile
  persist(profile)
}

function applyMember(member, fallbackEmail = '') {
  const profile = mapMember(member, fallbackEmail)
  if (!profile) return null
  if (JSON.stringify(user.value) === JSON.stringify(profile)) return profile
  user.value = profile
  persist(profile)
  return profile
}

// 用当前令牌拉取 /member/info。令牌失效时按选项决定是否退出；
// 接口暂时不可用时保留已有会话，避免刚登录就被清掉。
async function refreshMemberInfo({ fallbackEmail = '', signOutOnAuthError = true } = {}) {
  if (!readToken()) {
    if (fallbackEmail && !user.value) startDemoSession(fallbackEmail)
    return user.value
  }

  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const data = await getMemberInfo({ silent: true })
      return applyMember(data, fallbackEmail) || user.value
    } catch (error) {
      const authFailed = [ResultCode.NOT_LOGIN, ResultCode.NOT_LOGIN_USER, ResultCode.BANNED].includes(error?.code)
      if (authFailed && signOutOnAuthError) {
        signOut()
      } else if (!user.value && fallbackEmail) {
        startDemoSession(fallbackEmail)
      }
      return user.value
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

async function saveMemberProfile({ name, phone, email }) {
  const id = user.value?.id
  if (id == null || id === '') {
    const error = new Error('missing member id')
    error.code = 'NO_ID'
    throw error
  }
  const payload = {
    id,
    nickname: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
  }
  const data = await updateMember(payload, { silent: true })
  const member = data && typeof data === 'object' ? { ...data, ...payload } : payload
  return applyMember(member) || user.value
}

function updateDemoProfile({ name, phone, email }) {
  if (!user.value || !name.trim()) return { saved: false, persisted: false }
  const profile = {
    ...user.value,
    name: name.trim().slice(0, 80),
    nickname: name.trim().slice(0, 80),
    phone: phone.trim().slice(0, 30),
    email: email.trim().slice(0, 254),
  }
  user.value = profile
  return { saved: true, persisted: persist(profile) }
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

if (readToken()) {
  refreshMemberInfo()
}

export function useUserSession() {
  return { user: readonly(user), isLoggedIn, startDemoSession, updateDemoProfile, saveMemberProfile, refreshMemberInfo, signOut }
}
