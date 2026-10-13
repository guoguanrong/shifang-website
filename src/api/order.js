import { request } from './http'

/**
 * 获取订单列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, orderNo}
 */
export function getOrderList(data) {
  return request({ url: '/order/list', method: 'post', data })
}

/**
 * 会员获取自己的订单列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, orderNo, type}
 * status：1 待支付，2 待供奉，3 供奉中，4 已过期
 * type：1 点灯订单，2 神像供奉订单，3 捐赠订单
 * @param {object} [options] 额外请求配置，如 { silent: true }
 */
export function listSelfOrder(data, options) {
  return request({ url: '/order/listSelfOrder', method: 'post', data, ...options })
}

/**
 * 获取订单详情
 * @param {number} id 订单 id
 */
export function getOrderById(id) {
  return request({ url: `/order/get/${id}` })
}

/**
 * 创建订单
 * @param {object} data {type*, businessId*, memberId, username, mobile, email, birthday, prayWish,
 *   donateType, shopItemsId, number, amount, cycleType}
 * type：1 点灯，2 神像供奉，3 捐赠。供奉订单 cycleType：1 一年，2 一月。
 * donateType、shopItemsId 仅捐赠订单使用。
 * @returns {Promise<string>} 后端返回的字符串（可能是订单号，需与后端确认）
 */
export function createOrder(data, options) {
  return request({ url: '/order/create', method: 'post', data, ...options })
}

/**
 * 删除订单
 * @param {number} id 订单 id
 */
export function deleteOrderById(id) {
  return request({ url: `/order/delete/${id}`, method: 'post' })
}
