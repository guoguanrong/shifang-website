const cards = [
  { title: 'New & Full Moon Blessing Rite', date: 'First and fifteenth of every lunar month', desc: 'Priests lead scripture chanting and prayers for devotees everywhere. Register your name and wish online to have your memorial read during the rite.', tags: ['Scripture', 'Memorial', 'Online'] },
  { title: 'Seasonal Protection Rite', date: 'On auspicious seasonal dates', desc: 'Following heaven and the seasons, this rite offers protection in pivotal years and keeps a family blessing tablet before the altar throughout the year.', tags: ['Protection', 'Annual Tablet', 'Tai Sui'] },
  { title: 'A Dedicated Blessing · For You or Your Family', date: 'By appointment', desc: 'For a special need—celebrating an elder’s birthday, blessing a newborn, supporting an exam or career, or remembering the departed—you may arrange a dedicated gathering. A Taoist priest will set the rites according to your wishes, with a keepsake photo after the gathering.', tags: ['Bespoke Rite', 'Keepsake Photo', 'By Appointment'] },
  { title: 'Ghost Festival Pardon Rite', date: '27 Aug 2026 · 9:00 AM', desc: 'A rite of filial remembrance and universal pardon, offering blessings to ancestors and peace and protection to the family.', tags: ['Pardon', 'Ancestors', 'Filial Piety'] },
  { title: 'Nine Emperors Longevity Rite', date: '11–19 Oct 2026 · 9:00 AM daily', desc: 'The Nine Emperors celebration is an auspicious time to worship the Dipper, pray for longevity and seek release from hardship.', tags: ['Longevity', 'Protection', 'Welcome Fortune'] },
  { title: 'Seasonal Protection Rite', date: 'On auspicious seasonal dates', desc: 'Following heaven and the seasons, this rite offers protection in pivotal years and keeps a family blessing tablet before the altar throughout the year.', tags: ['Protection', 'Annual Tablet', 'Tai Sui'] },
]

export default {
  hero: { eyebrow: 'TAOIST RITUALS', title: 'Taoist Gatherings', subtitle: 'Join freely · Practice together · Led by Taoist priests', quote: '“The Tao is never far; people carry it forward. Practice together and bear witness together.”', quoteSource: '— Daoist Canon', intro: 'A Taoist gathering, also called a zhaijiao rite, is one of Taoism’s most important forms of collective practice. It brings blessings to families and forms auspicious bonds among devotees everywhere. ShiFang Hall regularly hosts a wide range of rites, open to all who wish to join.' },
  opportunities: { title: 'Attend in Person · Four Rare Opportunities', subtitle: 'One gathering, one moment closest to the divine', items: [
    { numeral: '壹', roman: 'ONE', title: 'Experience the Sacred Place', desc: 'Ancient halls, bells and incense create a solemn presence that can only truly be felt in person.' },
    { numeral: '贰', roman: 'TWO', title: 'Write and Offer a Memorial', desc: 'Learn from a priest, write your name and wish on yellow paper, and watch the memorial rise through the flame.' },
    { numeral: '叁', roman: 'THREE', title: 'Guidance from a Master', desc: 'Ask directly about career, health, wealth and the year ahead, and receive practical guidance.' },
    { numeral: '肆', roman: 'FOUR', title: 'Renew Body and Mind', desc: 'Release worry, form good affinities and leave with calm, joy and a heart full of blessing.' },
  ] },
  recentTitle: 'Upcoming Gatherings · Join Freely', futureTitle: 'Future Programme · Ritual Calendar', cards, futureCards: cards.slice(3).concat(cards.slice(3)), details: 'Learn More', more: 'View More', empty: 'No data', loading: 'Loading', backToTop: 'Back to top',
  detail: {
    time: 'Gathering time', location: 'Place', tags: 'Themes', join: 'How to join', deadline: 'Registration closes', audience: 'Who it is for', limit: 'Attendance limit', limitPeople: '{count} people',
    intro: 'About this gathering', ritual: 'Ritual order', benefit: 'Blessings of joining', crowd: 'Who it is for',
    registerOnline: 'Register a blessing online', registerOffline: 'Attend in person', deadlineLine: 'Registration closes: {time}', ahead: '{days} days before the gathering',
    collective: 'Community gathering', reserved: 'Reserved gathering', joinOnline: 'Register online', joinOffline: 'Attend in person',
    monthly: 'Day {day} of each month', daily: 'Daily', prev: 'Previous image', next: 'Next image', back: 'Back to gatherings',
  },
  registerDialog: {
    subtitle: 'Register · Join the gathering', name: 'Name', namePlaceholder: 'Used for entry and the merit record', mobile: 'Mobile', mobilePlaceholder: 'Enter your mobile number',
    companions: 'Companions', selfOnly: 'Just me', companionCount: '{count}', wish: 'Wish (optional)', wishPlaceholder: 'The priest will present your wish',
    next: 'Next · Review', notice: 'Register your name and mobile, then bring this record when you attend.',
    nameRequired: 'Please enter your name', mobileRequired: 'Please enter your mobile number', mobileInvalid: 'Please enter a valid mobile number',
    confirmTitle: 'Review registration', confirmSubtitle: 'If this is correct, record the merit', gathering: 'Gathering', devotee: 'Name', phone: 'Mobile', party: 'Companions', partyValue: '{count}', self: 'Just me',
    back: 'Edit', submit: 'Record merit', submitting: 'Saving',
    successTitle: 'Merit recorded', successSubtitle: 'Please arrive at the gathering on time', cert: 'Registration slip',
    sms: 'A confirmation text will be sent to {mobile}', arrival: 'Show this record at the gate. May blessing be boundless.', closeBlessing: 'May blessing be boundless', failed: 'Registration failed. Please try again.',
  },
  schedule: {
    breadcrumb: 'Ritual Schedule', eyebrow: 'Ritual Schedule', title: 'Ritual Schedule', subtitle: 'Register online · Join as you wish',
    futureTitle: 'Ritual Schedule · Future Programme', futureSubtitle: 'Future programme · Join as you wish · Practice together',
    previous: 'Previous', next: 'Next', pageInfo: 'Page {current} / {total}', total: '{count} in total', pagination: 'Schedule pages',
  },
}
