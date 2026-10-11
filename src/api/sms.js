import { request } from './http'

/**
 * 发送短信验证码
 * @param {object} data SendSmsRequest{phoneNumber*(含国际区号), recaptchaToken*(reCAPTCHA 令牌)}
 * @param {object} [options] 额外请求配置，如 { silent: true } 关闭全局错误弹窗
 * @returns {Promise<object>} 后端返回的 Map（含 sessionInfo 时需保存，注册/校验时回传）
 */
export function sendSmsCode(data, options) {
  return request({ url: '/sms/sendCode', method: 'post', data, ...options })
}

/**
 * 验证短信验证码并登录
 * @param {object} data VerifySmsRequest{phoneNumber*(含国际区号), sessionInfo*, code*}
 * @param {object} [options] 额外请求配置，如 { silent: true } 关闭全局错误弹窗
 */
export function checkSmsCode(data, options) {
  return request({ url: '/sms/checkSmsCode', method: 'post', data, ...options })
}
