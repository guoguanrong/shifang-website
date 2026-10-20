import { request } from './http'

/**
 * 创建 PayPal 支付
 * @param {object} data PayRequest {orderNo, amount, pageUrl}
 * @param {object} [options] 额外请求配置，如 { silent: true }
 * @returns {Promise<object>} PayPalCreateOrderVO，含 paypalOrderId 和 approvalUrl
 */
export function createPaypalPayment(data, options) {
  return request({ url: '/paypal/create', method: 'post', data, ...options })
}

/**
 * Capture：用户支付完成后确认扣款
 * @param {string} paypalOrderId PayPal 订单 id
 * @param {object} [options] 额外请求配置，如 { silent: true }
 * @returns {Promise<object>} PayPal capture response
 */
export function capturePaypalPayment(paypalOrderId, options) {
  const encodedId = encodeURIComponent(paypalOrderId)
  return request({ url: `/paypal/capture/${encodedId}`, method: 'post', ...options })
}
