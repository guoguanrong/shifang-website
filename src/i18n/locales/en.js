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
    items: ['About', 'Origins', 'Sacred Statues', 'Etiquette', 'Co-Build', 'Cloud', 'Blessings', 'Events'],
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
    subtitle: 'Gather from all directions to safeguard a thousand-year Taoist lineage',
    quote: 'Bridging Chinese communities worldwide through culture',
    quoteSource: '',
    lead: ['Guarding a Millennium of Taoist Heritage', 'Bridging Chinese communities worldwide through culture'],
    paragraphs: [
      'ShiFang Hall is a physical Taoist religious site and religious nonprofit organization legally registered in the United States. The Internal Revenue Service (IRS) has recognized it as a tax-exempt organization under Section 501(c)(3) of the federal tax code.',
      'Guided by the ideal "Gathering from all directions to safeguard a thousand-year Taoist lineage," we are rooted in a physical Taoist temple and a place for spiritual cultivation. We are dedicated to passing on the Taoist faith and protecting Taoist cultural heritage.',
      'Taoism is the root of Chinese civilization, carrying thousands of years of philosophical wisdom, ways of cultivating health, and spiritual belief. At ShiFang Hall, incense continues to burn and bells and drums ring; Taoist priests cultivate, recite scriptures, conduct liturgies, and teach Taoist traditions here. We also build on our physical sanctuary, using a digital platform to bring ancient Eastern wisdom across time and space to Chinese communities around the world. We believe Taoist culture is not only a historical legacy, but also a guide for contemporary life—offering peace to restless hearts and direction to uncertain lives.',
      'Our work is devoted to promoting Taoist classics through new translations and sharing the millennia-old wisdom of the Daozang, the Tao Te Ching, and the Zhuangzi; protecting Taoist heritage through temple restoration, the restoration and recreation of sacred statues, digitization of ancient texts, and transmission of intangible cultural heritage skills; and building cultural bridges so overseas Chinese can find a spiritual home and the world can better understand Eastern philosophy.',
      'ShiFang Hall is more than a solemn, tranquil religious site; it is a Taoist cultural platform that brings together online and in-person experiences. At our physical temple, we hold traditional rites and activities, including morning and evening services, teachings by Taoist priests, gatherings on the new and full moons, and blessing lantern ceremonies. Digital tools let us share live glimpses of temple activities and cultural content with Chinese communities around the world. We bring Taoist culture into everyday life and help more people experience the wisdom of "the Tao follows nature."',
      'When culture flourishes, the nation prospers; when culture is strong, the people are strong. Together with Taoist devotees and friends from all directions, ShiFang Hall is committed to safeguarding this thousand-year lineage and helping Taoist culture shine even more brightly in the new era.',
    ],
  },
  // 神殿规划卡片。
  templePlan: {
    en: 'Temple Planning',
    title: 'Temple Plan',
    subtitle: 'A millennia-old sanctuary, restored to solemnity',
    cards: [
      { title: 'Hall of Doumu Yuanjun', desc: 'The main hall restoration will enshrine the sacred image of Doumu Yuanjun and attendant deities. The six major works include roof renewal, beam and column reinforcement, painted decoration restoration and gilding of the statues, restoring Doumu’s golden image to majesty and serenity to the sanctuary.' },
      { title: 'Statue Restoration', desc: 'The sacred image of Doumu Yuanjun is hand-carved by a master traditional woodcarver from Fujian, using premium nanmu wood. Standing about 3.6 meters tall, it has four faces and eight arms holding the sun, moon, a seal, bow, arrows and ritual implements. Twelve accompanying statues will also be restored.' },
      { title: 'Mural Gallery', desc: 'The treasured Ming-dynasty Taoist murals stretch about 36 meters, depicting the Taoist pantheon and the ten directions. Restoration includes surface cleaning, color consolidation, repainting of missing areas and moisture-proofing.' },
      { title: 'Garden Landscape', desc: 'Designed in traditional Taoist garden style, the plan includes a clear-water pond, a zigzag bridge, a taiji plaza, seasonal planting and a stele corridor. The taiji plaza accommodates 300 people for outdoor Taoist gatherings.' },
    ],
  },
  // Homepage introduction to ShiFang Hall.
  sxbBox: {
    title: 'A Tile of Goodwill, Hearts Gather from Every Direction',
    paragraphs: [
      'ShiFang Hall is a Taoist religious venue and religious nonprofit organization legally registered in the United States, recognized by the IRS as tax-exempt under Section 501 (c)(3). Guided by our founding belief—“People come from every direction, gather in every direction, and build a Taoist sanctuary together”—we are rooted in a place for spiritual practice, carrying forward Taoist faith and safeguarding Chinese Taoist heritage.',
      'Taoism carries millennia of Chinese philosophy, wellness wisdom, and spiritual heritage. At the sanctuary, priests follow ritual practice, recite scripture, and teach the Tao. We are also building a digital platform so this wisdom can cross oceans, bringing people around the world a place to settle the heart and find direction. We work to translate the classics, restore temples, digitize ancient books, and preserve intangible heritage—bridging East and West and sharing a culture of harmony.',
      'While construction of the ShiFang Hall sanctuary continues, we invite devotees and friends to offer support. You can help build the temple, sponsor a peace lamp, or make an offering to the community, planting good causes and nurturing blessings. With a sincere thought, may wisdom and good fortune grow together, and may every supporter enjoy peace of body and mind, harmony at home, and steady progress. When the halls are complete, lamps will shine here for generations, spreading auspicious light and benefiting all.',
      'When culture flourishes, its heritage lives on. May our shared devotion bring the sanctuary to completion, so we can safeguard the Taoist tradition together and share in its peace.',
    ],
    cta: 'Offer Support, Build ShiFang Together',
  },
  // The homepage section presenting the four Taoist admonitions.
  admonitions: {
    en: 'Taoist Principles',
    title: 'Four Taoist Admonitions',
    subtitle: 'Gather from all directions to safeguard a thousand-year Taoist lineage',
    items: [
      { title: 'Guiding Principles', desc: 'Follow the balance of yin and yang within the Taiji, and uphold the Taoist tradition of serving the world. Revere the Tao and the deities; through lamps, candles, incense and offerings, carry the sincere devotion of believers and spread a pure, compassionate path that benefits all.' },
      { title: 'A Temple for All', desc: 'Embrace the creative power of yin and yang, spread auspicious light and benefit the ten directions. Through ritual offerings, receive the prayers of all people, share traditional Chinese Taoist culture, and pray for peace and blessings everywhere.' },
      { title: 'Harmony and Care', desc: 'Draw on the Taiji ideal of preserving harmony, where yin and yang complement one another and all things flourish. With compassion and shared care, respect cultural differences, encourage coexistence, and connect the ten directions through a peaceful spirit.' },
      { title: 'The Way Connects All', desc: 'The Great Tao knows no borders, and yin and yang are inherently connected. Rooted in Chinese Taoist heritage, we establish a temple and share the Tao in North America, building a bridge for cultural exchange between China and the United States and blessings for all.' },
    ],
  },
  // 使命、愿景与核心价值。
  mission: {
    en: 'Mission & Vision',
    title: 'Mission & Vision',
    subtitle: 'Gather from all directions to safeguard a thousand-year Taoist lineage',
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
      { char: 'Wu', title: '2026 · Bingwu Year', desc: 'The Year of the Horse is a year of Tai Sui. Those born under the Horse meet Tai Sui directly; those born under the Rat clash with it. We suggest offering a Tai Sui Peace Lamp early in the year to resolve conflicts and pass the year in peace.', action: 'Learn How to Resolve' },
      { char: 'Summer', title: 'Midsummer · Cooling the Heart', desc: 'In high summer, heart fire is strong. Keep the mind calm and desires few, avoid heat and seek coolness, eat light fruits and vegetables, and avoid greasy and spicy food. Sit in meditation at noon, walk in the cool of evening. Follow the seasons and pass the summer safely.', action: 'Summer Wellness' },
      { char: 'Exams', title: 'Exam Season · Wenchang', desc: 'The turn from spring to summer is the critical period for entrance and civil service examinations. Offering a Wenchang Wisdom Lamp brings wishes for success in the exams and a smooth career.', action: 'Light the Wenchang Lamp' },
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
      { name: '', tag: 'Career', role: '', quote: 'Last year I offended Tai Sui, so I offered a Tai Sui Peace Lamp at ShiFang Hall early in the year. Six months later a stalled project suddenly turned around and I was promoted to director. Now I offer a lamp every year — prevention beats last-minute panic.' },
      { name: '', tag: 'Studies', role: '', quote: 'When my child was preparing for postgraduate exams I had no peace of mind, so I lit a Wenchang Wisdom Lamp at ShiFang Hall. The Taoist priest even wrote a special petition for my child. Later my child was admitted to their dream school, ranking second in the written exam. Thank you, ShiFang Hall!' },
      { name: '', tag: 'Health', role: '', quote: 'While my father was ill I offered a Medicine King Health Lamp at ShiFang Hall and also contributed to the restoration of the Hall of Doumu Yuanjun. Two months later the doctor said his recovery was far better than expected. I do not know if it was coincidence, but the peace of mind was real.' },
      { name: '', tag: 'Prosperity', role: '', quote: 'Business had been slow last year, so a friend recommended the Zhao Gongming Wealth Lamp at ShiFang Hall. Three months later I had several promising client meetings and business began to improve. Coincidence or not, the confidence and peace of mind were real.' },
      { name: '', tag: 'Safety', role: '', quote: 'My family took turns falling ill and being hospitalized last year, so a friend suggested I obtain a peace talisman at ShiFang Hall. The following six months everyone stayed safe and well. Now I think of visiting the temple on the first day of each month — it puts my heart at ease.' },
      { name: '', tag: 'Family', role: '', quote: 'My parents had been on tense terms, so I offered a blessing tablet for them at ShiFang Hall and donated to the hall restoration. Over the following months the atmosphere at home noticeably eased, and at weekends the family was willing to eat together again. Sincerity works.' },
      { name: '', tag: 'Blessing', role: '', quote: 'My mother has been devoted to the Tao since childhood. I donated green bricks for the restoration of the Hall of Doumu Yuanjun, and the priest inscribed her name on the merit stele. She was delighted for days. Bringing peace of mind to one’s parents is the greatest act of filial devotion.' },
      { name: '', tag: 'Community', role: '', quote: 'After many years abroad, I began joining the new and full moon gatherings at ShiFang Hall online last year. Though overseas, seeing my name in the prayer petitions brings me peace. My company went public last year; I am grateful for the deities’ protection.' },
    ],
  },
  // 各界寄语与分类标签。
  messages: {
    en: 'Messages',
    title: 'Messages from All Walks',
    subtitle: 'Voices and blessings from across society',
    more: 'View more',
    tabs: ['Public Figures', 'Industry Voices', 'Other Benefactors'],
    empty: 'No messages yet',
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
    empty: 'No news yet',
    items: [
      { title: 'Beam-Raising Ceremony of the Hall of Doumu Yuanjun', desc: 'The restoration of the Hall of Doumu Yuanjun reached a key milestone — the beam-raising ceremony, joined by over a hundred devotees.' },
      { title: 'Qingming Blessing Ceremony · Remembrance', desc: 'During Qingming, ShiFang Hall holds a three-day blessing and remembrance ceremony; devotees may offer a Doumu Light Lamp online.' },
      { title: 'Ming Dynasty Mural Restoration Begins', desc: 'Conservation of the treasured Ming-dynasty Taoist murals has officially begun, expected to take six months.' }
    ],
  },
  // 机构发展时间轴。
  homeActivity: {
    en: 'Latest News',
    title: 'Latest News',
    subtitle: 'Voices and blessings from all walks of life',
    tabs: {
      news: 'Hall Updates',
      testimonials: 'Devotee Stories',
      messages: 'Community Voices',
    },
    badges: {
      news: 'Updates',
      testimonials: 'Stories',
      messages: 'Voices',
    },
    more: 'View more',
    loading: 'Loading latest content…',
    empty: 'No content yet',
    openDetail: 'Open: {title}',
  },
  milestones: {
    en: 'Milestones',
    title: 'Temple Thrives, Culture Endures',
    subtitle: 'The journey of ShiFang Hall',
    items: [
      { year: '2025', title: 'ShiFang Hall Platform Founded', desc: 'Initiated by people dedicated to the transmission of Taoist culture, with a mission to digitally preserve temple heritage and launch the Cloud Co-Build system.' },
      { year: '2026', title: 'Website Fully Updated', desc: 'The new website launched, opening a new chapter in cultural collaboration. The transparent fund management system also launched, allowing donors to check project progress and financial details at any time.' },
      { year: 'December 2026', title: 'ShiFang Hall Sanctuary Opens', desc: 'In December 2026, the ShiFang Hall sanctuary was completed and began operations. From the platform’s founding in 2025 and website upgrade in 2026 to the sanctuary opening, ShiFang Hall has grown from a digital platform into a physical sanctuary, bringing online communal practice and an in-person sanctuary together in a dual-track model for cultural collaboration.' },
      { year: '2027', title: 'US$10 Million Fundraising Goal', desc: 'A US$10 million fundraising campaign is planned to help build Doumu Hall, one of the main halls of the first large-scale Taoist temple in the Caribbean.' },
    ],
  },
  // 页脚栏目、下载入口及法律信息。
  footer: {
    logo: 'ShiFang Hall',
    slogan: 'Gathering from all directions to build a spiritual homeland for Chinese worldwide',
    exploreTitle: 'Explore',
    explore: ['Cultural Origins', 'Sacred Statue Guide', 'Worship Etiquette', 'Blessings', 'Taoist Gatherings'],
    joinTitle: 'Participate',
    join: ['Become a Guardian', 'Cloud Co-Creation'],
    aboutTitle: 'About',
    about: ['About Us', 'Temple Planning', 'Mission & Vision', 'Four Taoist Admonitions', 'Latest News', 'Milestones'],
    android: 'Android',
    ios: 'iOS',
    wechat: 'WeChat Support',
    copyright: '© 2026 Shi Fang Religious Association. All rights reserved.',
    links: ['Contact Us', 'Legal Notice', 'Privacy Policy', 'Compliance'],
    linksText: 'Contact Us      Legal Notice      Privacy Policy      Compliance',
  },
}
