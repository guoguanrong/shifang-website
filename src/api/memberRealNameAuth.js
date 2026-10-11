import { request } from './http'

/**
 * 获取会员-实名认证信息列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize}
 */
export function getMemberRealNameAuthList(data) {
  return request({ url: '/memberRealNameAuth/list', method: 'post', data })
}

/**
 * 获取会员-实名认证信息详情
 * @param {number} id 实名认证记录 id
 */
export function getMemberRealNameAuthById(id) {
  return request({ url: `/memberRealNameAuth/get/${id}` })
}

/**
 * 新增会员-实名认证信息
 * @param {object} data {memberId, authType, username, idCard, idCardPhotoFront, idCardPhotoBack,
 *   driverLicensePhotoFront, driverLicensePhotoBack, passportPhotoFront, passportPhotoBack}
 */
export function saveMemberRealNameAuth(data) {
  return request({ url: '/memberRealNameAuth/save', method: 'post', data })
}

/**
 * 修改会员-实名认证信息
 * @param {object} data {id*, memberId, authType, username, idCard, ...}
 */
export function updateMemberRealNameAuth(data) {
  return request({ url: '/memberRealNameAuth/update', method: 'post', data })
}

/**
 * 删除会员-实名认证信息
 * @param {number} id 实名认证记录 id
 */
export function deleteMemberRealNameAuthById(id) {
  return request({ url: `/memberRealNameAuth/delete/${id}`, method: 'post' })
}
