// English copy keeps the same data contract as the Chinese packs so components stay locale-agnostic.
export default {
  hero: {
    eyebrow: 'Deities & Immortals',
    title: 'Sacred Statue Guide',
    subtitle: 'Discover each deity’s origin and role, and understand the wish you seek.',
    quote: '“Spirit has no fixed direction, and change no fixed form; yin and yang constitute the Way.”',
    quoteSource: '— The Book of Changes · Great Treatise',
  },
  filtersLabel: 'Filter deities by blessing',
  filters: ['All', 'Wealth', 'Career', 'Health', 'Study', 'Peace'],
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
      id: 'fanli', categories: ['wealth', 'career'], title: 'Fan Li, Civil God of Wealth', subtitle: 'Master Taozhu · The Way of Prosperity', tags: ['Wealth', 'Trade', 'Prosperity'],
      description: 'Fan Li, styled Shaobo, was a minister of Yue in the late Spring and Autumn period. After helping King Goujian conquer Wu, he withdrew at the height of success, roaming the Five Lakes under the name Chiyi Zipi. Settling in Tao as a merchant, he amassed a thousand gold three times and dispersed it three times, earning the title “Master Taozhu” and later reverence as the Civil God of Wealth — the model of “prosperity with virtue, gathering and dispersing with the Way.”',
      meta: ['Wealth festival: lunar Jul 22', 'Legacy of Taozhu'], meritTitle: 'Attract Prosperity · Thriving Business', meritDescription: 'For commerce, property, investment, and responsible wealth.',
    },
    {
      id: 'zhaogongming', categories: ['wealth', 'career'], title: 'Marshal Zhao of Xuantan', subtitle: 'God of Wealth · Prosperity from Five Directions', tags: ['Wealth', 'Business', 'Prosperity'],
      description: 'Marshal Zhao Gongming is the principal Taoist God of Wealth. Together with four attendant wealth deities, he forms the Gods of Wealth of the Five Directions. He is portrayed dark-faced, riding a black tiger and wielding an iron whip.',
      meta: ['Festival: lunar Mar 15', 'Chief God of Wealth'], meritTitle: 'Prosperity · Thriving Business', meritDescription: 'For commerce, investment, income, and professional advancement.',
    },
    {
      id: 'tudigong', categories: ['peace', 'wealth'], title: 'Fude Zhengshen', subtitle: 'Lord of the Land · Local Guardian', tags: ['Peace', 'Wealth', 'Home'],
      description: 'Fude Zhengshen — the Earth Grandfather (Tudigong) of common speech — is revered in Taoism as the god of one locality, guarding its peace and blessing the community with abundant harvests and settled lives. The nearest and dearest deity to the people, hence the saying “the Earth God at every field’s end.”',
      meta: ['Festival: lunar Feb 2', 'Enduring virtue'], meritTitle: 'A Peaceful Home · Abundant Harvest', meritDescription: 'For home security, good harvests, stable land, and business.',
    },
    {
      id: 'wenchang', categories: ['study', 'career'], title: 'Wenchang Dijun', subtitle: 'Lord of Literary Fortune · Fame and Rank', tags: ['Study', 'Exams', 'Career'],
      description: 'Wenchang Dijun governs learning, examination success, reputation, and official advancement. Associated with an assistant star of the Northern Dipper, he is especially revered by students and those seeking promotion.',
      meta: ['Festival: lunar Feb 3', 'Exams and promotion'], meritTitle: 'Academic Progress · Career Success', meritDescription: 'For students, candidates, promotion, and scholarly achievement.',
    },
    {
      id: 'guansheng', categories: ['wealth', 'career', 'peace'], title: 'Guan Sheng Dijun', subtitle: 'Martial God of Wealth · Saint of Loyalty', tags: ['Wealth', 'Career', 'Loyalty'],
      description: 'Guan Sheng Dijun is Guan Yu of the Three Kingdoms, revered for loyalty, courage, protection, and wealth. As both guardian and Martial God of Wealth, he is invoked for business, career, relationships, and protection from malice.',
      meta: ['Festival: lunar Jun 24', 'Honoured by the Taoist tradition'], meritTitle: 'Career Success · Protection from Malice', meritDescription: 'For commerce, employment, steady careers, and loyal relationships.',
    },
    {
      id: 'wanglingguan', categories: ['peace', 'health'], title: 'Wang Lingguan', subtitle: 'Temple Guardian · Protector of the Gate', tags: ['Guarding', 'Purifying', 'Safety'],
      description: 'Wang Lingguan is the foremost of the five hundred Taoist spirit officers and guardian of ritual grounds. Red-faced and bearded, gold-armoured with a steel whip, he protects temple gates and is traditionally greeted first upon entering.',
      meta: ['Festival: lunar Jun 23', 'Chief of 500 guardians'], meritTitle: 'Personal Safety · Upright Protection', meritDescription: 'For safe travel, spiritual protection, and guarding the home.',
    },
    {
      id: 'leizun', categories: ['peace', 'career'], title: 'Celestial Worthy of Universal Transformation', subtitle: 'Thunder Ancestor · Wielder of Divine Punishment', tags: ['Justice', 'Uprightness', 'Protection'],
      description: 'The Celestial Worthy of Universal Transformation is the highest deity of the Thunder Department. Also called the Thunder Ancestor, he commands thunder’s punishment and the upright qi of heaven and earth, leading its divine generals.',
      meta: ['Festival: lunar Jun 24', 'Might of thunder'], meritTitle: 'Upright Protection · Repel Harm', meritDescription: 'For justice, removal of harmful influences, and home protection.',
    },
    {
      id: 'dongyue', categories: ['health', 'peace'], title: 'Dongyue Dadi', subtitle: 'Lord of Mount Tai · Governor of Life and Death', tags: ['Life', 'Underworld', 'Good and Evil'],
      description: 'Dongyue Dadi is the deity of Mount Tai, chief of the Five Sacred Peaks. He governs human lifespan and rank as well as judgment in the underworld, continuing the ancient worship of Mount Tai.',
      meta: ['Festival: lunar Mar 28', 'Governor of the underworld'], meritTitle: 'Longevity · Ancestral Blessing', meritDescription: 'For elders’ longevity, remembrance of ancestors, and spiritual peace.',
    },
    {
      id: 'foxian', categories: ['peace'], title: 'Fox Immortal', subtitle: 'Guardian Deity · Keeper of the Sacred Grounds', tags: ['Guarding', 'Warding', 'Dharma'],
      description: 'The Fox Immortal is a guardian deity in the Taoist pantheon. Enfeoffed and ordained by the Taoist tradition, she keeps the true path and guards sacred grounds, preserving the peace and purity of a place rather than granting worldly wishes. Many Taoist temples set aside a dedicated hall in her honour, sharing incense with the guardians of the tradition.',
      meta: ['Origin: Ordained in the Way', 'Guardian of the Dharma'], meritTitle: 'Upholding the Dharma · Peace of the Grounds', meritDescription: 'For those honouring guardians, upholding the lineage, and praying for peace in sacred grounds and at home.',
    },
    {
      id: 'sanguan', categories: ['peace', 'health'], title: 'Three Officials', subtitle: 'Heaven, Earth, and Water · Blessing, Pardon, and Relief', tags: ['Blessing', 'Pardon', 'Relief'],
      description: 'The Three Officials are early Taoist deities rooted in reverence for heaven, earth, and water. Heaven grants blessings at Shangyuan, Earth pardons at Zhongyuan, and Water relieves adversity at Xiayuan.',
      meta: ['Heaven · Earth · Water', 'Three Yuan festivals'], meritTitle: 'Blessing · Pardon · Relief', meritDescription: 'For clearing adversity, welcoming blessings, and overall protection.',
    },
    {
      id: 'taisui', categories: ['career', 'peace'], title: 'Sixty Taisui Generals', subtitle: 'Annual Guardians · Governors of the Year', tags: ['Year', 'Fortune', 'Harmony'],
      description: 'The sixty Taisui are annual Taoist guardians arranged by the sixty-year stem-and-branch cycle. One presides each year over worldly fortune and adversity. Those whose zodiac conflicts with the year traditionally seek harmony early.',
      meta: ['One guardian each year', 'Seek harmony early'], meritTitle: 'Resolve Conflict · A Smoother Year', meritDescription: 'For birth-year or zodiac conflicts with the annual Taisui.',
    },
  ],
}
