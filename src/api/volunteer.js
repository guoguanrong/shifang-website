import { request } from './http'

/**
 * 获取义工列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, phone, applyPost}
 */
export function getVolunteerList(data) {
  return request({ url: '/volunteer/list', method: 'post', data })
}

/**
 * 获取义工详情
 * @param {number} id 义工申请 id
 */
export function getVolunteerById(id) {
  return request({ url: `/volunteer/get/${id}` })
}

/**
 * 新增义工（报名）
 * @param {object} data {username, phone, applyPost, serviceTime, remark}
 */
export function saveVolunteer(data) {
  return request({ url: '/volunteer/save', method: 'post', data })
}

/**
 * 查询当前登录用户的义工申请信息（需登录态，无入参）
 * @returns {Promise<object|null>} VolunteerVo{id, username, phone, applyPost, serviceTime, remark,
 *   status(1待审核 2审核通过 3拒绝), refuseReason, createTime}
 */
export function getVolunteerSelfInfo(options) {
  return request({ url: '/volunteer/selfInfo', method: 'get', ...options })
}

/**
 * 修改义工
 * @param {object} data {id*, username, phone, applyPost, serviceTime, remark, status, refuseReason}
 */
export function updateVolunteer(data) {
  return request({ url: '/volunteer/update', method: 'post', data })
}

/**
 * 删除义工
 * @param {number} id 义工申请 id
 */
export function deleteVolunteerById(id) {
  return request({ url: `/volunteer/delete/${id}`, method: 'post' })
}
