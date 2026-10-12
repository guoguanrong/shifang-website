import { request } from './http'

export function getWorshipList(data) {
  return request({ url: '/worship/list', method: 'post', data })
}

export function getWorshipById(id) {
  return request({ url: `/worship/get/${id}` })
}

export function getWorshipByGodName(name) {
  return request({ url: `/worship/getByGodName/${encodeURIComponent(name)}` })
}

export function saveWorship(data) {
  return request({ url: '/worship/save', method: 'post', data })
}

export function updateWorship(data) {
  return request({ url: '/worship/update', method: 'post', data })
}

export function deleteWorshipById(id) {
  return request({ url: `/worship/delete/${id}`, method: 'post' })
}
