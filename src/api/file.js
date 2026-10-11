import { request } from './http'

/**
 * 获取文件
 * @param {number} id 文件 id
 */
export function getFileById(id) {
  return request({ url: `/sys/file/get/${id}` })
}

/**
 * 获取文件列表
 * @param {object} data {searchKey, status, startTime, endTime, page, pageSize, url, suffix, createBy}
 */
export function getFileList(data) {
  return request({ url: '/sys/file/list', method: 'post', data })
}

/**
 * 下载文件
 * @param {number} fileId 文件 id
 * @returns {Promise<Blob>} 文件二进制流
 */
export function downloadFile(fileId) {
  return request({ url: `/sys/file/download/${fileId}`, responseType: 'blob' })
}

/**
 * 服务端上传文件
 * @param {File} file 文件
 */
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/sys/file/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 批量删除上传文件
 * @param {number[]} ids 文件 id 列表
 */
export function deleteFiles(ids) {
  return request({ url: '/sys/file/delete', method: 'post', data: ids })
}
