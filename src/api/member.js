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
 * 获取当前登录会员信息
 * @param {object} [options] 额外请求配置，如 { silent: true } 关闭全局错误弹窗
 * @returns {Promise<object>} MemberVo
 */
export function getMemberInfo(options) {
  return request({ url: '/member/info', ...options })
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
export function updateMember(data, options) {
  return request({ url: '/member/update', method: 'post', data, ...options })
}

/**
 * 删除会员
 * @param {number} id 会员 id
 */
export function deleteMemberById(id) {
  return request({ url: `/member/delete/${id}`, method: 'post' })
}
