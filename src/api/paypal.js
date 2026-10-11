import { request } from './http'

/**
 * 创建 PayPal 支付
 * @param {object} data 支付参数 {uvid, amount}
 * @returns {Promise<object>} PayPal 返回 Map，含 approvalUrl 支付跳转地址
 */
export function createPaypalPayment(data) {
  return request({ url: '/paypal/create', method: 'post', data })
}

/**
 * Capture：用户支付完成后确认扣款
 * @param {string} paypalOrderId PayPal 订单 id
 * @returns {Promise<object>} PayPal 订单详情
 */
export function capturePaypalPayment(paypalOrderId) {
  return request({ url: '/paypal/capture', params: { paypalOrderId } })
}

/**
 * 查询 PayPal 订单
 * @param {string} paypalOrderId PayPal 订单 id
 */
export function getPaypalOrder(paypalOrderId) {
  return request({ url: `/paypal/order/${paypalOrderId}` })
}

/**
 * PayPal 支付成功回调
 * @param {string} token PayPal 回调 token
 */
export function paypalSuccess(token) {
  return request({ url: '/paypal/success', params: { token } })
}

/**
 * PayPal 取消支付回调
 */
export function paypalCancel() {
  return request({ url: '/paypal/cancel' })
}
