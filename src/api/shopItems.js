import { request } from './http'

/**
 * 获取捐赠物品列表（也包含钱）
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize}
 */
export function getShopItemsList(data) {
  return request({ url: '/shopItems/list', method: 'post', data })
}

/**
 * 获取某个捐赠目标下的捐赠物品
 * @param {object} data {donateTargetId*, type*} type：1 钱，2 物品
 * @returns {Promise<object[]>} ShopItemsVo 列表
 */
export function getDonateShopItems(data, options) {
  return request({ url: '/shopItems/getDonateShopItems', method: 'post', data, ...options })
}

/**
 * 获取捐赠物品详情
 * @param {number} id 捐赠物品 id
 */
export function getShopItemsById(id) {
  return request({ url: `/shopItems/get/${id}` })
}

/**
 * 新增捐赠物品
 * @param {object} data {picture, name, useType, type, unit, price, seq, status}
 */
export function saveShopItems(data) {
  return request({ url: '/shopItems/save', method: 'post', data })
}

/**
 * 修改捐赠物品
 * @param {object} data {id*, picture, name, useType, type, unit, price, seq, status}
 */
export function updateShopItems(data) {
  return request({ url: '/shopItems/update', method: 'post', data })
}

/**
 * 删除捐赠物品
 * @param {number} id 捐赠物品 id
 */
export function deleteShopItemsById(id) {
  return request({ url: `/shopItems/delete/${id}`, method: 'post' })
}
