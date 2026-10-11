// English copy mirrors the Chinese ritual sequence while using concise, layout-safe phrasing.
export default {
  backToTop: 'Back to top',
  hero: {
    eyebrow: 'Worship Etiquette', title: 'Taoist Worship Etiquette',
    subtitle: 'Enter with courtesy · Worship with reverence · Practice together worldwide',
    quote: '“The body houses the spirit and reverence carries virtue; perfect sincerity reaches everywhere.”',
    quoteSource: '— Daozang · Dongxuan Section · Ritual of Purification',
    // Split into parts so the two stages can be highlighted in the hero intro.
    intro: [
      { text: 'Taoist worship is the first step in spiritual practice and an important way for devotees to connect with the deities. It has two main parts: ' },
      { text: 'offering incense and making a wish', accent: true },
      { text: ', then ' },
      { text: 'bowing before the sacred image', accent: true },
      { text: '. The following basic rites are suitable for first visits and everyday worship.' },
    ],
  },
  incense: {
    title: 'Offering Incense', subtitle: 'Let incense carry a sincere prayer to heaven',
    steps: [
      { step: 'Step One', title: 'Take the Incense', slogan: 'Take three sticks · Hold with the left hand', desc: 'Take three incense sticks with the left hand, regarded as the hand of kindness, and light them from the candle. Never blow out the flame; gently wave the sticks or fan it out by hand. The three sticks honor the Three Pure Ones, all deities and the ancestors.', tip: 'Keep the three sticks less than an inch apart, symbolizing a sincere heart.' },
      { step: 'Step Two', title: 'Raise the Incense', slogan: 'Raise it to the brow · Silently state your wish', desc: 'Hold the incense in both hands at eyebrow height, with its tips facing the sacred image. Silently recite the deity’s title, your name and address, and your wish. This central rite expresses the deepest reverence and opens communication with the divine. Keep the mind focused and free of distraction.', tip: 'Make one specific, sincere wish rather than asking for too much.' },
      { step: 'Step Three', title: 'Place the Incense', slogan: 'Three placements · Center, right, then left', desc: 'Place the first stick in the center for the Three Pure Ones and the heavens, the second on the right for deities of the ten directions, and the third on the left for ancestral masters. Keep all three upright, steady and evenly spaced. The offering joins your prayer with the Three Treasures: Tao, Scripture and Teacher.', tip: 'Incense represents the Three Treasures and establishes a sacred connection.', order: ['Center first', 'Right second', 'Left last'] },
    ],
  },
  worship: {
    title: 'Bowing Before the Deity', subtitle: 'Honor through ritual · Connect through sincerity',
    cleanse: { title: 'Purify', slogan: 'Wash hands and face · Arrange your clothing', desc: 'Before entering the temple, wash your hands and arrange your clothing. A clear heart makes clean hands, and clean hands express sincerity. Dress modestly; do not enter in slippers or revealing clothes. Men should remove hats, and heavy makeup is discouraged.', tip: 'Purification is more than hygiene: it clears distraction and settles body and mind.' },
    ceremony: {
      title: 'Prostration', slogan: 'Three bows and nine kowtows · Salute with clasped hands', lead: 'The highest Taoist rite combines a standing salute with kneeling prostrations.', tip: 'The left hand encloses the right as the “Ziwu seal,” symbolizing harmony of yin and yang and union with the Tao.',
      stages: [
        { number: 'I', title: 'Standing Salute', desc: 'Stand before the kneeling cushion with feet together. Enclose the right hand with the left and form the Ziwu seal with the thumbs, symbolizing the harmony of yin and yang and union with the Tao.' },
        { number: 'II', title: 'Three Bows, Nine Kowtows', desc: 'Kneel on both knees. Support yourself with the right hand, place the left hand over it, bow forward and touch your forehead to the back of the left hand three times. Repeat the sequence three times for three bows and nine kowtows.' },
        { number: 'III', title: 'State Your Prayer', desc: 'While bowing, recite the following silently and in order:', prayer: [
          { title: '1. Invoke the sacred title', text: '“This disciple sincerely bows before [name of deity],” such as Zhao Gongming or Wenchang Dijun.' },
          { title: '2. Identify yourself', text: 'State your name, birth date and full place of residence, and say that you pray sincerely before the deity.' },
          { title: '3. State one good wish', text: 'Name a specific hope, such as family safety, success in work, recovery from illness or achievement in study.' },
          { title: '4. Make a vow of gratitude', text: 'Promise an appropriate act of gratitude, such as supporting restoration, offering a lamp, observing a fast, reciting scripture or printing good books.' },
        ], notice: 'Remain focused and clear. Make only vows you can fulfill; a promise should always be honored.' },
        { number: 'IV', title: 'Rise and Close', desc: 'After the final kowtow, draw the clasped hands back to the chest and rise slowly. Move with calm dignity, never rushing. Finish with another clasped-hand salute.' },
      ],
    },
    retreat: { title: 'Withdraw', slogan: 'Step back from the hall · End as respectfully as you began', desc: 'After the rite, take three steps backward while facing the sacred image, then turn and leave. This avoids turning your back on the deity. You may make a voluntary offering or pause outside to experience the temple’s stillness. Never shout, laugh loudly or cause disturbance inside the hall.', tip: 'Withdrawing backward embodies reverence from beginning to end.' },
  },
  taboos: {
    title: 'Worship Taboos · A Guide for All Devotees',
    items: [
      { title: 'Do Not Point', desc: 'Indicate a sacred image with an open palm, never with one finger.' },
      { title: 'Avoid the Central Gate', desc: 'The central gate is the sacred path; visitors use the side gates.' },
      { title: 'Do Not Step on Thresholds', desc: 'Step over the boundary. Traditionally, men lead left and women right.' },
      { title: 'Keep Quiet and Do Not Photograph', desc: 'Keep the hall quiet and photograph sacred images only with permission.' },
      { title: 'Never Blow on Incense', desc: 'Wave out the flame gently or fan it with your hand.' },
      { title: 'Do Not Turn Your Back', desc: 'Step backward after worship before turning to leave the hall.' },
    ],
  },
}
