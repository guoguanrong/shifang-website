import { request } from './http'

/**
 * 获取善款支出记录列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, title, type}
 */
export function getDonationRecordList(data) {
  return request({ url: '/donationRecord/list', method: 'post', data })
}

/**
 * 获取善款支出记录详情
 * @param {number} id 记录 id
 */
export function getDonationRecordById(id) {
  return request({ url: `/donationRecord/get/${id}` })
}

/**
 * 新增善款支出记录
 * @param {object} data {title, type, amount, payTime, operator, remark, fileUrls}
 */
export function saveDonationRecord(data) {
  return request({ url: '/donationRecord/save', method: 'post', data })
}

/**
 * 修改善款支出记录
 * @param {object} data {id*, title, type, amount, payTime, operator, remark, fileUrls}
 */
export function updateDonationRecord(data) {
  return request({ url: '/donationRecord/update', method: 'post', data })
}

/**
 * 删除善款支出记录
 * @param {number} id 记录 id
 */
export function deleteDonationRecordById(id) {
  return request({ url: `/donationRecord/delete/${id}`, method: 'post' })
}
