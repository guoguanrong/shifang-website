import { request } from './http'

/**
 * 中国道教星座测试：按公历生日返回干支纪年、星次、守护星宿与本命星君
 * @param {object} params {year*, month*, day*} 公历生日
 * @returns {Promise<object>} AstrologyResult{ganzhiYear, lunarDateStr, starRegion, starRegionDesc,
 *   zodiacSign, zodiacAnimal, starMansion, starMansionFull, fortuneText, coreTraits[], detailTraits[]}
 */
export function getConstellation(params, options) {
  return request({ url: '/pray/constellation', method: 'get', params, ...options })
}

/**
 * 运势评测：按生肖返回流年运势文案
 * @param {object} params {zodiac*} 生肖名（中文，如 "牛"）
 * @returns {Promise<object>} FortuneResult{titleText, fortuneText, blessingText, subBlessingText, buttonText}
 */
export function getFortune(params, options) {
  return request({ url: '/pray/fortune', method: 'get', params, ...options })
}

/**
 * 道教求签：按求签类型返回签题与签文
 * @param {object} params {type*} 求签类型 1.事业 2.财运 3.健康 4.姻缘
 * @returns {Promise<object>} DivinationResult{title, poemText, blessing1, blessing2, buttonText}
 */
export function getDivination(params, options) {
  return request({ url: '/pray/divination', method: 'get', params, ...options })
}

/**
 * 查询今日是否已抽签（需登录）
 * @returns {Promise<number>} 1 已抽签，0 未抽签
 */
export function getDrawLots(options) {
  return request({ url: '/pray/drawLots', method: 'get', ...options })
}

/**
 * 开启节气提醒（需登录）
 * @returns {Promise<number>} 1 表示开启成功
 */
export function openSolarTerms(options) {
  return request({ url: '/pray/openSolarTerms', method: 'get', ...options })
}

/**
 * 取消节气提醒（需登录）
 * @returns {Promise<number>} 1 表示取消成功
 */
export function cancelSolarTerms(options) {
  return request({ url: '/pray/cancelSolarTerms', method: 'get', ...options })
}

/**
 * 查询是否开启节气提醒（需登录）
 * @returns {Promise<number>} 1 已开启，0 未开启
 */
export function getSolarTermsStatus(options) {
  return request({ url: '/pray/solarTerms', method: 'get', ...options })
}
