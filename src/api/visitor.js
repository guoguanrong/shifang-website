import { request } from './http'

const UVID_STORAGE_KEY = 'shifang_uvid'

/**
 * 游客生成 UV
 * @returns {Promise<string>} uvid
 */
export function getUvid() {
  return request({ url: '/uvid' })
}

/**
 * 记录游客
 * @param {object} data VisitorRequest{uvid*, source}
 */
export function recordVisitor(data) {
  return request({ url: '/visitor', method: 'post', data })
}

/**
 * 读取本地缓存的 uvid，没有则向后端申请并缓存。
 * @returns {Promise<string>} uvid
 */
export async function ensureUvid() {
  let uvid = ''

  try {
    uvid = window.localStorage.getItem(UVID_STORAGE_KEY) || ''
  } catch {
    // 存储不可用时每次现取。
  }

  if (!uvid) {
    uvid = (await getUvid()) || ''

    if (uvid) {
      try {
        window.localStorage.setItem(UVID_STORAGE_KEY, uvid)
      } catch {
        // 存储不可用不影响本次使用。
      }
    }
  }

  return uvid
}
