import { request } from './http'

/**
 * 获取寄语列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, category, show}
 */
export function getWishesList(data) {
  return request({ url: '/wishes/list', method: 'post', data })
}

/**
 * 获取寄语详情
 * @param {number} id 寄语 id
 */
export function getWishesById(id) {
  return request({ url: `/wishes/get/${id}` })
}

/**
 * 新增寄语
 * @param {object} data {type, videoUrl, imgArrUrls, category, title, content, detail, show}
 */
export function saveWishes(data) {
  return request({ url: '/wishes/save', method: 'post', data })
}

/**
 * 修改寄语
 * @param {object} data {id*, type, videoUrl, imgArrUrls, category, title, content, detail, show}
 */
export function updateWishes(data) {
  return request({ url: '/wishes/update', method: 'post', data })
}

/**
 * 删除寄语
 * @param {number} id 寄语 id
 */
export function deleteWishesById(id) {
  return request({ url: `/wishes/delete/${id}`, method: 'post' })
}
