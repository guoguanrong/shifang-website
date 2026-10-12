import { request } from './http'

/**
 * 获取点灯列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize}
 */
export function getLightList(data) {
  return request({ url: '/light/list', method: 'post', data })
}

/**
 * 获取点灯详情
 * @param {number} id 点灯 id
 */
export function getLightById(id) {
  return request({ url: `/light/get/${id}` })
}

/**
 * 根据匹配的神祇名称获取对应灯型
 * @param {string} name 神祇名称
 */
export function getLightByGodName(name) {
  return request({ url: `/light/getByGodName/${encodeURIComponent(name)}` })
}

/**
 * 新增点灯
 * @param {object} data {picture, name, matchGod, price, shopItemsIds}
 */
export function saveLight(data) {
  return request({ url: '/light/save', method: 'post', data })
}

/**
 * 修改点灯
 * @param {object} data {id*, picture, name, matchGod, price, shopItemsIds}
 */
export function updateLight(data) {
  return request({ url: '/light/update', method: 'post', data })
}

/**
 * 删除点灯
 * @param {number} id 点灯 id
 */
export function deleteLightById(id) {
  return request({ url: `/light/delete/${id}`, method: 'post' })
}
