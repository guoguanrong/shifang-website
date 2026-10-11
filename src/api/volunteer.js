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
