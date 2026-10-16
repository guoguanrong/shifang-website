const cards = [
  { title: '朔望祈福共修道会', date: '每月初一 · 十五', desc: '每月初一、十五，道长率众诵经祈福，为十方善信统一祈福。您可以线上登记姓名与心愿，道长在道会上代为诵读疏文。无论您身在何处，心与道场同在。', tags: ['诵经祈福', '疏文呈递', '线上登记'] },
  { title: '消灾祈福 · 顺天应时', date: '逢时令节气', desc: '道教讲究顺天应时。每逢三元五腊、本命年、冲太岁之年，正是祈福消灾的最佳时机。您可为家人登记全年祈福牌位，道长每日上香时为您祈福，全年护佑。', tags: ['消灾解厄', '全年牌位', '太岁化解'] },
  { title: '专场祈福 · 个人或全家', date: '随缘预约 · 专人接待', desc: '如有特殊需要——为长辈祝寿、为新生儿祈福、为考试助力、为事业开运、为先人超度，可预约专场道会。道长依您的所求事项排定仪轨，道会圆满后可结缘留影。', tags: ['专场定制', '视频记录', '专人对接'] },
  { title: '中元节 · 地官赦罪道会', date: '2026年8月27日（农历七月十五）· 上午9:00', desc: '中元节为地官大帝赦罪之日，亦是孝亲报恩、追思先人的重要时节。道观举行超度道会，为先人祈福，为家人消灾。', tags: ['赦罪消灾', '超度先人', '孝亲报恩'] },
  { title: '北斗九皇诞 · 拜斗消灾延寿', date: '2026年10月11日-19日（农历九月初一至初九）· 每日上午9:00', desc: '九月初一至初九为北斗九皇圣诞，是拜斗消灾延寿的最佳时机。举行九皇道会，为善信祈求寿康安宁、消灾解厄。', tags: ['拜斗延寿', '消灾解厄', '辞岁迎福'] },
  { title: '消灾祈福 · 顺天应时', date: '逢时令节气', desc: '道教讲究顺天应时。每逢三元五腊、本命年、冲太岁之年，正是祈福消灾的最佳时机。您可为家人登记全年祈福牌位，道长每日上香时为您祈福，全年护佑。', tags: ['消灾解厄', '全年牌位', '太岁化解'] },
]

export default {
  hero: { eyebrow: 'TAOIST RITUALS', title: '道会活动', subtitle: '随心参加 · 共修共福 · 道长亲自主持', quote: '「道不远人，人能弘道；非道弘人，共修共证」', quoteSource: '——《道藏·洞真部·三洞经教部》', intro: '道会，又称"斋醮"，是道教最重要的集体修行活动。参加道会不仅能为自己和家人祈福消灾，更是与十方善信共结善缘的难得机缘。十方殿定期举办各类道会，欢迎十方善信随心参加。' },
  opportunities: { title: '亲临道会 · 四大难得机缘', subtitle: '一场道会，一次与神明最近的时刻 —— 亲自参加，收获远超想象', items: [
    { numeral: '壹', roman: 'YI', title: '亲临道场 · 亲历殊胜', desc: '千年道观，钟磬齐鸣，香云缭绕。道场庄严气场，唯有亲临方能真正感受——那一刻，您与神明最近。' },
    { numeral: '贰', roman: 'ER', title: '亲手写疏 · 当场焚化', desc: '道长亲授疏文书写，姓名心愿一字字落在黄纸之上。亲眼看着疏文在烛火中升腾化去、直上九霄，感应最为真切。' },
    { numeral: '叁', roman: 'SAN', title: '高功当面 · 指点迷津', desc: '道会间隙，高功法师亲自答疑——事业、健康、财运、流年，当面请教，句句受用。此等机缘，错过再等来年。' },
    { numeral: '肆', roman: 'SI', title: '涤荡身心 · 满载福泽', desc: '一场道会，涤荡身心：消晦气、解郁结、结善缘。离场时带走的不仅是一份心安，更是满满的福泽与欢喜。' },
  ] },
  recentTitle: '近期道会 · 随心参加', futureTitle: '未来规划 · 道会日程', cards, futureCards: cards.slice(3).concat(cards.slice(3)), details: '了解详情', more: '查看更多', empty: '暂无数据', loading: '加载中', backToTop: '返回顶部',
  detail: {
    time: '道会时间', location: '道会地点', tags: '活动标签', join: '参加方式', deadline: '报名截止', audience: '适合人群', limit: '人数上限', limitPeople: '{count} 人',
    intro: '道会简介', ritual: '仪轨流程', benefit: '参加道会的功德利益', crowd: '适合人群',
    registerOnline: '线上登记祈福', registerOffline: '线下亲临', deadlineLine: '登记截止：{time}', ahead: '道会日前 {days} 天',
    collective: '集体活动', reserved: '专场预约', joinOnline: '线上登记', joinOffline: '线下亲临',
    monthly: '每月{day}日', daily: '每日', prev: '上一张', next: '下一张', back: '返回道会活动',
  },
  registerDialog: {
    subtitle: '善信登记 · 共赴道会', name: '善信姓名', namePlaceholder: '用于现场核验与功德登记', mobile: '联络手机', mobilePlaceholder: '请输入手机号码',
    companions: '随行人数', selfOnly: '0人 仅本人', companionCount: '{count}人', wish: '祈福心愿(选填)', wishPlaceholder: '心愿不拘多少，道长代呈疏文',
    next: '下一步 · 核对信息', notice: '请线上登记姓名、手机号码，线下准时参加，出示登记信息；',
    nameRequired: '请填写善信姓名', mobileRequired: '请输入手机号码', mobileInvalid: '请输入正确的手机号码',
    confirmTitle: '核对登记信息', confirmSubtitle: '信息无误，即登记功德', gathering: '道会', devotee: '善信', phone: '手机', party: '随行人数', partyValue: '{count}人', self: '仅本人',
    back: '返回修改', submit: '登记功德', submitting: '登记中',
    successTitle: '登记功德已成', successSubtitle: '感恩善信护持，请于道会时间准时赴会', cert: '登记凭证',
    sms: '同时会将登记成功结果信息以短信形式发送至{mobile}', arrival: '到场出示登记信息，即可核验入场，福生无量天尊！', closeBlessing: '福生无量天尊', failed: '登记失败，请稍后再试',
  },
  schedule: {
    breadcrumb: '道会日程', eyebrow: 'Ritual Schedule', title: '道会日程', subtitle: '线上登记 · 随心参加',
    futureTitle: '道会日程 · 未来规划', futureSubtitle: '未来规划 · 随心参加 · 共修共福',
    previous: '上一页', next: '下一页', pageInfo: '第 {current} / {total} 页', total: '共 {count} 条', pagination: '道会日程分页',
  },
}
