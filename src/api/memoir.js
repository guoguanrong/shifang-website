import { request } from './http'

/**
 * 获取实录列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, type, show}
 */
export function getMemoirList(data) {
  return request({ url: '/memoir/list', method: 'post', data })
}

/**
 * 获取实录详情
 * @param {number} id 实录 id
 */
export function getMemoirById(id) {
  return request({ url: `/memoir/get/${id}` })
}

/**
 * 新增实录
 * @param {object} data {username, job, title, content, type, show}
 */
export function saveMemoir(data) {
  return request({ url: '/memoir/save', method: 'post', data })
}

/**
 * 修改实录
 * @param {object} data {id*, username, job, title, content, type, show}
 */
export function updateMemoir(data) {
  return request({ url: '/memoir/update', method: 'post', data })
}

/**
 * 删除实录
 * @param {number} id 实录 id
 */
export function deleteMemoirById(id) {
  return request({ url: `/memoir/delete/${id}`, method: 'post' })
}
