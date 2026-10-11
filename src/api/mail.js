import { request } from './http'

/**
 * 发送验证码邮件
 * @param {string} email 收件邮箱
 * @param {object} [options] 额外请求配置，如 { silent: true } 关闭全局错误弹窗
 */
export function sendEmailCode(email, options) {
  return request({ url: '/mail/sendCode', params: { email }, ...options })
}

/**
 * 发送邮件，自定义主题和内容
 * @param {object} params {to, subject, text}
 */
export function sendSimpleMail(params) {
  return request({ url: '/mail/sendSimpleMessage', params })
}

/**
 * 发送邮件（带附件）
 * @param {object} params {to, subject, text}
 */
export function sendMailWithAttachment(params) {
  return request({ url: '/mail/sendMessageWithAttachment', params })
}

/**
 * 发送邮件（多附件）
 * @param {object} params {to, subject, text}
 */
export function sendMailWithAttachments(params) {
  return request({ url: '/mail/sendMessageWithAttachments', params })
}
