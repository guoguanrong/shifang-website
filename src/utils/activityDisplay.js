// 活动列表和详情共用的字段整理：接口里的图片、标签、仪轨都可能是字符串或数组。

export function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function splitList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => text(typeof item === 'string' ? item : item?.url)).filter(Boolean)
  }
  const raw = text(value)
  if (!raw) return []
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return splitList(parsed)
    } catch {
      // 不是 JSON 时按逗号分隔继续处理。
    }
  }
  return raw.split(/[,，]/).map((item) => item.trim()).filter(Boolean)
}

export function formatSchedule(item, labels = {}) {
  const monthly = labels.monthly || '每月{day}日'
  const daily = labels.daily || '每日'
  const startHour = text(item?.startHour)
  const endHour = text(item?.endHour)
  const hours = startHour && endHour ? `${startHour}–${endHour}` : startHour || endHour
  if (Number(item?.timeType) === 2) {
    const start = text(item?.startTime)
    const end = text(item?.endTime)
    const range = start && end && start !== end ? `${start} – ${end}` : start || end
    return [range, hours].filter(Boolean).join(' · ')
  }
  if (Number(item?.fixType) === 1 && item?.day) return [monthly.replace('{day}', String(item.day)), hours].filter(Boolean).join(' · ')
  if (Number(item?.fixType) === 2) return [daily, hours].filter(Boolean).join(' ')
  return hours
}

function nodeText(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node).trim()
  if (Array.isArray(node)) return node.map(nodeText).filter(Boolean).join('')
  if (typeof node === 'object') {
    if (typeof node.text === 'string' || typeof node.text === 'number') return String(node.text).trim()
    if (Array.isArray(node._children)) return node._children.map(nodeText).filter(Boolean).join('')
  }
  return ''
}

const TITLE_KEYS = ['title', 'name', '标题']
const BODY_KEYS = ['desc', 'description', 'content', 'text', 'intro', 'remark', '说明', 'detail']

// 仪轨、功德利益在文档里是 JSON 数组，实际也可能是字符串或 Jackson 节点。
export function parseBlocks(value) {
  let list = value
  if (typeof value === 'string') {
    const raw = value.trim()
    if (!raw) return []
    try {
      list = JSON.parse(raw)
    } catch {
      return [{ title: raw, text: '' }]
    }
  }
  if (list && typeof list === 'object' && !Array.isArray(list) && Array.isArray(list._children)) list = list._children
  if (!Array.isArray(list)) return []
  return list.map((item) => {
    if (typeof item === 'string' || typeof item === 'number') return { title: String(item).trim(), text: '' }
    if (!item || typeof item !== 'object') return { title: '', text: '' }
    const titleKey = TITLE_KEYS.find((key) => item[key] != null && item[key] !== '')
    const bodyKey = BODY_KEYS.find((key) => key !== titleKey && item[key] != null && item[key] !== '')
    const title = titleKey ? nodeText(item[titleKey]) : ''
    const body = bodyKey ? nodeText(item[bodyKey]) : ''
    if (!title && !body) {
      const flat = nodeText(item)
      return flat ? { title: flat, text: '' } : { title: '', text: '' }
    }
    return { title, text: body }
  }).filter((item) => item.title || item.text)
}

export function paragraphs(value) {
  return text(value).split(/\n+/).map((line) => line.trim()).filter(Boolean)
}

export function formatStamp(value, locale = 'zh-CN') {
  const raw = text(value)
  if (!raw) return ''
  const match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{2}:\d{2}))?/)
  if (!match) return raw
  const time = match[4] || ''
  if (String(locale).toLowerCase().startsWith('en')) {
    return [time, `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`].filter(Boolean).join(' ')
  }
  return `${match[1]}年${Number(match[2])}月${Number(match[3])}日${time ? ` ${time}` : ''}`
}
