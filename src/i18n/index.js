import { createI18n } from 'vue-i18n'
import { compile as compileMessage } from '@intlify/core-base'
import enMessages from './locales/en.js'
import zhCNMessages from './locales/zh-CN.js'

/**
 * 文案编译兜底。
 *
 * vue-i18n 会把文案里的 `{}` `@` `|` 当成模板语法解析。运营/设计同学写的普通文本
 * 一旦撞上（例如邮箱 contact@shifang.org，其中的 @ 会被当成 linked-message），
 * 编译器会抛 SyntaxError，进而让整个组件树渲染失败 —— 表现为整页白屏。
 *
 * 这里做成兜底：编译失败就按纯文本原样渲染，只打日志，不让整站挂掉。
 * 日常写文案仍建议对特殊字符使用字面量转义，例如 "contact{'@'}shifang.org"。
 */
function safeMessageCompiler(source, context) {
  try {
    return compileMessage(source, context)
  } catch (error) {
    console.error('[i18n] 文案编译失败，已按纯文本渲染：', source, error)
    return () => source
  }
}

const STORAGE_KEY = 'shifang-locale-v2'

// 语言选择器的数据源；code 同时作为 vue-i18n 的 locale 标识。
export const localeOptions = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'zh-CN', label: '简体中文', shortLabel: '简' },
  { code: 'zh-TW', label: '繁體中文', shortLabel: '繁' },
]

const supportedLocaleCodes = new Set(localeOptions.map((option) => option.code))

// 简体中文随首包加载，其余语言按需加载并缓存加载状态。
const defaultLocale = 'zh-CN'
const loadedLocaleCodes = new Set([defaultLocale])
const localeLoadPromises = new Map()
let localeSwitchRequestId = 0
const localeLoaders = {
  en: () => Promise.resolve({ default: enMessages }),
  'zh-CN': () => Promise.resolve({ default: zhCNMessages }),
  'zh-TW': () => import('./locales/zh-TW.js'),
}

function getInitialLocale() {
  // 服务端或构建环境没有 window，直接使用默认语言。
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  // 仅接受语言列表中存在的本地缓存值，防止旧值或脏数据造成异常。
  const savedLocale = window.localStorage.getItem(STORAGE_KEY)

  return supportedLocaleCodes.has(savedLocale) ? savedLocale : defaultLocale
}

function applyDocumentLanguage(locale) {
  if (typeof document !== 'undefined') {
    // 同步原生 lang 属性，便于无障碍工具和搜索引擎识别页面语言。
    document.documentElement.lang = locale
    // 中文稿继续沿用 Figma 的紧凑书法排版；其余语言统一启用可扩展的国际化布局。
    // 后续新增法语、德语等语言时，无需再修改组件模板。
    document.documentElement.dataset.localeLayout = locale.toLowerCase().startsWith('zh')
      ? 'chinese'
      : 'international'
  }
}

export const i18n = createI18n({
  // Composition API 模式，与项目中的 useI18n 调用方式保持一致。
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: defaultLocale,
  messages: {
    [defaultLocale]: zhCNMessages,
  },
  messageCompiler: safeMessageCompiler,
})

export async function loadLocaleMessages(locale) {
  // 不支持或已加载的语言无需再次请求资源。
  if (!supportedLocaleCodes.has(locale) || loadedLocaleCodes.has(locale)) {
    return
  }

  // 多次快速切到同一个语言时复用同一个 import promise，避免重复加载同一 chunk。
  if (!localeLoadPromises.has(locale)) {
    const loadPromise = localeLoaders[locale]()
      .then((module) => {
        i18n.global.setLocaleMessage(locale, module.default)
        loadedLocaleCodes.add(locale)
      })
      .finally(() => {
        localeLoadPromises.delete(locale)
      })
    localeLoadPromises.set(locale, loadPromise)
  }

  return localeLoadPromises.get(locale)
}

export async function setupI18n() {
  // 应用挂载前恢复用户上次选择，并确保对应文案已经可用。
  const locale = getInitialLocale()
  await loadLocaleMessages(locale)
  i18n.global.locale.value = locale
  applyDocumentLanguage(locale)
}

export async function setAppLocale(locale) {
  // 对外暴露的切换入口只处理受支持的语言。
  if (!supportedLocaleCodes.has(locale)) {
    return
  }

  // 语言包是异步 chunk。快速反复切换时，只允许最后一次选择真正更新全局 locale。
  const requestId = ++localeSwitchRequestId
  await loadLocaleMessages(locale)
  if (requestId !== localeSwitchRequestId) {
    return
  }
  i18n.global.locale.value = locale
  applyDocumentLanguage(locale)

  if (typeof window !== 'undefined') {
    // 保存用户选择，刷新页面后继续使用同一种语言。
    window.localStorage.setItem(STORAGE_KEY, locale)
  }
}
