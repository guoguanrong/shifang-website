import zhCN from './events.zh-CN.js'

const replacements = { 会:'會', 为:'為', 祈:'祈', 经:'經', 长:'長', 线:'線', 书:'書', 亲:'親', 临:'臨', 场:'場', 历:'歷', 胜:'勝', 获:'獲', 过:'過', 满:'滿', 载:'載', 荡:'蕩', 体:'體', 时:'時', 机:'機', 缘:'緣', 灾:'災', 岁:'歲', 应:'應', 进:'進', 专:'專', 视:'視', 频:'頻', 录:'錄', 个:'個', 这:'這', 举:'舉', 华:'華', 远:'遠', 欢:'歡', 划:'劃', 赦:'赦', 罪:'罪', 道:'道', 圣:'聖', 诞:'誕', 寿:'壽', 辞:'辭', 旧:'舊', 爱:'愛', 与:'與', 统:'統', 读:'讀', 愿:'願', 处:'處', 欢:'歡', 仅:'僅', 觉:'覺', 导:'導', 发:'發', 见:'見', 证:'證', 实:'實', 术:'術', 开:'開', 动:'動', 称:'稱', 类:'類', 参:'參', 万:'萬', 还:'還', 图:'圖', 须:'須', 门:'門', 广:'廣', 说:'說', 无:'無', 阴:'陰', 阳:'陽', 记:'記', 陈:'陳' }
const toTraditional = (value) => {
  if (Array.isArray(value)) return value.map(toTraditional)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item]) => [key,toTraditional(item)]))
  if (typeof value !== 'string') return value
  return [...value].map(char => replacements[char] || char).join('')
}
const traditional = toTraditional(zhCN)

export default {
  ...traditional,
  hero: { ...traditional.hero, title: '道會活動', subtitle: '隨緣參加 · 共修共福 · 道長親自主持', intro: '道會，又稱「齋醮」，是道教最重要的集體修行活動。參加道會不僅能為自己和家人祈福消災，更是與十方善信共結善緣的殊勝機緣。十方殿定期舉辦各類道會，歡迎十方善信隨緣參加。' },
  opportunities: { ...traditional.opportunities, title: '親臨道會 · 四大殊勝機緣', subtitle: '一場道會，一次與神明最近的時刻 —— 親自參加，收穫遠超想像' },
  recentTitle: '近期道會 · 隨喜參加', futureTitle: '未來規劃 · 道會日程', details: '瞭解詳情', more: '查看更多', backToTop: '返回頂部',
}
