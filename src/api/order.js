import { request } from './http'

/**
 * 获取订单列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, orderNo}
 */
export function getOrderList(data) {
  return request({ url: '/order/list', method: 'post', data })
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
 *   donateType, shopItemsId, number, amount, cycleType, ...}
 * @returns {Promise<string>} 后端返回的字符串（可能是订单号，需与后端确认）
 */
export function createOrder(data) {
  return request({ url: '/order/create', method: 'post', data })
}

/**
 * 删除订单
 * @param {number} id 订单 id
 */
export function deleteOrderById(id) {
  return request({ url: `/order/delete/${id}`, method: 'post' })
}
