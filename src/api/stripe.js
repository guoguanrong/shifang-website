import { request } from './http'

/**
 * Stripe 创建支付订单
 * @param {object} data CreatePaymentRequest{orderNo, amount, pageUrl} amount 单位为元
 * @returns {Promise<object>} 后端返回的 Map，一般含支付跳转信息
 */
export function createStripePayment(data, options) {
  return request({ url: '/stripe/create', method: 'post', data, ...options })
}

/**
 * 查询 Stripe 支付结果
 * @param {string} sessionId Stripe Checkout Session id，对应回跳地址上的 session_id
 * @param {object} [options] 额外请求配置，如 { silent: true }
 * @returns {Promise<string>} 支付状态
 */
export function checkStripePayment(sessionId, options) {
  return request({ url: '/stripe/check', method: 'get', params: { sessionId }, ...options })
}
