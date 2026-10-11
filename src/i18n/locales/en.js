import culture from './culture.en.js'
import deities from './deities.en.js'
import deityDetail from './deity-detail.en.js'
import etiquette from './etiquette.en.js'
import wellness from './wellness.en.js'
import coBuild from './co-build.en.js'
import cloudBuild from './cloud-build.en.js'
import fundDetails from './fund-details.en.js'
import blessings from './blessings.en.js'
import blessingDetails from './blessing-details.en.js'
import offerings from './offerings.en.js'
import lampDetail from './lamp-detail.en.js'
import donation from './donation.en.js'
import events from './events.en.js'
import portal from './portal.en.js'
import accountPages from './account-pages.en.js'
import accountDetails from './account-details.en.js'
import policyPages from './policy-pages.en.js'
import siteTools from './site-tools.en.js'

// 英文全站文案；键名和数组顺序需与中文语言包保持一致。
export default {
  // 文化渊源页使用独立文件维护。
  culture,
  // 神祇百科长列表独立维护，组件结构不依赖具体语言。
  deities,
  deityDetail,
  etiquette,
  // Taoist wellness content is kept in a focused module for easier editorial updates.
  wellness,
  // Co-Build donation content is maintained in its own module.
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
    logo: 'ShiFang Hall',
    items: ['About', 'Origins', 'Deities', 'Etiquette', 'Wellness', 'Co-Build', 'Cloud', 'Blessings', 'Events'],
    lang: 'English',
    login: 'Log In',
  },
  // 首页首屏行动文案。
  hero: {
    badge: 'GLOBAL CHINESE INITIATIVE',
    ctaPrimary: 'Become a Guardian',
    ctaSecondary: 'Explore the Culture',
    scroll: 'Scroll to explore',
  },
  // 关于我们简介与机构说明。
  about: {
    en: 'About Us',
    title: 'About ShiFang Hall',
    subtitle: 'From all directions we gather, together we accomplish all',
    quote: '「The Tao is the sanctuary of all things, the treasure of the good.」',
    quoteSource: '—— Tao Te Ching · Daozang, Dongshen Division',
    lead: ['Guarding a Millennium of Taoist Heritage', 'Bridging Chinese communities worldwide through culture'],
    paragraphs: [
      'ShiFang Hall is a non-profit organization established under Section 501(c)(3) of the United States Internal Revenue Code, operated for charitable, religious and educational purposes. Guided by the principle "From all directions we gather, together we accomplish all," we are dedicated to preserving Taoist cultural heritage and supporting religious public welfare.',
      'Taoism is the root of Chinese civilization, carrying thousands of years of philosophical wisdom, practices of cultivation and spiritual faith. ShiFang Hall takes the transmission of Taoist culture as its mission, using a digital platform to let ancient Eastern wisdom transcend time and space and reach Chinese communities around the world. We believe Taoist culture is not merely a historical legacy, but a guide for contemporary life — offering rest to restless minds and direction to uncertain lives.',
      'Our work focuses on: promoting the Taoist classics — retranslating and sharing millennia of wisdom from the Daozang, the Tao Te Ching and the Zhuangzi; protecting Taoist heritage — temple restoration, digitization of ancient texts, and transmission of intangible craft skills; and building cultural bridges — helping overseas Chinese find their spiritual homeland and letting the world understand Eastern philosophy.',
      'ShiFang Hall is more than a religious site; it is a platform for cultural transmission. Through online scripture teaching, cultural courses, seasonal group practice and blessing lamps, we bring Taoist culture into daily life and let more people experience the living wisdom of "the Tao follows nature."',
      'When culture flourishes, the nation prospers; when culture is strong, the people are strong. ShiFang Hall stands with benefactors from all directions to guard this millennia-old lineage, so that Taoist culture may shine even more brilliantly in the new era.',
    ],
  },
  // 神殿规划卡片。
  templePlan: {
    en: 'Temple Planning',
    title: 'Temple Planning',
    subtitle: 'A millennia-old sanctuary, restored to solemnity',
    cards: [
      { title: 'Hall of Doumu Yuanjun', desc: 'The main hall restoration enshrines the sacred image of Doumu Yuanjun and attendant deities. The six major works include roof renewal, beam and column reinforcement, painted decoration restoration and gilding of the statues, rendering the golden form of Doumu majestic and the sanctuary pure.' },
      { title: 'Statue Restoration', desc: 'The statues of the Three Pure Ones are hand-carved by master traditional woodcarvers from Fujian, using premium nanmu wood and standing about 3.6 meters tall. Twelve accompanying statues, including Doumu Yuanjun and the Jade Emperor, are being recast.' },
      { title: 'Mural Gallery', desc: 'The treasured Ming-dynasty Taoist murals stretch about 36 meters, depicting the Taoist pantheon and the ten directions. Restoration includes surface cleaning, color consolidation, repainting of missing areas and moisture-proofing.' },
      { title: 'Garden Landscape', desc: 'Designed in traditional Taoist garden style, the plan includes a release pond, a zigzag bridge, a taiji plaza, seasonal planting and a stele corridor. The taiji plaza accommodates 300 people for outdoor Taoist gatherings.' },
    ],
  },
  // 使命、愿景与核心价值。
  mission: {
    en: 'Mission & Vision',
    title: 'Mission & Vision',
    subtitle: 'From all directions we gather, together we accomplish all',
    items: [
      { char: 'Tao', title: 'Our Mission', desc: 'To connect benefactors from all directions through digital means, so that every act of goodwill precisely serves the protection and transmission of Taoist cultural heritage.' },
      { char: 'Goodness', title: 'Our Vision', desc: 'To become the most trusted public-interest platform for Taoist culture, with a fully transparent and traceable donation management system.' },
      { char: 'Faith', title: 'Core Values', desc: 'Founded on "integrity, transparency, faith and transmission." Every donation is fully traceable.' },
    ],
  },
  // 组织架构及各层级职责。
  organization: {
    en: 'Organization',
    title: 'Organization & Structure',
    subtitle: 'Professional team, standardized operations, transparent governance',
    items: [
      { level: 'Decision Layer', title: 'Board of Directors', desc: 'Composed of prominent figures from religious, cultural and public-interest circles, responsible for major strategic decisions and direction.' },
      { level: 'Executive Layer', title: 'Secretariat', desc: 'Handles daily operations, project execution and coordination, external relations and partnerships.' },
      { level: 'Supervisory Layer', title: 'Fund Supervision Committee', desc: 'An independent third-party body responsible for auditing, supervising and periodically publishing donation accounts.' },
      { level: 'Advisory Layer', title: 'Expert Advisory Panel', desc: 'Specialists in heritage conservation, religious culture and legal compliance provide professional guidance.' },
      { level: 'Partnership Layer', title: 'Partner Organizations', desc: 'In-depth cooperation with numerous Taoist venues and university research institutions.' },
      { level: 'Volunteer Layer', title: 'Volunteers', desc: 'Over 500 registered volunteers take part in cultural promotion and public-interest activities.' },
    ],
  },
  // 资金监管机制。
  supervision: {
    en: 'Supervision',
    title: 'Fund Supervision',
    subtitle: 'Fully transparent · Traceable · Rigorously audited',
    items: [
      { title: 'Real-Time Cloud Access', desc: 'Detailed spending on restoration works is available online; donors can check progress at any time.' },
      { title: 'Fund Flow Details', desc: 'Every donation received and every expense is assigned a unique code, searchable by project, date and amount.' },
    ],
  },
  // 时令指引卡片。
  seasonal: {
    en: 'Seasonal Guide',
    title: 'Seasonal Guide',
    subtitle: 'Honor heaven and follow the seasons · Prevention is better than cure',
    items: [
      { char: 'Chen', title: '2026 · Bingwu Year', desc: 'The Year of the Horse is a year of Tai Sui. Those born under the Horse meet Tai Sui directly; those born under the Rat clash with it. We suggest offering a Tai Sui lamp early in the year to resolve conflicts and pass the year in peace.', action: 'Learn How to Resolve' },
      { char: 'Summer', title: 'Midsummer · Cooling the Heart', desc: 'In high summer, heart fire is strong. Keep the mind calm and desires few, avoid heat and seek coolness, eat light fruits and vegetables, and avoid greasy and spicy food. Sit in meditation at noon, walk in the cool of evening. Follow the seasons and pass the summer safely.', action: 'Summer Wellness' },
      { char: 'Exams', title: 'Exam Season · Wenchang', desc: 'The turn from spring to summer is the critical period for entrance and civil service examinations. Offering a Wenchang lamp brings wishes for success in the exams and a smooth career.', action: 'Light the Wenchang Lamp' },
      { char: 'Fortune', title: 'Yearly Fortune', desc: 'Learn your zodiac fortune for this year and plan ahead. Those who offend, clash with or are punished by Tai Sui should resolve it as early as possible.', action: 'View Your Fortune' },
    ],
  },
  // 信众案例。
  testimonials: {
    en: 'Testimonials',
    title: 'Voices of the Faithful',
    subtitle: 'Real stories · Wishes fulfilled · Boundless blessing',
    more: 'View more',
    items: [
      { name: 'Chen Minghui', tag: 'Career', role: 'Executive · One-year Tai Sui lamp', quote: 'Last year I offended Tai Sui, so I offered a Tai Sui lamp at ShiFang Hall early in the year. Six months later a stalled project suddenly turned around and I was promoted to director. Now I offer a lamp every year — prevention beats last-minute panic.' },
      { name: 'Chen Minghui', tag: 'Studies', role: 'Executive · One-year Tai Sui lamp', quote: 'When my child was preparing for postgraduate exams I had no peace of mind, so I lit a Wenchang lamp at ShiFang Hall. The Taoist priest even wrote a special petition for my child. Later my child was admitted to their dream school, ranking second in the written exam. Thank you, ShiFang Hall!' },
      { name: 'Chen Minghui', tag: 'Health', role: 'Executive · One-year Tai Sui lamp', quote: 'While my father was ill I donated a Medicine King lamp at ShiFang Hall and also contributed to the main hall restoration. Two months later the doctor said his recovery was far better than expected. I do not know if it was coincidence, but the peace of mind was real.' },
      { name: 'Chen Minghui', tag: 'Prosperity', role: 'Executive · One-year Tai Sui lamp', quote: 'Business had been slow last year, so a friend recommended the Wealth God lamp at ShiFang Hall. Three months later I signed two major clients in a row and revenue doubled. Coincidence or not, the confidence and peace of mind were real.' },
      { name: 'Chen Minghui', tag: 'Safety', role: 'Executive · One-year Tai Sui lamp', quote: 'My family took turns falling ill and being hospitalized last year, so a friend suggested I obtain a peace talisman at ShiFang Hall. The following six months everyone stayed safe and well. Now I think of visiting the temple on the first day of each month — it puts my heart at ease.' },
      { name: 'Chen Minghui', tag: 'Career', role: 'Executive · One-year Tai Sui lamp', quote: 'My parents had been on tense terms, so I offered a blessing tablet for them at ShiFang Hall and donated to the hall restoration. Over the following months the atmosphere at home noticeably eased, and at weekends the family was willing to eat together again. Sincerity works.' },
      { name: 'Chen Minghui', tag: 'Blessing', role: 'Executive · One-year Tai Sui lamp', quote: 'Business had been slow last year, so a friend recommended the Wealth God lamp at ShiFang Hall. Three months later I signed two major clients in a row and revenue doubled. Coincidence or not, the confidence and peace of mind were real.' },
      { name: 'Chen Minghui', tag: 'Career', role: 'Executive · One-year Tai Sui lamp', quote: 'My family took turns falling ill and being hospitalized last year, so a friend suggested I obtain a peace talisman at ShiFang Hall. The following six months everyone stayed safe and well. Now I think of visiting the temple on the first day of each month — it puts my heart at ease.' },
    ],
  },
  // 各界寄语与分类标签。
  messages: {
    en: 'Messages',
    title: 'Messages from All Walks',
    subtitle: 'Voices and blessings from across society',
    more: 'View more',
    tabs: ['Public Figures', 'Industry Voices', 'Other Benefactors'],
    items: [
      { name: 'Renowned Cultural Scholar · Lou Yulie', quote: '「Cultural revival begins with reverence for tradition. The good work of ShiFang Hall is deeply admirable.」' },
      { name: 'Renowned Cultural Scholar · Lou Yulie', quote: '「Cultural revival begins with reverence for tradition. The good work of ShiFang Hall is deeply admirable.」' },
      { name: 'Renowned Cultural Scholar · Lou Yulie', quote: '「Cultural revival begins with reverence for tradition. The good work of ShiFang Hall is deeply admirable.」' },
    ],
  },
  // 最新动态。
  news: {
    en: 'Latest News',
    title: 'Latest News',
    subtitle: 'Stay up to date with ShiFang Hall',
    more: 'View more',
    items: [
      { title: 'Beam-Raising Ceremony of the Mahavira Hall', desc: 'The restoration of the Mahavira Hall reached a key milestone — the beam-raising ceremony, joined by over a hundred devotees.' },
      { title: 'Qingming Blessing Ceremony · Remembrance', desc: 'During Qingming, ShiFang Hall holds a three-day blessing and remembrance ceremony; devotees may offer a light lamp online.' },
      { title: 'Ming Dynasty Mural Restoration Begins', desc: 'Conservation of the treasured Ming-dynasty Taoist murals has officially begun, expected to take six months.' }
    ],
  },
  // 机构发展时间轴。
  milestones: {
    en: 'Milestones',
    title: 'Milestones',
    subtitle: 'The journey of ShiFang Hall',
    items: [
      { year: '2020', title: 'Platform Founded', desc: 'Jointly initiated by several Taoist cultural preservation advocates, dedicated to the digital preservation of temple heritage.' },
      { year: '2022', title: 'First Restoration Project', desc: 'Completed the roof restoration of the first ancient main hall, validating the platform operating model.' },
      { year: '2024', title: 'Donations Pass 50 Million', desc: 'Cumulative donations exceeded 50 million yuan, covering multiple religious heritage protection sites.' },
      { year: '2025', title: 'Cloud Co-Creation System', desc: 'The fully transparent fund management system went live; donors can check project progress and fund details at any time.' },
      { year: '2026', title: 'Website Fully Upgraded', desc: 'The new website launched with a fully optimized user experience, opening a new chapter of cultural co-creation.' },
    ],
  },
  // 页脚栏目、下载入口及法律信息。
  footer: {
    logo: 'ShiFang Hall',
    slogan: 'Gathering from all directions to build a spiritual homeland for Chinese worldwide',
    exploreTitle: 'Explore',
    explore: ['Cultural Origins', 'Deity Encyclopedia', 'Worship Etiquette', 'Blessings', 'Taoist Gatherings'],
    joinTitle: 'Participate',
    join: ['Become a Guardian', 'Cloud Co-Creation'],
    aboutTitle: 'About',
    about: ['About Us', 'Temple Planning', 'Mission & Vision', 'Organization', 'Fund Supervision', 'Latest News', 'Milestones'],
    android: 'Android',
    ios: 'iOS',
    wechat: 'WeChat Support',
    copyright: '© 2026 Shi Fang Religious Association. All rights reserved.',
    links: ['Contact Us', 'Legal Notice', 'Privacy Policy', 'Compliance'],
    linksText: 'Contact Us      Legal Notice      Privacy Policy      Compliance',
  },
}
