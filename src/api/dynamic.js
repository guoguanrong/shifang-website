import { request } from './http'

/**
 * 获取动态列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, show}
 * @param {object} options 请求附加选项（如 { silent: true } 静默失败）
 */
export function getDynamicList(data, options = {}) {
  return request({ url: '/dynamic/list', method: 'post', data, ...options })
}

/**
 * 获取动态详情
 * @param {number} id 动态 id
 */
export function getDynamicById(id) {
  return request({ url: `/dynamic/get/${id}` })
}

/**
 * 新增动态
 * @param {object} data {cover, title, content, wishes, readNum, show}
 */
export function saveDynamic(data) {
  return request({ url: '/dynamic/save', method: 'post', data })
}

/**
 * 修改动态
 * @param {object} data {id*, cover, title, content, wishes, readNum, show}
 */
export function updateDynamic(data) {
  return request({ url: '/dynamic/update', method: 'post', data })
}

/**
 * 删除动态
 * @param {number} id 动态 id
 */
export function deleteDynamicById(id) {
  return request({ url: `/dynamic/delete/${id}`, method: 'post' })
}
