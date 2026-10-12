import { request } from './http'

/**
 * 获取活动列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, title, activityType, type, isFuture}
 * isFuture：0 近期道会，1 未来道会
 * @param {object} [options] 额外请求配置，如 { silent: true }
 */
export function getActivityList(data, options) {
  return request({ url: '/activity/list', method: 'post', data, ...options })
}

/**
 * 获取活动详情
 * @param {number|string} id 活动 id
 * @param {object} [options] 额外请求配置，如 { silent: true }
 */
export function getActivityById(id, options) {
  return request({ url: `/activity/get/${id}`, ...options })
}

/**
 * 新增活动
 * @param {object} data {pictureUrls, title, subTitle, tag, activityType, timeType, fixType,
 *   aheadDays, day, startTime, endTime, startHour, endHour, location, joinType, limitUser,
 *   registerEndTime, intro, yigui, benefit, matchCrowd, type}
 */
export function saveActivity(data) {
  return request({ url: '/activity/save', method: 'post', data })
}

/**
 * 修改活动
 * @param {object} data {id*, ...同新增}
 */
export function updateActivity(data) {
  return request({ url: '/activity/update', method: 'post', data })
}

/**
 * 删除活动
 * @param {number} id 活动 id
 */
export function deleteActivityById(id) {
  return request({ url: `/activity/delete/${id}`, method: 'post' })
}
