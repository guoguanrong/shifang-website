import { request } from './http'

/**
 * 获取活动报名记录列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, mobile}
 */
export function getActivityRegisterList(data) {
  return request({ url: '/activityRegister/list', method: 'post', data })
}

/**
 * 获取活动报名记录详情
 * @param {number} id 报名记录 id
 */
export function getActivityRegisterById(id) {
  return request({ url: `/activityRegister/get/${id}` })
}

/**
 * 新增活动报名（道会登记）
 * @param {object} data {activityId, username, mobile, followUser, prayWish, cert}
 */
export function saveActivityRegister(data, options) {
  return request({ url: '/activityRegister/save', method: 'post', data, ...options })
}

/**
 * 修改活动报名记录
 * @param {object} data {id*, activityId, username, mobile, followUser, prayWish, cert}
 */
export function updateActivityRegister(data) {
  return request({ url: '/activityRegister/update', method: 'post', data })
}

/**
 * 删除活动报名记录
 * @param {number} id 报名记录 id
 */
export function deleteActivityRegisterById(id) {
  return request({ url: `/activityRegister/delete/${id}`, method: 'post' })
}
