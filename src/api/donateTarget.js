import { request } from './http'

/**
 * 获取捐赠目标列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize}
 */
export function getDonateTargetList(data, options) {
  return request({ url: '/donateTarget/list', method: 'post', data, ...options })
}

/**
 * 获取捐赠目标详情
 * @param {number} id 捐赠目标 id
 */
export function getDonateTargetById(id) {
  return request({ url: `/donateTarget/get/${id}` })
}

/**
 * 新增捐赠目标
 * @param {object} data {picture, title, subTitle, targetAmount, completedAmount, type, status, shopItemsIds}
 */
export function saveDonateTarget(data) {
  return request({ url: '/donateTarget/save', method: 'post', data })
}

/**
 * 修改捐赠目标
 * @param {object} data {id*, picture, title, subTitle, targetAmount, completedAmount, type, status, shopItemsIds}
 */
export function updateDonateTarget(data) {
  return request({ url: '/donateTarget/update', method: 'post', data })
}

/**
 * 删除捐赠目标
 * @param {number} id 捐赠目标 id
 */
export function deleteDonateTargetById(id) {
  return request({ url: `/donateTarget/delete/${id}`, method: 'post' })
}
