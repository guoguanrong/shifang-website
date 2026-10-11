const cards = [
  { title: 'New & Full Moon Blessing Rite', date: 'First and fifteenth of every lunar month', desc: 'Priests lead scripture chanting and prayers for devotees everywhere. Register your name and wish online to have your memorial read during the rite.', tags: ['Scripture', 'Memorial', 'Online'] },
  { title: 'Seasonal Protection Rite', date: 'On auspicious seasonal dates', desc: 'Following heaven and the seasons, this rite offers protection in pivotal years and keeps a family blessing tablet before the altar throughout the year.', tags: ['Protection', 'Annual Tablet', 'Tai Sui'] },
  { title: 'Private Family Blessing', date: 'By appointment', desc: 'A dedicated rite can be arranged for longevity, a newborn, examinations, career fortune or remembrance, tailored and recorded for your family.', tags: ['Bespoke Rite', 'Video', 'Concierge'] },
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
  recentTitle: 'Upcoming Gatherings · Join Freely', futureTitle: 'Future Programme · Ritual Calendar', cards, futureCards: cards.slice(3).concat(cards.slice(3)), details: 'Learn More', more: 'View More', backToTop: 'Back to top',
}
