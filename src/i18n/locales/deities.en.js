// English copy keeps the same data contract as the Chinese packs so components stay locale-agnostic.
export default {
  hero: {
    eyebrow: 'Deities & Immortals',
    title: 'Deity Encyclopedia',
    subtitle: 'Discover each deity’s origin and role, and understand the wish you seek.',
    quote: '“Spirit has no fixed direction, and change no fixed form; yin and yang constitute the Way.”',
    quoteSource: '— The Book of Changes · Great Treatise',
  },
  filtersLabel: 'Filter deities by blessing',
  filters: ['All', 'Career', 'Study', 'Peace', 'Wealth', 'Health'],
  meritLabel: 'Blessing',
  actions: { light: 'Light a Lamp', offer: 'Make an Offering' },
  monthlyPrice: 'Monthly',
  yearlyPrice: 'Annual',
  worshipUnavailable: 'Offering is not available yet',
  lightUnavailable: 'Online lamp lighting is not configured for this deity.',
  lightLookupFailed: 'Could not load the lamp configuration. Please try again.',
  lightUnknownDeity: 'This deity could not be matched to a lamp configuration.',
  empty: 'No deity profiles are available in this category.',
  backToTop: 'Back to top',
  featured: {
    id: 'doumu', categories: ['health', 'peace'], title: 'Doumu Yuanjun', subtitle: 'Mother of the Northern Dipper · Relief and Longevity',
    tags: ['Relief', 'Longevity', 'Protection'],
    description: 'Doumu Yuanjun, also called Doulao and the Primordial Sovereign of the Central Heaven, is the mother of the stars of the Northern Dipper and one of Taoism’s foremost goddesses. Born from primordial qi, she brought forth the Nine Sovereigns of the Northern Dipper, the Six Governors of the Southern Dipper, and the celestial constellations, governing lifespan, fortune, and adversity.',
    meta: [{ label: 'Origin', value: 'Born of primordial qi' }, { label: 'Festival', value: '9th day, 9th lunar month' }],
    meritTitle: 'Relief · Longevity · Protection', meritDescription: 'For those seeking health, smoother fortune, and safety in difficult years.',
  },
  cards: [
    {
      id: 'beidou', categories: ['health', 'peace'], title: 'Nine Sovereigns of Beidou', subtitle: 'Seven Dipper Stars and Two Assistants · Masters of Lifespan', tags: ['Relief', 'Longevity', 'Protection'],
      description: 'The Nine Sovereigns comprise the seven stars of the Northern Dipper together with the Fu and Bi assistant stars. This central Taoist star cult teaches that the Northern Dipper governs death and the Southern Dipper life; Dipper rites seek relief, longevity, and release from hardship.',
      meta: ['Festival: lunar Sep 1–9', 'Beidou governs destiny'], meritTitle: 'Relief from Hardship · Longer Life', meritDescription: 'For low fortune, longevity prayers, and resolving adversity.',
    },
    {
      id: 'taisui', categories: ['career', 'peace'], title: 'Sixty Taisui Generals', subtitle: 'Annual Guardians · Governors of the Year', tags: ['Year', 'Fortune', 'Harmony'],
      description: 'The sixty Taisui are annual Taoist guardians arranged by the sixty-year stem-and-branch cycle. One presides each year over worldly fortune and adversity. Those whose zodiac conflicts with the year traditionally seek harmony early.',
      meta: ['One guardian each year', 'Seek harmony early'], meritTitle: 'Resolve Conflict · A Smoother Year', meritDescription: 'For birth-year or zodiac conflicts with the annual Taisui.',
    },
    {
      id: 'sanguan', categories: ['peace', 'health'], title: 'Three Officials', subtitle: 'Heaven, Earth, and Water · Blessing, Pardon, and Relief', tags: ['Blessing', 'Pardon', 'Relief'],
      description: 'The Three Officials are early Taoist deities rooted in reverence for heaven, earth, and water. Heaven grants blessings at Shangyuan, Earth pardons at Zhongyuan, and Water relieves adversity at Xiayuan.',
      meta: ['Heaven · Earth · Water', 'Three Yuan festivals'], meritTitle: 'Blessing · Pardon · Relief', meritDescription: 'For clearing adversity, welcoming blessings, and overall protection.',
    },
    {
      id: 'wenchang', categories: ['study', 'career'], title: 'Wenchang Dijun', subtitle: 'Lord of Learning · Achievement and Office', tags: ['Study', 'Exams', 'Career'],
      description: 'Wenchang Dijun governs learning, examination success, reputation, and official advancement. Associated with an assistant star of the Northern Dipper, he is especially revered by students and those seeking promotion.',
      meta: ['Festival: lunar Feb 3', 'Exams and promotion'], meritTitle: 'Academic Progress · Career Success', meritDescription: 'For students, candidates, promotion, and scholarly achievement.',
    },
    {
      id: 'kuixing', categories: ['study', 'career'], title: 'Kuixing Dijun', subtitle: 'The Dipper’s Brush · Examination Success', tags: ['Exams', 'Writing', 'Success'],
      description: 'Kuixing Dijun is a Taoist patron of examinations, traditionally linked with the first star of the Northern Dipper. He is shown red-haired and blue-faced, holding a dipper and brush while standing upon the mythical ao.',
      meta: ['Festival: lunar Jul 7', 'First on the honours list'], meritTitle: 'Brilliant Writing · Highest Honours', meritDescription: 'For examinations, interviews, competition, and advancement.',
    },
    {
      id: 'zhaogongming', categories: ['wealth', 'career'], title: 'Marshal Zhao of Xuantan', subtitle: 'God of Wealth · Prosperity from Five Directions', tags: ['Wealth', 'Business', 'Prosperity'],
      description: 'Marshal Zhao Gongming is the principal Taoist God of Wealth. Together with four attendant wealth deities, he forms the Gods of Wealth of the Five Directions. He is portrayed dark-faced, riding a black tiger and wielding an iron whip.',
      meta: ['Festival: lunar Mar 15', 'Chief God of Wealth'], meritTitle: 'Prosperity · Thriving Business', meritDescription: 'For commerce, investment, income, and professional advancement.',
    },
    {
      id: 'wanglingguan', categories: ['peace', 'health'], title: 'Wang Lingguan', subtitle: 'Temple Guardian · Protector of the Gate', tags: ['Guarding', 'Purifying', 'Safety'],
      description: 'Wang Lingguan is the foremost of the five hundred Taoist spirit officers and guardian of ritual grounds. Red-faced and gold-armoured with a steel whip, he protects temple gates and is traditionally greeted first upon entering.',
      meta: ['Festival: lunar Jun 23', 'Chief of 500 guardians'], meritTitle: 'Personal Safety · Upright Protection', meritDescription: 'For safe travel, spiritual protection, and guarding the home.',
    },
    {
      id: 'guansheng', categories: ['wealth', 'career', 'peace'], title: 'Guan Sheng Dijun', subtitle: 'Martial God of Wealth · Saint of Loyalty', tags: ['Wealth', 'Career', 'Loyalty'],
      description: 'Guan Sheng Dijun is Guan Yu of the Three Kingdoms, revered for loyalty, courage, protection, and wealth. As both guardian and Martial God of Wealth, he is invoked for business, career, relationships, and protection from malice.',
      meta: ['Festival: lunar Jun 24', 'Honoured by three teachings'], meritTitle: 'Career Success · Protection from Malice', meritDescription: 'For commerce, employment, steady careers, and loyal relationships.',
    },
    {
      id: 'dongyue', categories: ['health', 'peace'], title: 'Dongyue Dadi', subtitle: 'Lord of Mount Tai · Governor of Life and Death', tags: ['Life', 'Rebirth', 'Judgment'],
      description: 'Dongyue Dadi is the deity of Mount Tai, chief of the Five Sacred Peaks. He governs human lifespan and rank as well as judgment in the underworld, continuing the ancient worship of Mount Tai.',
      meta: ['Festival: lunar Mar 28', 'Governor of the underworld'], meritTitle: 'Longevity · Ancestral Blessing', meritDescription: 'For elders’ longevity, remembrance of ancestors, and spiritual peace.',
    },
    {
      id: 'leizun', categories: ['peace', 'career'], title: 'Celestial Worthy of Universal Transformation', subtitle: 'Ancestor of Thunder · Divine Justice', tags: ['Justice', 'Uprightness', 'Protection'],
      description: 'The Celestial Worthy of Universal Transformation is the highest deity of the Thunder Department. Also called the Thunder Ancestor, he commands thunder’s justice and the upright qi of heaven and earth, leading its divine generals.',
      meta: ['Festival: lunar Jun 24', 'Might of thunder'], meritTitle: 'Upright Protection · Repel Harm', meritDescription: 'For justice, removal of harmful influences, and home protection.',
    },
    {
      id: 'fanli', categories: ['wealth', 'career'], title: 'Fan Li, Civil God of Wealth', subtitle: 'Master Taozhu · The Way of Prosperity', tags: ['Wealth', 'Trade', 'Prosperity'],
      description: 'Fan Li was a statesman of Yue in the late Spring and Autumn period. After helping King Goujian defeat Wu, he retired and became a successful merchant, earning the name Master Taozhu. Revered as a Civil God of Wealth, he represents ethical commerce and generous prosperity.',
      meta: ['Wealth festival: lunar Jul 22', 'Legacy of Taozhu'], meritTitle: 'Attract Prosperity · Thriving Business', meritDescription: 'For commerce, property, investment, and responsible wealth.',
    },
    {
      id: 'tudigong', categories: ['peace', 'wealth'], title: 'Fude Zhengshen', subtitle: 'Lord of the Land · Local Guardian', tags: ['Peace', 'Wealth', 'Home'],
      description: 'Fude Zhengshen, affectionately known as Tudigong, is the Taoist guardian of local land. He protects communities, homes, harvests, and livelihoods, and is among the deities closest to everyday family life.',
      meta: ['Festival: lunar Feb 2', 'Enduring virtue'], meritTitle: 'A Peaceful Home · Abundant Harvest', meritDescription: 'For home security, good harvests, stable land, and business.',
    },
  ],
}
