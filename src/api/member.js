import { request } from './http'

/**
 * 获取会员列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, phone}
 */
export function getMemberList(data) {
  return request({ url: '/member/list', method: 'post', data })
}

/**
 * 获取会员详情
 * @param {number} id 会员 id
 */
export function getMemberById(id) {
  return request({ url: `/member/get/${id}` })
}

/**
 * 注册会员
 * @param {object} data RegisterBody{email*, emailCode*, phone*(含国际区号), smsCode*, sessionInfo, source, uvid*}
 * @param {object} [options] 额外请求配置，如 { silent: true } 关闭全局错误弹窗
 */
export function signupMember(data, options) {
  return request({
    url: '/member/signup',
    method: 'post',
    data,
    ...options,
  })
}

/**
 * 修改会员
 * @param {object} data {id*, nickname, phone, email, password, avatar, status, ...}
 */
export function updateMember(data) {
  return request({ url: '/member/update', method: 'post', data })
}

/**
 * 删除会员
 * @param {number} id 会员 id
 */
export function deleteMemberById(id) {
  return request({ url: `/member/delete/${id}`, method: 'post' })
}
