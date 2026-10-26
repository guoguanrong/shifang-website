import { request, CLIENT_ID } from './http'

/**
 * 登录（邮箱/手机号，验证码或密码登录）
 * 验证码登录 grantType=memberEmail，密码登录 grantType=memberPassword。
 * @param {object} data {email, code} 验证码登录，或 {email, password} 密码登录
 * @param {object} [options] 额外请求配置，如 { silent: true } 关闭全局错误弹窗
 * @returns {Promise<{accessToken: string, expireIn: number, clientId: string, openid: string}>}
 */
export function login(data, options) {
  // 传入密码即视为密码登录，否则走验证码登录。
  const grantType = data?.password ? 'memberPassword' : 'memberEmail'

  return request({
    url: '/auth/login',
    method: 'post',
    data: { clientId: CLIENT_ID, grantType, ...data },
    ...options,
  })
}

/** 注销登录 */
export function logout() {
  return request({ url: '/auth/logout', method: 'post' })
}

/**
 * 三方登录请求（获取授权地址）
 * @param {string} source 三方登录来源
 * @param {object} params {tenantId*, domain*}
 */
export function getSocialAuthUrl(source, params) {
  return request({ url: `/auth/binding/${source}`, params })
}

/**
 * 三方授权回调
 * @param {object} data SocialLoginBody{clientId*, grantType*, tenantId, code, uuid, source*, socialCode*, socialState*}
 */
export function socialCallback(data) {
  return request({ url: '/auth/social/callback', method: 'post', data })
}

/**
 * 取消三方授权
 * @param {number} socialId 三方授权记录 id
 */
export function unbindSocial(socialId) {
  return request({ url: `/auth/unlock/${socialId}` })
}

/** 登录页面租户下拉框 */
export function getLoginTenantList() {
  return request({ url: '/auth/tenant/list' })
}
