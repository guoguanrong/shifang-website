import { request } from './http'

/**
 * 获取神像供奉列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize}
 */
export function getWorshiList(data) {
  return request({ url: '/worshi/list', method: 'post', data })
}

/**
 * 获取神像供奉详情
 * @param {number} id 神像供奉 id
 */
export function getWorshiById(id) {
  return request({ url: `/worshi/get/${id}` })
}

/**
 * 新增神像供奉
 * @param {object} data {picture, matchGod, monthPrice, yearPrice}
 */
export function saveWorshi(data) {
  return request({ url: '/worshi/save', method: 'post', data })
}

/**
 * 修改神像供奉
 * @param {object} data {id*, picture, matchGod, monthPrice, yearPrice}
 */
export function updateWorshi(data) {
  return request({ url: '/worshi/update', method: 'post', data })
}

/**
 * 删除神像供奉
 * @param {number} id 神像供奉 id
 */
export function deleteWorshiById(id) {
  return request({ url: `/worshi/delete/${id}`, method: 'post' })
}
