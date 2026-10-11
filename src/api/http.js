import axios from 'axios'

// 测试服请求地址（直连用；开发环境默认走 Vite 代理规避跨域）
export const TEST_BASE_URL = 'http://1.94.147.242:9999/api'

// 后端统一响应码（与后端 ResultCode 枚举保持一致）
export const ResultCode = {
  OK: 1000,
  NO_AUTH: 1001,
  HANDLE_EXCEPTION: 1002,
  NOT_LOGIN_USER: 1003,
  INCORRECT_LOGIN_INFO: 1004,
  NOT_LOGIN: 1005,
  FAILED: 1006,
  ILLEGAL_PARAM: 1007,
  UNIQUE_PARAM_EXISTS: 1008,
  BANNED: 1009,
  RATE_LIMIT_REQUEST: 1010,
  REPEAT_SUBMIT_REQUEST: 1011,
  CAPTCHA_EXPIRE: 1012,
  A_USER_NOT_FOUND: 1130,
}

// 响应码对应的提示文案
export const ResultCodeMessage = {
  [ResultCode.OK]: '请求成功',
  [ResultCode.NO_AUTH]: '没有权限',
  [ResultCode.HANDLE_EXCEPTION]: '服务器处理异常',
  [ResultCode.NOT_LOGIN_USER]: '登录用户不存在',
  [ResultCode.INCORRECT_LOGIN_INFO]: '登录信息错误',
  [ResultCode.NOT_LOGIN]: '未登录',
  [ResultCode.FAILED]: '请求失败',
  [ResultCode.ILLEGAL_PARAM]: '请求参数不合法',
  [ResultCode.UNIQUE_PARAM_EXISTS]: '唯一参数已存在',
  [ResultCode.BANNED]: '账号被禁用',
  [ResultCode.RATE_LIMIT_REQUEST]: '当前访问人数过多,请稍候再试',
  [ResultCode.REPEAT_SUBMIT_REQUEST]: '请求过快,请稍候再试',
  [ResultCode.CAPTCHA_EXPIRE]: '验证码过期,请重新获取验证码',
  [ResultCode.A_USER_NOT_FOUND]: '用户不存在',
}

// 根据响应码获取提示文案
export function getResultMessage(code) {
  return ResultCodeMessage[code] || '未知错误'
}

// 全站共用的 HTTP 客户端。默认走同源相对路径 /api：
// 开发环境由 Vite 代理转发到测试服（无跨域），生产环境由 Nginx 同域转发，
// 或通过 VITE_API_BASE_URL 配置完整接口地址。
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 登录令牌在 localStorage 中的存储键；登录成功后由调用方写入 accessToken。
export const TOKEN_STORAGE_KEY = 'token'

// 后端固定的客户端标识与授权方式。
export const CLIENT_ID = 'e5cd7e4891bf95d1d19206ce24a7b32e'
export const GRANT_TYPE = 'member'

// 保存登录令牌
export function setToken(token) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

// 清除登录令牌
export function clearToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

// 请求拦截：注入客户端标识、授权方式与登录令牌。
apiClient.interceptors.request.use((config) => {
  config.headers.clientId = CLIENT_ID
  config.headers.grantType = GRANT_TYPE

  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// 全局错误提示浮层：接口返回非成功码时自动弹出，3 秒后自动消失。
let toastContainer = null

function showErrorToast(message) {
  if (typeof document === 'undefined' || !message) {
    return
  }

  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.setAttribute('role', 'alert')
    toastContainer.style.cssText =
      'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;'
    document.body.appendChild(toastContainer)
  }

  const item = document.createElement('div')
  item.textContent = message
  item.style.cssText =
    'max-width:80vw;padding:10px 22px;color:#fff;font-size:14px;line-height:1.6;text-align:center;word-break:break-all;background:rgba(20,20,20,.85);border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25);'
  toastContainer.appendChild(item)

  window.setTimeout(() => {
    item.remove()

    if (toastContainer && !toastContainer.childElementCount) {
      toastContainer.remove()
      toastContainer = null
    }
  }, 3000)
}

// 统一请求方法：自动解包 R<T> 结构（{code, msg, data}），code === 1000 视为成功并返回 data；
// 其他响应码默认弹出全局错误提示（msg 或默认文案），并抛出带 code 的错误供调用方补充处理。
// config.silent 为 true 时关闭自动弹窗，由调用方自行展示错误。
// 返回体没有 code 的接口（如文件下载等）原样返回响应体。
export async function request(config) {
  const { silent, ...axiosConfig } = config
  let response

  try {
    response = await apiClient.request(axiosConfig)
  } catch (error) {
    // 网络错误 / 超时 / 非 2xx 状态码等没有统一响应体的场景。
    if (!silent) {
      showErrorToast('网络异常，请稍候再试')
    }

    throw error
  }

  const body = response?.data
  // 兼容 code / resCode 两种字段命名（数值或字符串）。
  const rawCode = body?.code ?? body?.resCode

  if (rawCode !== undefined && rawCode !== null) {
    const code = Number(rawCode)

    if (code !== ResultCode.OK) {
      const message = body?.msg || getResultMessage(code)

      if (!silent) {
        showErrorToast(message)
      }

      const error = new Error(message)
      error.code = code
      error.response = body
      throw error
    }

    return body?.data
  }

  return body
}
