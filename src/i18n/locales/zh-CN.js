import culture from './culture.zh-CN.js'
import deities from './deities.zh-CN.js'
import deityDetail from './deity-detail.zh-CN.js'
import etiquette from './etiquette.zh-CN.js'
import wellness from './wellness.zh-CN.js'
import coBuild from './co-build.zh-CN.js'
import cloudBuild from './cloud-build.zh-CN.js'
import fundDetails from './fund-details.zh-CN.js'
import blessings from './blessings.zh-CN.js'
import blessingDetails from './blessing-details.zh-CN.js'
import offerings from './offerings.zh-CN.js'
import lampDetail from './lamp-detail.zh-CN.js'
import donation from './donation.zh-CN.js'
import events from './events.zh-CN.js'
import portal from './portal.zh-CN.js'
import accountPages from './account-pages.zh-CN.js'
import accountDetails from './account-details.zh-CN.js'
import policyPages from './policy-pages.zh-CN.js'
import siteTools from './site-tools.zh-CN.js'

// 简体中文全站文案；对象层级与组件中的 t()/tm() 路径保持一致。
export default {
  // 文化渊源页使用独立文件维护，避免主语言包过长。
  culture,
  // 神祇百科页的长列表单独维护，便于内容团队持续补充资料。
  deities,
  deityDetail,
  // 参拜礼仪页按完整仪轨单独维护。
  etiquette,
  // 道法养生页的长列表与卡片内容独立维护。
  wellness,
  // 共建十方页的捐赠项目、功德回馈及名录独立维护。
  coBuild,
  // 云端共筑页的资金公示与实时监控文案独立维护。
  cloudBuild,
  fundDetails,
  blessings,
  blessingDetails,
  offerings,
  lampDetail,
  donation,
  events,
  portal,
  accountPages,
  accountDetails,
  policyPages,
  siteTools,
  // 顶部导航与账户操作。
  nav: {
    logo: '十方殿',
    items: ['关于我们', '文化溯源', '神祇百科', '参拜礼仪', '道法养生', '共建十方', '云端共筑', '祈福纳祥', '道会活动'],
    lang: '简体中文',
    login: '登录',
  },
  // 首页首屏行动文案。
  hero: {
    badge: 'GLOBAL CHINESE INITIATIVE',
    ctaPrimary: '成为护道人',
    ctaSecondary: '探索文化',
    scroll: '向下探索',
  },
  // 关于我们简介与机构说明。
  about: {
    en: 'About Us',
    title: '关于十方殿',
    subtitle: '十方来，十方聚，共成十方事',
    quote: '「道者，万物之奥，善人之宝」',
    quoteSource: '—— 《道德经》· 道藏洞神部',
    lead: ['守护千年道脉', '以文化为桥，连接全球华人'],
    paragraphs: [
      '十方殿（ShiFang Hall）是依据美国《国内税收法》第501(c)(3)条款设立的非营利组织，其运营宗旨为慈善、宗教及教育用途。我们以「十方来，十方聚，共成十方事」为理念，致力于道教文化遗产保护与宗教公益活动。',
      '道教是中华文明的根脉，承载着数千年的哲学智慧、养生之道与精神信仰。十方殿以传承道教文化为己任，通过数字化平台让古老的东方智慧跨越时空，触及全球华人。我们相信，道文化不仅是历史的遗产，更是当代生活的指南——为浮躁的心灵提供安顿，为迷茫的人生指引方向。',
      '我们致力于：弘扬道教经典——《道藏》《道德经》《庄子》等千年智慧的重译与传播；保护道教遗产——宫观修缮、古籍数字化、非遗技艺传承；搭建文化桥梁——让海外华人找到精神原乡，让世界了解东方哲学。',
      '十方殿不仅是宗教场所，更是一个文化传播的平台。我们通过线上讲经、文化课程、节气共修、祈福点灯等方式，让道文化融入日常生活，让更多人感受到「道法自然」的生活智慧。',
      '文化兴则国运兴，文化强则民族强。十方殿愿与十方善信一起，守护这份千年道脉，让道教文化在新时代焕发出更加璀璨的光芒。',
    ],
  },
  // 神殿规划卡片。
  templePlan: {
    en: 'Temple Planning',
    title: '神殿规划',
    subtitle: '千年道场，重现庄严',
    cards: [
      { title: '斗姆元君大殿', desc: '主殿修缮工程，供奉斗姆元君圣像及诸神像。修缮内容包括屋顶翻新、梁柱加固、彩绘复原、神像贴金等六大工程，令斗姆金身庄严、道场清净。' },
      { title: '神像重塑', desc: '三清道祖神像由福建传统木雕工艺大师亲手雕刻，选用上等楠木，高约3.6米。同时重塑斗姆元君、玉皇大帝等配祀神像共12尊。' },
      { title: '壁画长廊', desc: '珍藏明代道教壁画全长约36米，描绘道教神仙体系与十方世界。修复工程包括画面清理、色彩加固、缺失补绘及防潮处理。' },
      { title: '园林景观', desc: '传统道教园林风格设计，规划放生池、九曲桥、太极广场、四季花木与碑廊。太极广场可容纳300人参与户外道会。' },
    ],
  },
  // 使命、愿景与核心价值。
  mission: {
    en: 'Mission & Vision',
    title: '使命与愿景',
    subtitle: '十方来，十方聚，共成十方事',
    items: [
      { char: '道', title: '我们的使命', desc: '以数字化方式连接十方善缘，让每一份善心都能精准服务于道教文化遗产的保护与传承。' },
      { char: '善', title: '我们的愿景', desc: '成为最具公信力的道教文化公益平台，建立全透明、可追溯的善款管理体系。' },
      { char: '信', title: '核心价值', desc: '以「诚信、透明、信仰、传承」为立身之本。每一分善款去向清晰可查。' },
    ],
  },
  // 组织架构及各层级职责。
  organization: {
    en: 'Organization',
    title: '组织与架构',
    subtitle: '专业团队，规范运营，透明治理',
    items: [
      { level: '决策层', title: '理事会', desc: '由宗教文化界、公益界知名人士组成，负责平台重大战略决策与方向把控。' },
      { level: '执行层', title: '秘书处', desc: '日常运营管理、项目执行与协调、对外联络与合作事务。' },
      { level: '监督层', title: '资金监管委员会', desc: '独立第三方机构，负责善款的审计、监督与定期公示。' },
      { level: '顾问层', title: '专家顾问团', desc: '文物保护、宗教文化、法律合规等领域专家提供专业指导意见。' },
      { level: '协作层', title: '合作单位', desc: '与多家道教活动场所、高校研究机构建立深度合作。' },
      { level: '志愿层', title: '善缘志愿者', desc: '超过500名注册志愿者参与文化推广与公益活动组织。' },
    ],
  },
  // 资金监管机制。
  supervision: {
    en: 'Supervision',
    title: '资金监管',
    subtitle: '全透明 · 可追溯 · 严审计',
    items: [
      { title: '云端实时查看', desc: '修缮工程资金使用明细在线可查，捐赠者可随时了解进度。' },
      { title: '资金流向明细', desc: '每一笔善款收入与支出均生成独立编码，支持按项目、时间、金额筛选查询。' },
    ],
  },
  // 时令指引卡片。
  seasonal: {
    en: 'Seasonal Guide',
    title: '时令指引',
    subtitle: '敬天顺时，趋吉避凶 · 预防大于治疗',
    items: [
      { char: '辰', title: '2026 · 丙午年', desc: '马年值太岁，属马者值太岁，属鼠者冲太岁。建议年初供奉太岁灯，化解冲煞，安度流年。', action: '了解化解方式' },
      { char: '夏', title: '盛夏 · 避暑养心', desc: '盛夏当令，心火旺盛。此时宜清心寡欲、避暑纳凉，多食清淡疏果，少食油腻辛辣。午时静坐养神，酉时散步纳凉。顺应天时，平安度夏。', action: '查看夏季养生' },
      { char: '考', title: '考试季 · 文昌', desc: '每年春夏之交为中高考、公考关键期。供奉文昌灯，祈愿金榜题名、仕途通达。', action: '点亮文昌灯' },
      { char: '运', title: '流年运势', desc: '了解您今年的生肖运势，提前布局。犯太岁、冲太岁、刑太岁者应尽早化解。', action: '查看运势' },
    ],
  },
  // 信众案例。
  testimonials: {
    en: 'Testimonials',
    title: '信众实录',
    subtitle: '真实案例 · 善愿得偿 · 福生无量',
    more: '查看更多',
    items: [
      { name: '陈明辉', tag: '事业', role: '企业高管 · 供太岁灯一年', quote: '去年犯太岁，年初在十方殿供了太岁灯。半年后原本停滞的项目突然有了转机，顺利升了总监。现在每年都会来供灯，预防总比到时候着急好。' },
      { name: '陈明辉', tag: '学业', role: '企业高管 · 供太岁灯一年', quote: '孩子考研那年心里没底，在十方殿点了文昌灯。道长还专门为孩子做了疏文祈福。后来孩子以笔试第二的成绩考上了理想学校。感恩十方殿！' },
      { name: '陈明辉', tag: '健康', role: '企业高管 · 供太岁灯一年', quote: '父亲生病期间在十方殿捐了药王灯，也参与了大雄宝殿修缮。两个月后复查医生说恢复得比预期好很多。我不知道是不是巧合，但心里的安定是实实在在的。' },
      { name: '陈明辉', tag: '财运', role: '企业高管 · 供太岁灯一年', quote: '去年生意一直不见起色，朋友推荐到十方殿供奉了财神灯。三个月后接连签下两个大客户，营业额翻了一番。不管是不是巧合，这份信心和安定是实实在在的。' },
      { name: '陈明辉', tag: '平安', role: '企业高管 · 供太岁灯一年', quote: '去年家里人轮流生病住院，朋友建议我到十方殿请了一道平安符。之后半年全家人都平平安安的。现在每个月初一都想着去道观看看，心里踏实。' },
      { name: '陈明辉', tag: '事业', role: '企业高管 · 供太岁灯一年', quote: '父母关系一直紧张，我在十方殿为他们供了祈福牌位，捐资修缮大殿。几个月下来，明显感觉家里的气氛缓和了许多，周末一家人也愿意一起吃饭了。心诚则灵。' },
      { name: '陈明辉', tag: '祈福', role: '企业高管 · 供太岁灯一年', quote: '去年生意一直不见起色，朋友推荐到十方殿供奉了财神灯。三个月后接连签下两个大客户，营业额翻了一番。不管是不是巧合，这份信心和安定是实实在在的。' },
      { name: '陈明辉', tag: '事业', role: '企业高管 · 供太岁灯一年', quote: '去年家里人轮流生病住院，朋友建议我到十方殿请了一道平安符。之后半年全家人都平平安安的。现在每个月初一都想着去道观看看，心里踏实。' },
    ],
  },
  // 各界寄语与分类标签。
  messages: {
    en: 'Messages',
    title: '各界寄语',
    subtitle: '来自社会各界的声音与祝福',
    more: '查看更多',
    tabs: ['知名人士', '业内人士', '其他善信人士'],
    items: [
      { name: '知名文化学者 · 楼宇烈', quote: '「文化复兴，从敬畏传统开始。十方殿之善举，令人感佩。」' },
      { name: '知名文化学者 · 楼宇烈', quote: '「文化复兴，从敬畏传统开始。十方殿之善举，令人感佩。」' },
      { name: '知名文化学者 · 楼宇烈', quote: '「文化复兴，从敬畏传统开始。十方殿之善举，令人感佩。」' },
    ],
  },
  // 最新动态。
  news: {
    en: 'Latest News',
    title: '最新动态',
    subtitle: '了解十方殿的最新动态与资讯',
    more: '查看更多',
    items: [
      { title: '大雄宝殿上梁大典圆满举行', desc: '十方殿大雄宝殿修缮工程迎来重要节点——上梁大典，百余位善信共襄盛举。' },
      { title: '清明祈福道会 · 追思超度', desc: '清明时节，十方殿举行为期三天的祈福超度道会，大众可线上参与供奉光明灯。' },
      { title: '明代壁画保护修复工程启动', desc: '十方殿珍藏的明代道教壁画保护修复工程正式启动，预计历时6个月完成。' }
    ],
  },
  // 机构发展时间轴。
  milestones: {
    en: 'Milestones',
    title: '里程碑事件',
    subtitle: '十方殿的发展历程',
    items: [
      { year: '2020', title: '十方殿平台创立', desc: '由多位道教文化保护人士联合发起，致力于宫观文化遗产的数字化保护。' },
      { year: '2022', title: '首个修缮项目落地', desc: '顺利完成首座古建筑大殿的屋顶修缮，平台运营模式验证成功。' },
      { year: '2024', title: '累计善款突破5000万', desc: '累计筹集善款超5000万元，覆盖多个宗教文物保护单位。' },
      { year: '2025', title: '上线云端共筑系统', desc: '全透明资金管理系统上线，捐赠者可随时查看工程进度与资金明细。' },
      { year: '2026', title: '官网全面升级', desc: '全新官网迭代上线，用户体验全面优化，开启文化共建新篇章。' },
    ],
  },
  // 页脚栏目、下载入口及法律信息。
  footer: {
    logo: '十方殿',
    slogan: '十方来聚，共筑华夏精神原乡\n全球华人共建计划',
    exploreTitle: '探索',
    explore: ['文化溯源', '神祇百科', '参拜礼仪', '祈福纳祥', '道会活动'],
    joinTitle: '参与',
    join: ['成为护道人', '云端共筑'],
    aboutTitle: '关于',
    about: ['关于我们', '神殿规划', '使命愿景', '组织架构', '资金监管', '最新动态', '里程碑事件'],
    android: '安卓下载',
    ios: '苹果下载',
    wechat: '客服微信',
    copyright: '© 2026 Shi Fang Religious Association. All rights reserved.',
    links: ['联系我们', '法律须知', '隐私政策', '合规说明'],
    linksText: '联系我们      法律须知      隐私政策      合规说明',
  },
}
