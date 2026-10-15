import { request } from './http'

/**
 * 获取跟练视频列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, difficulty, show}
 */
export function getSportWellnessList(data) {
  return request({ url: '/sportWellness/list', method: 'post', data })
}

/**
 * 获取跟练视频详情
 * @param {number} id 跟练视频 id
 * @param {object} options 请求附加选项（如 { silent: true } 静默失败）
 */
export function getSportWellnessById(id, options = {}) {
  return request({ url: `/sportWellness/get/${id}`, ...options })
}

/**
 * 新增跟练视频
 * @param {object} data {videoUrl, title, intro, difficulty, duration, modality, playNum, show, infoArr}
 */
export function saveSportWellness(data) {
  return request({ url: '/sportWellness/save', method: 'post', data })
}

/**
 * 修改跟练视频
 * @param {object} data {id*, videoUrl, title, intro, difficulty, duration, modality, playNum, show, infoArr}
 */
export function updateSportWellness(data) {
  return request({ url: '/sportWellness/update', method: 'post', data })
}

/**
 * 删除跟练视频
 * @param {number} id 跟练视频 id
 */
export function deleteSportWellnessById(id) {
  return request({ url: `/sportWellness/delete/${id}`, method: 'post' })
}
