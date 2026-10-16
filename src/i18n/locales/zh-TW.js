import culture from './culture.zh-TW.js'
import deities from './deities.zh-TW.js'
import deityDetail from './deity-detail.zh-TW.js'
import etiquette from './etiquette.zh-TW.js'
import wellness from './wellness.zh-TW.js'
import coBuild from './co-build.zh-TW.js'
import cloudBuild from './cloud-build.zh-TW.js'
import fundDetails from './fund-details.zh-TW.js'
import blessings from './blessings.zh-TW.js'
import blessingDetails from './blessing-details.zh-TW.js'
import offerings from './offerings.zh-TW.js'
import lampDetail from './lamp-detail.zh-TW.js'
import donation from './donation.zh-TW.js'
import events from './events.zh-TW.js'
import portal from './portal.zh-TW.js'
import accountPages from './account-pages.zh-TW.js'
import accountDetails from './account-details.zh-TW.js'
import policyPages from './policy-pages.zh-TW.js'
import siteTools from './site-tools.zh-TW.js'

// 繁体中文全站文案；键名必须与简体中文和英文语言包保持一致。
export default {
  // 文化渊源页使用独立文件维护。
  culture,
  // 神祇百科長列表獨立維護。
  deities,
  deityDetail,
  // 參拜禮儀頁按完整儀軌獨立維護。
  etiquette,
  // 道法養生頁的長列表與卡片內容獨立維護。
  wellness,
  // 共建十方頁內容獨立維護。
  coBuild,
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
    items: ['關於我們', '文化溯源', '神祇百科', '參拜禮儀', '道法養生', '共建十方', '雲端共築', '祈福納祥', '道會活動'],
    lang: '繁體中文',
    login: '登入',
  },
  // 首页首屏行动文案。
  hero: {
    badge: 'GLOBAL CHINESE INITIATIVE',
    ctaPrimary: '成為護道人',
    ctaSecondary: '探索文化',
    scroll: '向下探索',
  },
  // 关于我们简介与机构说明。
  about: {
    en: 'About Us',
    title: '關於十方殿',
    subtitle: '十方來，十方聚，共護千年道脈',
    quote: '以文化為橋，連接全球華人',
    quoteSource: '',
    lead: ['守護千年道脈', '以文化為橋，連接全球華人'],
    paragraphs: [
      '十方殿（ShiFang Hall）是美國依法註冊的實體道教宗教場所與宗教非營利組織，並已獲得美國國稅局（IRS）認可的 501(c)(3) 聯邦免稅資格。',
      '我們以「十方來，十方聚，共護千年道脈」為理念，以實體道觀與清修道場為根基，致力於道教信仰傳承與道教文化遺產保護。',
      '道教是中華文明的根脈，承載著數千年的哲學智慧、養生之道與精神信仰。十方殿道場香火相續、鐘鼓常鳴，道長們在此清修、誦經、行科演教。同時，我們以實體道場為依託，透過數位化平台讓古老的東方智慧跨越時空，觸及全球華人。我們相信，道文化不僅是歷史的遺產，更是當代生活的指南——為浮躁的心靈提供安頓，為迷茫的人生指引方向。',
      '我們致力於：弘揚道教經典——《道藏》《道德經》《莊子》等千年智慧的重譯與傳播；保護道教遺產——宮觀修繕、神像重塑、古籍數位化、非遺技藝傳承；搭建文化橋梁——讓海外華人找到精神原鄉，讓世界了解東方哲學。',
      '十方殿不僅是莊嚴清靜的宗教場所，更是一個線上與線下相融合的道教文化傳播平台。我們在實體道觀中依科舉行早晚功課、道長講經、朔望道會、祈福點燈等傳統科儀與活動，並借助數位化手段將這些道場實況與文化內容傳遞給全球華人。讓道文化融入日常生活，讓更多人感受到「道法自然」的生活智慧。',
      '文化興則國運興，文化強則民族強。十方殿願與十方善信一起，守護這份千年道脈，讓道教文化在新時代煥發出更加璀璨的光芒。',
    ],
  },
  // 神殿规划卡片。
  templePlan: {
    en: 'Temple Planning',
    title: '神殿規劃',
    subtitle: '千年道場，重現莊嚴',
    cards: [
      { title: '斗姆元君大殿', desc: '主殿修繕工程，供奉斗姆元君聖像及諸神像。修繕內容包括屋頂翻新、梁柱加固、彩繪復原、神像貼金等六大工程，令斗姆金身莊嚴、道場清靜。' },
      { title: '神像重塑', desc: '斗姆元君聖像由福建傳統木雕工藝大師親手雕刻，選用上等楠木，高約3.6米，四面八臂、持日月寶印弓箭諸法器，威儀莊嚴。同時重塑配祀神像共12尊。' },
      { title: '壁畫長廊', desc: '珍藏明代道教壁畫全長約36米，描繪道教神仙體系與十方世界。修復工程包括畫面清理、色彩加固、缺失補繪及防潮處理。' },
      { title: '園林景觀', desc: '傳統道教園林風格設計，規劃碧水池、九曲橋、太極廣場、四季花木與碑廊。太極廣場可容納300人參與戶外道會。' },
    ],
  },
  // 使命、愿景与核心价值。
  mission: {
    en: 'Mission & Vision',
    title: '使命與願景',
    subtitle: '十方來，十方聚，共護千年道脈',
    items: [
      { char: '道', title: '我們的使命', desc: '以數位化方式連接十方善緣，讓每一份善心都能精準服務於道教文化遺產的保護與傳承。' },
      { char: '善', title: '我們的願景', desc: '成為最具公信力的道教文化公益平臺，建立全透明、可追溯的善款管理體系。' },
      { char: '信', title: '核心價值', desc: '以「誠信、透明、信仰、傳承」為立身之本。每一分善款去向清晰可查。' },
    ],
  },
  // 组织架构及各层级职责。
  organization: {
    en: 'Organization',
    title: '組織與架構',
    subtitle: '專業團隊，規範運營，透明治理',
    items: [
      { level: '決策層', title: '理事會', desc: '由宗教文化界、公益界知名人士組成，負責平臺重大戰略決策與方向把控。' },
      { level: '執行層', title: '秘書處', desc: '日常運營管理、項目執行與協調、對外聯絡與合作事務。' },
      { level: '監督層', title: '資金監管委員會', desc: '獨立第三方機構，負責善款的審計、監督與定期公示。' },
      { level: '顧問層', title: '專家顧問團', desc: '文物保護、宗教文化、法律合規等領域專家提供專業指導意見。' },
      { level: '協作層', title: '合作單位', desc: '與多家道教活動場所、高校研究機構建立深度合作。' },
      { level: '志願層', title: '善緣志願者', desc: '超過500名註冊志願者參與文化推廣與公益活動組織。' },
    ],
  },
  // 资金监管机制。
  supervision: {
    en: 'Supervision',
    title: '資金監管',
    subtitle: '全透明 · 可追溯 · 嚴審計',
    items: [
      { title: '雲端即時查看', desc: '修繕工程資金使用明細在線可查，善捐者可隨時瞭解進度。' },
      { title: '資金流向明細', desc: '每一筆善款收入與支出均生成獨立編碼，支持按項目、時間、金額篩選查詢。' },
    ],
  },
  // 时令指引卡片。
  seasonal: {
    en: 'Seasonal Guide',
    title: '時令指引',
    subtitle: '敬天順時，趨吉避凶 · 預防大於治療',
    items: [
      { char: '辰', title: '2026 · 丙午年', desc: '馬年值太歲，屬馬者值太歲，屬鼠者沖太歲。建議年初供奉太歲祈安燈，化解沖煞，安度流年。', action: '了解化解方式' },
      { char: '夏', title: '盛夏 · 避暑養心', desc: '盛夏當令，心火旺盛。此時宜清心寡欲、避暑納涼，多食清淡疏果，少食油膩辛辣。午時靜坐養神，酉時散步納涼。順應天時，平安度夏。', action: '查看夏季養生' },
      { char: '考', title: '考試季 · 文昌', desc: '每年春夏之交為中高考、公考關鍵期。供奉文昌啟智燈，祈願金榜題名、仕途通達。', action: '點亮文昌燈' },
      { char: '運', title: '流年運勢', desc: '瞭解您今年的生肖運勢，提前佈局。犯太歲、沖太歲、刑太歲者應儘早化解。', action: '查看運勢' },
    ],
  },
  // 信众案例。
  testimonials: {
    en: 'Testimonials',
    title: '信眾實錄',
    subtitle: '真實案例 · 善願得償 · 福生無量',
    more: '查看更多',
    items: [
      { name: '', tag: '事業', role: '', quote: '去年犯太歲，年初在十方殿供了太歲祈安燈。半年後原本停滯的項目突然有了轉機，順利升了總監。現在每年都會來供燈，預防總比到時候著急好。' },
      { name: '', tag: '學業', role: '', quote: '孩子考研那年心裡沒底，在十方殿點了文昌啟智燈。道長還專門為孩子做了疏文祈福。後來孩子以筆試第二的成績考上了理想學校。感恩十方殿！' },
      { name: '', tag: '健康', role: '', quote: '父親生病期間在十方殿捐了藥王康寧燈，也參與了斗姆元君大殿修繕。兩個月後複查醫生說恢復得比預期好很多。我不知道是不是巧合，但心裡的安定是實實在在的。' },
      { name: '', tag: '財運', role: '', quote: '去年生意一直不見起色，朋友推薦到十方殿供奉了玄壇趙元帥威靈燈。三個月後陸續談成幾位客戶，生意漸有起色。不管是不是巧合，這份信心和安定是實實在在的。' },
      { name: '', tag: '平安', role: '', quote: '去年家裡人輪流生病住院，朋友建議我到十方殿請了一道平安符。之後半年全家人都平平安安的。現在每個月初一都想著去道觀看看，心裡踏實。' },
      { name: '', tag: '事業', role: '', quote: '父母關係一直緊張，我在十方殿為他們供了祈福牌位，捐資修繕大殿。幾個月下來，明顯感覺家裡的氣氛緩和了許多，週末一家人也願意一起吃飯了。心誠則靈。' },
      { name: '', tag: '祈福', role: '', quote: '母親從小心誠向道，我幫她在斗姆元君大殿修繕時善捐了青磚，道長將母親的名字寫入了功德碑。老人家高興了好幾天，說這輩子沒白活。能讓父母安心，就是最大的孝順。' },
      { name: '', tag: '共修', role: '', quote: '在海外漂泊多年，去年開始在十方殿線上參與朔望共修。雖然身在異國，但每次道會疏文上都有我的名字，心裡特別踏實。去年公司順利上市，感恩神明護佑。' },
    ],
  },
  // 各界寄语与分类标签。
  messages: {
    en: 'Messages',
    title: '各界寄語',
    subtitle: '來自社會各界的聲音與祝福',
    more: '查看更多',
    tabs: ['知名人士', '業內人士', '其他善信人士'],
    empty: '暫無寄語',
    items: [
      { name: '知名文化學者 · 樓宇烈', quote: '「文化復興，從敬畏傳統開始。十方殿之善舉，令人感佩。」' },
      { name: '知名文化學者 · 樓宇烈', quote: '「文化復興，從敬畏傳統開始。十方殿之善舉，令人感佩。」' },
      { name: '知名文化學者 · 樓宇烈', quote: '「文化復興，從敬畏傳統開始。十方殿之善舉，令人感佩。」' },
    ],
  },
  // 最新动态。
  news: {
    en: 'Latest News',
    title: '最新動態',
    subtitle: '瞭解十方殿的最新動態與資訊',
    more: '查看更多',
    empty: '暫無動態',
    items: [
      { title: '斗姆元君大殿上樑大典圓滿舉行', desc: '十方殿斗姆元君大殿修繕工程迎來重要節點——上樑大典，百餘位善信共襄盛舉。' },
      { title: '清明祈福道會 · 追思超度', desc: '清明時節，十方殿舉行為期三天的祈福超度道會，大眾可線上參與供奉斗姆光明燈。' },
      { title: '明代壁畫保護修復工程啟動', desc: '十方殿珍藏的明代道教壁畫保護修復工程正式啟動，預計歷時6個月完成。' }
    ],
  },
  // 机构发展时间轴。
  milestones: {
    en: 'Milestones',
    title: '里程碑事件',
    subtitle: '十方殿的發展歷程',
    items: [
      { year: '2025年', title: '十方殿平台創立', desc: '由多位道教傳承人士聯合發起，致力於宮觀文化遺產的數位化傳承並上線雲端共築系統。' },
      { year: '2026年', title: '官網全面升級', desc: '全新官網迭代上線，開啟文化共建新篇章。全透明資金管理系統上線，捐贈者可隨時查看工程進度與資金明細。' },
      { year: '2026年12月', title: '十方殿道場落成啟用', desc: '2026年12月，十方殿道場正式落成並投入營運。自2025年平台創立、2026年官網升級，到今日道場落成，十方殿完成從數位平台到實體道場的跨越，形成「線上共修+線下道場」雙軌並行的文化共建格局。' },
      { year: '2027年', title: '計劃籌募善款1000萬', desc: '計劃籌募善款1000萬美金，用於籌建加勒比內首個大型道觀的主殿之一，斗姆殿。' },
    ],
  },
  // 页脚栏目、下载入口及法律信息。
  footer: {
    logo: '十方殿',
    slogan: '十方來聚，共築華夏精神原鄉\n全球華人共建計畫',
    exploreTitle: '探索',
    explore: ['文化溯源', '神祇百科', '參拜禮儀', '祈福納祥', '道會活動'],
    joinTitle: '參與',
    join: ['成為護道人', '雲端共築'],
    aboutTitle: '關於',
    about: ['關於我們', '神殿規劃', '使命願景', '組織架構', '最新動態', '里程碑事件'],
    android: '安卓下載',
    ios: '蘋果下載',
    wechat: '客服微信',
    copyright: '© 2026 Shi Fang Religious Association. All rights reserved.',
    links: ['聯繫我們', '法律須知', '隱私政策', '合規說明'],
    linksText: '聯繫我們      法律須知      隱私政策      合規說明',
  },
}
