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
  recentTitle: '近期道會 · 隨心參加', futureTitle: '未來規劃 · 道會日程', details: '瞭解詳情', more: '查看更多', empty: '暫無數據', loading: '載入中', backToTop: '返回頂部',
  detail: {
    ...traditional.detail,
    time: '道會時間', location: '道會地點', tags: '活動標籤', join: '參加方式', deadline: '報名截止', audience: '適合人群', limit: '人數上限', limitPeople: '{count} 人',
    intro: '道會簡介', ritual: '儀軌流程', benefit: '參加道會的功德利益', crowd: '適合人群',
    registerOnline: '線上登記祈福', registerOffline: '線下親臨', deadlineLine: '登記截止：{time}', ahead: '道會日前 {days} 天',
    collective: '集體活動', reserved: '專場預約', joinOnline: '線上登記', joinOffline: '線下親臨',
    monthly: '每月{day}日', daily: '每日', prev: '上一張', next: '下一張', back: '返回道會活動',
  },
  registerDialog: {
    subtitle: '善信登記 · 共赴道會', name: '善信姓名', namePlaceholder: '用於現場核驗與功德登記', mobile: '聯絡手機', mobilePlaceholder: '請輸入手機號碼',
    companions: '隨行人數', selfOnly: '0人 僅本人', companionCount: '{count}人', wish: '祈福心願(選填)', wishPlaceholder: '心願不拘多少，道長代呈疏文',
    next: '下一步 · 核對信息', notice: '請線上登記姓名、手機號碼，線下準時參加，出示登記信息',
    nameRequired: '請填寫善信姓名', mobileRequired: '請輸入手機號碼', mobileInvalid: '請輸入正確的手機號碼',
    confirmTitle: '核對登記信息', confirmSubtitle: '信息無誤，即登記功德', gathering: '道會', devotee: '善信', phone: '手機', party: '隨行人數', partyValue: '{count}人', self: '僅本人',
    back: '返回修改', submit: '登記功德', submitting: '登記中',
    successTitle: '登記功德已成', successSubtitle: '感恩善信護持，請於道會時間準時赴會', cert: '登記憑證',
    sms: '同時會將登記成功結果信息以短信形式發送至{mobile}', arrival: '到場出示登記信息，即可核驗入場，福生無量天尊！', closeBlessing: '福生無量天尊', failed: '登記失敗，請稍後再試',
  },
  schedule: {
    ...traditional.schedule,
    breadcrumb: '道會日程', title: '道會日程', subtitle: '線上登記 · 隨緣參加',
    futureTitle: '道會日程 · 未來規劃', futureSubtitle: '未來規劃 · 隨緣參加 · 共修共福',
    previous: '上一頁', next: '下一頁', pageInfo: '第 {current} / {total} 頁', total: '共 {count} 條', pagination: '道會日程分頁',
  },
}
