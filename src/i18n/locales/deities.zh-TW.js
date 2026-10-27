// 神祇百科繁體中文文案；分類鍵保留英文，確保篩選邏輯跨語言穩定。
export default {
  hero: {
    eyebrow: 'Deities & Immortals', title: '聖像釋義', subtitle: '瞭解每位神明的來歷與職責，知所求、明所願',
    quote: '「神無方而易無體，一陰一陽之謂道」', quoteSource: '—— 《周易·繫辭》· 道藏洞真部',
  },
  filtersLabel: '按所求分類篩選神祇',
  filters: ['全部', '財運', '事業', '健康', '學業', '平安'],
  meritLabel: '所求功德', actions: { light: '線上點燈', offer: '神像供奉' },
  monthlyPrice: '月供', yearlyPrice: '年供', worshipUnavailable: '供奉尚未開放',
  lightUnavailable: '該神祇尚未設定線上點燈',
  lightLookupFailed: '讀取點燈設定失敗，請稍後再試',
  lightUnknownDeity: '無法識別該神祇的點燈設定',
  empty: '該分類暫無神祇資料', backToTop: '返回頂部',
  featured: {
    id: 'doumu', categories: ['health', 'peace'], title: '斗姆元君', subtitle: '北斗眾星之母 · 消災延壽', tags: ['消 災', '延 壽', '解 厄'],
    description: '斗姆元君，又稱斗姥、中天梵炁斗姥元君，為北斗眾星之母，是道教最重要的女神之一。據《斗姥經》記載，斗姆元君乃先天一炁化生，化身於中天梵炁斗府，育化北斗九皇、南斗六司及周天列宿，掌管人的生死壽夭、禍福吉凶。',
    meta: [{ label: '來 歷', value: '先天一炁化生' }, { label: '聖 誕', value: '九月初九' }], meritTitle: '消災延壽 · 解厄保安', meritDescription: '適合身體不安、運勢不順、逢災年者',
  },
  cards: [
    { id: 'fanli', categories: ['wealth', 'career'], title: '文財神范蠡', subtitle: '陶朱公 · 生財有道', tags: ['財 運', '經 商', '富 貴'], description: '范蠡，字少伯，春秋末期越國名臣，輔佐越王勾踐滅吳，功成之後激流勇退，化名鴟夷子皮泛舟五湖。後定居陶經商，三致千金又三散千金，世稱「陶朱公」，被後世尊為文財神，是「富而好德、聚散有道」的典範。', meta: ['財神節：七月廿二', '陶朱遺風'], meritTitle: '招財進寶 · 生意興隆', meritDescription: '適合求財求利、經商置業、投資理財者' },
    { id: 'zhaogongming', categories: ['wealth', 'career'], title: '玄壇趙元帥', subtitle: '正財神 · 五路財源', tags: ['財 運', '生 意', '財 富'], description: '趙公明元帥為道教正財神，統領招寶天尊、納珍天尊、招財使者、利市仙官四路財神，合稱五路財神。趙元帥黑面濃鬚、持鐵鞭、騎黑虎，威猛無比。', meta: ['聖誕：三月十五', '五路財神之首'], meritTitle: '財運亨通 · 生意興隆', meritDescription: '適合經商求財、職場加薪、投資順利者' },
    { id: 'tudigong', categories: ['peace', 'wealth'], title: '福德正神', subtitle: '土地公 · 一方守護', tags: ['平 安', '財 運', '家 宅'], description: '福德正神即民間俗稱的土地公、土地爺，道教尊為福德正神，執掌一方土地安寧，護佑鄉里五穀豐登、安居樂業。是離百姓最近、最親切的神明，有「田頭田尾土地公」之說。', meta: ['聖誕：二月初二', '福德綿長'], meritTitle: '家宅平安 · 五穀豐登', meritDescription: '適合求家宅安寧、土地豐收、生意穩定者' },
    { id: 'wenchang', categories: ['study', 'career'], title: '文昌帝君', subtitle: '文運之主 · 功名利祿', tags: ['學 業', '考 試', '仕 途'], description: '文昌帝君為道教主管文運、功名、仕途的神明，源於古代星宿崇拜。文昌星乃北斗七星之輔星，主文運。文昌帝君聖誕為二月初三，是求學業考試晉升的最佳時機。', meta: ['聖誕：二月初三', '主管考試晉升'], meritTitle: '學業進步 · 仕途通達', meritDescription: '適合考生、求晉升、求功名者' },
    { id: 'guansheng', categories: ['wealth', 'career', 'peace'], title: '關聖帝君', subtitle: '武財神 · 忠義武聖', tags: ['財 運', '事 業', '忠 義'], description: '關聖帝君即三國名將關羽，集忠義武財於一身，既是護法神又是武財神，主管事業運勢、人際關係、化小人。商界普遍供奉關公。', meta: ['聖誕：六月廿四', '道門共尊'], meritTitle: '事業順遂 · 小人遠離', meritDescription: '適合經商、求職、求事業穩固、化小人者' },
    { id: 'wanglingguan', categories: ['peace', 'health'], title: '王靈官', subtitle: '護法監壇 · 鎮守山門', tags: ['護 法', '鎮 邪', '保 安'], description: '王靈官為道教護法監壇之神，五百靈官之首。形象為赤面髯鬚、身披金甲、手持鋼鞭，鎮守道觀山門。凡入道門者最先拜見的就是王靈官。', meta: ['聖誕：六月廿三', '五百靈官之首'], meritTitle: '護身保安 · 邪不侵正', meritDescription: '適合求出入平安、驅邪護身、修道護法者' },
    { id: 'leizun', categories: ['peace', 'career'], title: '九天應元雷聲普化天尊', subtitle: '雷祖 · 掌天罰', tags: ['雷 罰', '正 義', '震 懾'], description: '九天應元雷聲普化天尊為雷部最高神，總管雷霆威罰與天地正氣，又稱雷祖。掌雷霆之政令，統御雷部三十六神將、二十四天君。', meta: ['聖誕：六月廿四', '雷霆萬鈞'], meritTitle: '正氣護身 · 驅邪避惡', meritDescription: '適合求正義伸張、驅除邪祟、護身鎮宅者' },
    { id: 'dongyue', categories: ['health', 'peace'], title: '東嶽大帝', subtitle: '泰山之神 · 掌人生死', tags: ['生 死', '幽 冥', '善 惡'], description: '東嶽大帝為五嶽之首泰山之神，掌管人間生死貴賤、幽冥地府之審判。東嶽大帝信仰源於古代泰山崇拜，聖誕為三月廿八。', meta: ['聖誕：三月廿八', '執掌幽冥'], meritTitle: '壽數綿長 · 陰德庇佑', meritDescription: '適合為長輩祈福延壽、超度先人、求冥福者' },
    { id: 'foxian', categories: ['peace'], title: '狐仙', subtitle: '護法正神 · 守護道場', tags: ['護 法', '鎮 守', '護 道'], description: '狐仙，為道教神系中的護法正神。它經道門敕封、受戒奉道，以護持正道、守護道場為職，護佑一方清淨安寧，而非滿足世俗願望。道教宮觀中多設專殿供奉，與道門護法同受香火。', meta: ['由來：受戒奉道', '護法護道'], meritTitle: '護持正法 · 道場安寧', meritDescription: '適合敬奉護法、護持道脈、祈願道場與家宅安寧者' },
    { id: 'sanguan', categories: ['peace', 'health'], title: '三官大帝', subtitle: '天官地官水官 · 賜福赦罪解厄', tags: ['賜 福', '赦 罪', '解 厄'], description: '三官大帝為道教早期尊神之一，源於古人對天地水的自然崇拜。天官賜福於正月十五（上元節），地官赦罪於七月十五（中元節），水官解厄於十月十五（下元節）。', meta: ['三官：天、地、水', '三元日祈福'], meritTitle: '賜福赦罪 · 解厄消災', meritDescription: '適合求整體運勢清理、消災免難、迎福納祥者' },
    { id: 'taisui', categories: ['career', 'peace'], title: '六十甲子太歲', subtitle: '值年太歲神 · 流年運勢主管', tags: ['流 年', '運 勢', '化 煞'], description: '太歲星君為道教值年神祇，共六十位，以六十甲子為序每年輪值一位，主管當年人間吉凶禍福。犯太歲者需及時化解。太歲信仰源於中國古代星宿崇拜，與木星運行週期密切相關。', meta: ['每年輪值一位', '化太歲宜早不宜遲'], meritTitle: '化解沖煞 · 順遂流年', meritDescription: '逢本命年、犯太歲者宜提前供奉' },
  ],
}
