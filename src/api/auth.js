import { request, CLIENT_ID, GRANT_TYPE } from './http'

/**
 * 登录（邮箱验证码登录）
 * @param {object} data {email, code}
 * @param {object} [options] 额外请求配置，如 { silent: true } 关闭全局错误弹窗
 * @returns {Promise<{accessToken: string, expireIn: number, clientId: string, openid: string}>}
 */
export function login(data, options) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { clientId: CLIENT_ID, grantType: GRANT_TYPE, ...data },
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
