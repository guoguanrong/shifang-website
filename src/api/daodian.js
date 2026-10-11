import { request } from './http'

/**
 * 获取道典精读列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, show}
 */
export function getDaodianList(data) {
  return request({ url: '/daodian/list', method: 'post', data })
}

/**
 * 获取道典精读详情
 * @param {number} id 道典精读 id
 */
export function getDaodianById(id) {
  return request({ url: `/daodian/get/${id}` })
}

/**
 * 新增道典精读
 * @param {object} data {cover, title, intro, infoArr, readNum, show}
 */
export function saveDaodian(data) {
  return request({ url: '/daodian/save', method: 'post', data })
}

/**
 * 修改道典精读
 * @param {object} data {id*, cover, title, intro, infoArr, readNum, show}
 */
export function updateDaodian(data) {
  return request({ url: '/daodian/update', method: 'post', data })
}

/**
 * 删除道典精读
 * @param {number} id 道典精读 id
 */
export function deleteDaodianById(id) {
  return request({ url: `/daodian/delete/${id}`, method: 'post' })
}
