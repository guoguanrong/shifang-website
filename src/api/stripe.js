import { request } from './http'

/**
 * Stripe 创建支付订单
 * @param {object} data CreatePaymentRequest{orderNo, amountCents}
 * @returns {Promise<object>} 后端返回的 Map，一般含支付跳转信息
 */
export function createStripePayment(data) {
  return request({ url: '/stripe/create', method: 'post', data })
}

/**
 * 查询 Stripe 支付结果
 * @param {string} sessionId Stripe 会话 id
 * @returns {Promise<string>} 支付状态
 */
export function checkStripePayment(sessionId) {
  return request({ url: '/stripe/check', params: { sessionId } })
}
