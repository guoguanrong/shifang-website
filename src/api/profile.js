import { request } from './http'

/** 获取登录用户信息 */
export function getProfileInfo() {
  return request({ url: '/user/profile/info' })
}

/**
 * 修改个人信息
 * @param {object} data {nickname, username, phone, email, ...}
 */
export function updateProfile(data) {
  return request({ url: '/user/profile/updateProfile', method: 'post', data })
}

/**
 * 登录人修改密码
 * @param {object} params {oldPwd*, newPwd*}
 */
export function updateProfilePwd(params) {
  return request({ url: '/user/profile/updatePwd', method: 'post', params })
}

/**
 * 修改头像
 * @param {File} file 头像图片文件
 */
export function updateProfileAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/user/profile/avatar',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 根据账号 / 手机号 / 邮箱获取用户 id
 * @param {string} key 账号或手机号或邮箱
 */
export function getUserIdByKey(key) {
  return request({ url: '/user/profile/getUserId', params: { key } })
}

/**
 * 忘记密码-通过短信重置密码
 * @param {object} params {id*, newPwd*, phone*, userType*, sign*}
 */
export function resetPwdBySms(params) {
  return request({ url: '/user/profile/resetPwd', method: 'post', params })
}
