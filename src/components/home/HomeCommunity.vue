<template>
  <!-- 时令指引：四张季节主题卡片。 -->
  <section id="seasonal" class="seasonal-section">
    <HomeSectionHeading :eyebrow="t('seasonal.en')" :title="t('seasonal.title')"
      :description="t('seasonal.subtitle')" />
    <div class="seasonal-grid">
      <article v-for="(item, index) in seasonalItems" :key="item.title" class="seasonal-card">
        <img :src="seasonalImages[index]" alt="" />
        <div>
          <strong>{{ item.char }}</strong>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <button type="button" @click="openSeasonal(index)">{{ item.action }}</button>
        </div>
      </article>
    </div>
  </section>

  <!-- 信众实录：头像和文案按索引组合。 -->
  <section id="testimonials" class="testimonials-section">
    <img :src="testimonialsBackground" alt="" />
    <div class="section-content">
      <HomeSectionHeading :eyebrow="t('testimonials.en')" :title="t('testimonials.title')"
        :description="t('testimonials.subtitle')" />
      <div class="testimonials-grid">
        <article v-for="(item, index) in testimonials" :key="item.id ?? `${item.tag}-${index}`">
          <div>
            <div v-if="item.fromApi" class="testimonial-avatar" aria-hidden="true">{{ item.initial }}</div>
            <img v-else :src="avatars[index % avatars.length]" alt="" />
            <span>
              <b>{{ item.name }} <em v-if="item.fromApi ? item.type : item.tag">{{ item.fromApi ? memoirTypeLabel(item.type) : item.tag }}</em></b>
              {{ item.role }}
            </span>
          </div>
          <p v-if="item.storyTitle" class="testimonial-story-title">{{ item.storyTitle }}</p>
          <p class="quote">{{ item.quote }}</p>
        </article>
      </div>
      <button class="section-more" type="button" @click="goToPage('testimonials')">{{ t('testimonials.more') }}
        ⟶</button>
    </div>
  </section>

  <!-- 各界寄语：标签切换状态由 activeTab 维护。 -->
  <section id="messages" class="messages-section">
    <img :src="messagesBackground" alt="" />
    <div class="section-content">
      <HomeSectionHeading :eyebrow="t('messages.en')" :title="t('messages.title')"
        :description="t('messages.subtitle')" />
      <div class="tabs" role="tablist">
        <button v-for="(tab, index) in messageTabs" :key="tab" type="button" :class="{ active: activeTab === index }"
          @click="activeTab = index">{{ tab }}</button>
      </div>
      <!-- 接口无数据时展示「暂无寄语」，不再回退静态示例卡。 -->
      <div v-if="displayedMessages.length" class="message-card-grid">
        <article v-for="(card, index) in displayedMessages" :key="card.id ?? index" class="figma-message-card">
          <img :src="card.cover" :alt="card.title" />
          <button v-if="card.isVideo" type="button" :aria-label="`播放第${index + 1}条视频`" class="play-button"
            @click="goToPage('messages')">▶</button>
          <div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.content }}</p>
          </div>
        </article>
      </div>
      <p v-else class="message-grid-empty">{{ t('messages.empty') }}</p>
      <button class="section-more messages-more" type="button" @click="goToPage('messages')">{{ t('messages.more') }}
        ⟶</button>
    </div>
  </section>

  <!-- 最新动态列表。 -->
  <section id="news" class="news-section">
    <HomeSectionHeading :eyebrow="t('news.en')" :title="t('news.title')" :description="t('news.subtitle')" />
    <div class="news-grid">
      <article v-for="(item, index) in newsItems" :key="item.id ?? item.title"><img
        :src="item.cover || newsImages[index]" :alt="item.title"
      />
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </article>
    </div>
    <button class="section-more" type="button" @click="goToPage('news')">{{ t('news.more') }} ⟶</button>
  </section>

  <!-- 里程碑按年份形成时间轴。 -->
  <section id="milestones" class="milestones-section"><img :src="milestonesBackground" alt="" />
    <div class="section-content">
      <HomeSectionHeading :eyebrow="t('milestones.en')" :title="t('milestones.title')"
        :description="t('milestones.subtitle')" />
      <ol>
        <li v-for="item in milestones" :key="item.year"><time>{{ item.year }}</time>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getDynamicList } from '@/api/dynamic'
import { getMemoirList } from '@/api/memoir'
import { getWishesList } from '@/api/wishes'
import HomeSectionHeading from './HomeSectionHeading.vue'
import testimonialsBackground from '@/assets/images/bg-testimonials.webp'
import messagesBackground from '@/assets/cuts/messages-bg.webp'
import milestonesBackground from '@/assets/cuts/milestones-bg.png'
import milestoneEmblem from '@/assets/cuts/milestone-emblem.png'
import seasonal1 from '@/assets/images/seasonal-scroll-1.webp'
import seasonal2 from '@/assets/images/seasonal-scroll-2.webp'
import seasonal3 from '@/assets/images/seasonal-scroll-3.webp'
import seasonal4 from '@/assets/images/seasonal-scroll-4.webp'
import avatar1 from '@/assets/images/avatar-1.webp'
import avatar2 from '@/assets/images/avatar-2.webp'
import avatar3 from '@/assets/images/avatar-3.webp'
import avatar4 from '@/assets/images/avatar-4.webp'
import avatar5 from '@/assets/images/avatar-5.webp'
import avatar6 from '@/assets/images/avatar-6.webp'
import avatar7 from '@/assets/images/avatar-7.webp'
import avatar8 from '@/assets/images/avatar-8.webp'
import messageCard1 from '@/assets/images/msg-card-1.webp'
import messageCard2 from '@/assets/images/msg-card-2.webp'
import messageCard3 from '@/assets/images/msg-card-3.webp'
import news1 from '@/assets/images/news-1.webp'
import news2 from '@/assets/images/news-2.webp'
import news3 from '@/assets/images/news-3.webp'

const { t, tm, locale } = useI18n()
const router = useRouter()
// 分类标签顺序与语言包 messages.tabs 一一对应，取值为后端 category 字段的中文类别。
const TAB_CATEGORIES = ['知名人士', '道内人士', '其他重要人士']
// 当前寄语分类索引，切换时按类别重新拉取数据。
const activeTab = ref(0)
// 以下素材数组必须与对应语言包 items 数组保持相同顺序。
const seasonalImages = [seasonal1, seasonal2, seasonal3, seasonal4]
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8]
const messageCards = [messageCard1, messageCard2, messageCard3]
const newsImages = [news1, news2, news3]
// 所有列表通过 computed 获取，切换语言时无需手动刷新组件。
const seasonalItems = computed(() => tm('seasonal.items'))

// 四季卡片按钮的跳转路由：与 seasonalImages 同序（春/夏/秋/冬），填入路径（如 '/blessings'）即可生效，留空则不跳转。
const SEASONAL_ROUTES = [
  '/blessings', // 春
  '/wellness', // 夏
  '/blessings', // 秋
  '/blessings', // 冬
]

function openSeasonal(index) {
  const target = SEASONAL_ROUTES[index]
  if (target) router.push(target)
}
const staticTestimonials = computed(() => tm('testimonials.items'))
const apiTestimonials = ref([])
const testimonials = computed(() => apiTestimonials.value.length ? apiTestimonials.value : staticTestimonials.value)
const messageTabs = computed(() => tm('messages.tabs'))
const messages = computed(() => tm('messages.items'))
const apiMessages = ref([])
// 无数据时展示空状态图，不再回退静态示例卡。
const displayedMessages = computed(() => apiMessages.value)
// 最新动态：优先展示接口数据，无数据或加载失败时回退语言包静态条目。
const apiNews = ref([])

async function loadNews() {
  try {
    const result = await getDynamicList({ page: 1, pageSize: 3, show: true }, { silent: true })
    const list = Array.isArray(result) ? result : result?.list
    apiNews.value = Array.isArray(list)
      ? list.slice(0, 3).map((item, index) => ({
        id: item.id ?? `news-${index}`,
        title: item.title || '',
        desc: item.content || '',
        cover: parseWishImages(item.cover)[0] || newsImages[index % newsImages.length],
      }))
      : []
  } catch {
    apiNews.value = []
  }
}

const newsItems = computed(() => (apiNews.value.length ? apiNews.value : tm('news.items')))
const milestones = computed(() => tm('milestones.items'))
// 时间轴徽章作为 CSS 背景变量使用，避免在模板中增加装饰节点。
const milestoneEmblemBackground = `url("${milestoneEmblem}")`

function memoirTypeLabel(type) {
  const labels = {
    peace: { en: 'Peace', 'zh-CN': '平安', 'zh-TW': '平安' },
    health: { en: 'Health', 'zh-CN': '健康', 'zh-TW': '健康' },
    wealth: { en: 'Prosperity', 'zh-CN': '财运', 'zh-TW': '財運' },
  }
  const language = locale.value.startsWith('zh-TW') ? 'zh-TW' : locale.value.startsWith('zh') ? 'zh-CN' : 'en'
  return labels[String(type).toLowerCase()]?.[language] || type
}

function parseWishImages(value) {
  let imageList = []

  if (Array.isArray(value)) {
    imageList = value
  } else if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      imageList = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      imageList = [value]
    }
  }

  return imageList.map((image) => typeof image === 'string' ? image : image?.url).filter(Boolean)
}

onMounted(async () => {
  try {
    const result = await getMemoirList({ page: 1, pageSize: 8, show: true }, { silent: true })
    const list = Array.isArray(result) ? result : result?.list
    apiTestimonials.value = Array.isArray(list)
      ? list.map((item) => ({
        id: item.id,
        name: item.username || '',
        type: item.type || '',
        role: item.job || '',
        storyTitle: item.title || '',
        quote: item.content || '',
        initial: String(item.username || '?').trim().slice(0, 1).toUpperCase(),
        fromApi: true,
      }))
      : []
  } catch {
    apiTestimonials.value = []
  }
})

// 按当前分类标签加载寄语（仅展示已发布的）。
async function loadMessages() {
  try {
    const result = await getWishesList(
      { page: 1, pageSize: 6, show: true, category: TAB_CATEGORIES[activeTab.value] },
      { silent: true },
    )
    const list = Array.isArray(result) ? result : result?.list
    apiMessages.value = Array.isArray(list)
      ? list.slice(0, 6).map((item, index) => ({
        id: item.id ?? `wish-${index}`,
        cover: parseWishImages(item.imgArrUrls)[0] || messageCards[index % messageCards.length],
        title: item.title || messages.value[index]?.name || '',
        content: item.content || item.detail || messages.value[index]?.quote || '',
        isVideo: Number(item.type) === 1 || Boolean(item.videoUrl),
      }))
      : []
  } catch {
    apiMessages.value = []
  }
}

onMounted(loadMessages)
// 切换分类标签时加载对应类别的寄语。
watch(activeTab, loadMessages)
onMounted(loadNews)

function goToPage(name) {
  router.push({ name })
}
</script>

<style scoped>
.seasonal-section {
  /* 文案长度随语言变化：区块高度由内容撑开，设计稿高度仅作下限。 */
  min-height: 843px;
  padding-top: 0;
  background: transparent;
  margin-top: 500px;
}

.seasonal-section :deep(.section-heading) {
  margin-bottom: 35px;
}

.seasonal-section :deep(.section-heading > p:first-child) {
  margin-bottom: 14px;
  line-height: 1;
}

.seasonal-section :deep(.section-heading h2) {
  margin-bottom: 15px;
  line-height: 1;
}

.seasonal-section :deep(.section-heading .description) {
  font-size: 16px;
  line-height: 1;
}

.seasonal-grid {
  display: grid;
  grid-template-columns: repeat(4, 246px);
  justify-content: center;
  gap: 13px;
  width: 1440px;
  min-height: 635px;
  padding: 59px 208.5px 67px;
  margin: auto;
  background: url('@/assets/images/bg-seasonal.webp') center / 100% 100% no-repeat;
}

.seasonal-card {
  position: relative;
  min-height: 509px;
  color: #111;
}

.seasonal-card>img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

/* 卡片内容改为流式布局：文案变长时依次撑开徽章、标题、正文与按钮。 */
.seasonal-card>div {
  position: relative;
  padding: 64px 24px 60px;
  text-align: center;
}

.seasonal-card strong {
  display: grid;
  width: 86px;
  height: 86px;
  margin: 0 auto;
  place-items: center;
  color: #111;
  font-family: var(--font-calligraphy);
  font-size: 28px;
  font-weight: 400;
  line-height: 1;
  text-align: center;
  background: #f8f5ed;
  border: 3px double #d45a42;
  border-radius: 50%;
  box-shadow: inset 0 0 0 3px #f8f5ed, inset 0 0 0 4px rgba(194, 159, 121, .7);
}

.seasonal-card h3 {
  display: inline-flex;
  align-items: center;
  min-width: 81px;
  max-width: 100%;
  min-height: 26px;
  margin: 6px auto 0;
  padding: 0 9px;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  background: rgba(255, 255, 255, .82);
  border: 1px solid #d8a98a;
}

.seasonal-card p {
  min-height: 121px;
  margin: 35px auto 0;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  line-height: 25px;
  text-align: center;
}

.seasonal-card button {
  display: block;
  width: 158px;
  height: 36px;
  margin: 13px auto 0;
  padding: 0 4px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 34px;
  background: linear-gradient(180deg, #da4825, #c92f10);
  border: 1px solid #c29f79;
  border-radius: 100px;
  box-shadow: inset 0 0 0 2px rgba(248, 245, 241, .28), 0 5px 7px rgba(110, 52, 20, .16);
  cursor: pointer;
}

.seasonal-card button::before,
.seasonal-card button::after {
  position: absolute;
  top: 50%;
  width: 4px;
  height: 4px;
  content: '';
  background: linear-gradient(180deg, #f8f5f1, #caab89);
  transform: translateY(-50%) rotate(45deg);
}

.seasonal-card button::before {
  left: 5px;
}

.seasonal-card button::after {
  right: 5px;
}

@media (hover: hover) and (pointer: fine) {
  .seasonal-card button:hover {
    transform: translateY(-3px);
  }
}

.testimonials-section,
.messages-section,
.milestones-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.testimonials-section {
  z-index: 1;
  /* 高度随内容自适应（卡片行数随接口数据变化）；底部预留 175px 供下方寄语
     区块（margin-top: -175px）叠压过渡，内容行数少时卡片也不会被遮挡。 */
  padding: 72px 6vw 275px;
  background: #fff;
}

.testimonials-section>img,
.messages-section>img,
.milestones-section>img {
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonials-section>img {
  display: none;
}

.testimonials-section::before {
  position: absolute;
  z-index: -1;
  right: 0;
  bottom: 0;
  width: 600px;
  height: 610px;
  content: '';
  /* background: url('@/assets/cuts/temple-stage-bg.webp') right bottom / 950px auto no-repeat; */
  opacity: .34;
  transform: scaleX(-1);
}

.section-content {
  max-width: 1440px;
  margin: auto;
}

.testimonials-section :deep(.section-heading) {
  margin-bottom: 35px;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 446.67px);
  gap: 20px 50px;
}

.testimonials-grid article {
  position: relative;
  height: 220px;
  padding: 24px 25px 18px;
  color: #333;
  background: rgba(249, 245, 237, .58);
  border: 1px solid #e8b57f;
  border-radius: 12px;
}

.testimonials-grid article>div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonials-grid img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
}

.testimonial-avatar {
  display: grid;
  width: 70px;
  height: 70px;
  flex: 0 0 70px;
  place-items: center;
  color: #9a321a;
  font-size: 24px;
  background: #f1e3cd;
  border: 1px solid #d9b786;
  border-radius: 50%;
}

.testimonials-grid span {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.testimonials-grid b {
  font-size: 18px;
  font-weight: 400;
}

.testimonials-grid em {
  display: inline-block;
  min-width: 58px;
  margin-left: 8px;
  padding: 2px 10px;
  color: #cc3513;
  font-size: 13px;
  font-style: normal;
  text-align: center;
  border: 1px solid #cc3513;
  border-radius: 99px;
}

.quote {
  margin: 15px 0 0;
  font-family: var(--font-calligraphy);
  font-size: 15px;
  line-height: 1.65;
}

.testimonial-story-title {
  margin: 11px 0 -8px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-more {
  display: block;
  min-width: 140px;
  margin: 47px auto 0;
  padding: 7px 22px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 15px;
  background: #cc3513;
  border: 3px double #f2d2af;
  border-radius: 99px;
  cursor: pointer;
}

.messages-section {
  z-index: 2;
  /* 高度随内容自适应（卡片行数随各类别数据变化），上方负 margin 叠压关系不变。 */
  margin-top: -175px;
  padding: 104px 6vw 64px;
  background: #a50908;
}

.messages-section>img {
  object-fit: cover;
}

.messages-section :deep(.section-heading) {
  margin-bottom: 12px;
}

.messages-section :deep(.section-heading h2),
.messages-section :deep(.section-heading .description) {
  color: #fff;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 13px;
  margin-bottom: 39px;
}

/* 纯 CSS 绘制：深红底 + 金边胶囊，与 #a50908 背景拉开层次。 */
.tabs button {
  min-width: 118px;
  min-height: 36px;
  padding: 7px 18px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  background-color: #7f0001;
  border: 1px solid #f2d2af;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

/* hover：背景提亮、金边变浅、加阴影，区别于默认态。 */
.tabs button:hover {
  background-color: #a51c1c;
  border-color: #ffe6c8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .18);
  transform: translateY(-1px);
}

/* 选中态：浅底深红字 + 金边，与默认态强对比；hover 锁定同一组样式，避免选中按钮再变色。 */
.tabs .active,
.tabs .active:hover {
  color: #a50908;
  background-color: #f9f5ed;
  border-color: #f2d2af;
  box-shadow: none;
  transform: none;
}

.message-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

/* 寄语无数据时的空状态提示。 */
.message-grid-empty {
  min-height: 240px;
  display: grid;
  place-items: center;
  margin: 0;
  color: #c8c3bb;
  font-size: 15px;
  letter-spacing: 1px;
}

.figma-message-card {
  position: relative;
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(80, 10, 5, .18);
}

.figma-message-card>img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.figma-message-card>div {
  min-height: 109px;
  padding: 16px 20px 18px;
}

.figma-message-card h3 {
  margin: 0 0 9px;
  color: #333;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  font-weight: 400;
}

.figma-message-card p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #575656;
  font-size: 14px;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.play-button {
  position: absolute;
  top: 75px;
  left: 50%;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  padding-left: 4px;
  color: #fff;
  font-size: 15px;
  background: rgba(28, 48, 72, .78);
  border: 1px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

.messages-more {
  width: 140px;
  height: 36px;
  padding: 0 18px;
  margin-top: 39px;
  color: #713421;
  line-height: 30px;
  background: #f8ead7;
  border-color: #bd694d;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .78);
}

.news-section {
  position: relative;
  z-index: 3;
  height: 638px;
  margin-top: -15px;
  padding: 42px 6vw 0;
  overflow: hidden;
  background: #fff;
}

.news-section :deep(.section-heading) {
  margin-bottom: 29px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  max-width: 1440px;
  margin: auto;
}

.news-grid article {
  position: relative;
  height: 280px;
  overflow: hidden;
  color: #fff;
  background: #163464;
  border-radius: 14px;
}

.news-grid article::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, .82));
}

.news-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-grid h3,
.news-grid p {
  position: absolute;
  z-index: 1;
  right: 20px;
  left: 20px;
  margin: 0;
}

.news-grid h3 {
  bottom: 60px;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  font-weight: 400;
}

.news-grid p {
  bottom: 18px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.7;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.news-section .section-more {
  margin-top: 30px;
}

.milestones-section {
  z-index: 4;
  height: 496px;
  padding-top: 69px;
  background: #f8f5ed;
}

.milestones-section .section-content {
  width: 100%;
  max-width: 1440px;
}

.milestones-section :deep(.section-heading) {
  margin-bottom: 82px;
}

.milestones-section ol {
  --milestone-axis-y: 158px;

  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.milestones-section ol::before {
  position: absolute;
  top: var(--milestone-axis-y);
  right: 0;
  left: 0;
  height: 1px;
  content: '';
  background: #d0a06d;
}

.milestones-section ol::after {
  position: absolute;
  top: calc(var(--milestone-axis-y) - 93.5px);
  left: -170px;
  width: 187px;
  height: 187px;
  content: '';
  background: v-bind(milestoneEmblemBackground) center / contain no-repeat;
}

.milestones-section li {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  min-height: 220px;
  padding: 0 12px;
}

.milestones-section li::after {
  position: absolute;
  top: 148px;
  left: 50%;
  width: 13px;
  height: 13px;
  content: '';
  background: #cc3513;
  border: 3px double #f2d2af;
  transform: translateX(-50%) rotate(45deg);
}

.milestones-section time {
  order: 0;
  width: 100%;
  color: #cc3513;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.milestones-section li>div {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.milestones-section h3 {
  position: absolute;
  top: 179px;
  left: 50%;
  z-index: 1;
  width: max-content;
  max-width: calc(100% - 16px);
  margin: 0;
  padding: 4px 10px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  text-align: center;
  background: #1d4e6e;
  transform: translateX(-50%);
}

.milestones-section p {
  position: absolute;
  top: 24px;
  left: 50%;
  width: calc(100% - 24px);
  max-width: 320px;
  margin: 0;
  color: #555;
  font-size: 12px;
  line-height: 1.55;
  text-align: center;
  transform: translateX(-50%);
}

@media (max-width: 1439px) {

  .seasonal-section,
  .testimonials-section,
  .messages-section,
  .news-section {
    height: auto;
    min-height: 0;
    margin-top: 0;
    padding: 70px 20px;
  }

  .milestones-section {
    height: auto;
    min-height: 0;
    margin-top: 0;
    padding: 70px 0;
  }

  .seasonal-section {
    background: url('@/assets/cuts/supervision-stage-bg.webp') center bottom / cover no-repeat;
  }

  .seasonal-grid {
    grid-template-columns: repeat(2, 246px);
    width: fit-content;
    height: auto;
    padding: 44px;
    background-size: cover;
  }

  .testimonials-grid,
  .message-card-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}

@media (max-width: 1023px) {
  .milestones-section {
    padding: 56px 16px;
  }

  .milestones-section ol {
    grid-template-columns: 1fr;
    width: min(100%, 700px);
    margin: 0 auto;
    padding-left: 24px;
    gap: 18px;
  }

  .milestones-section ol::before {
    top: 8px;
    right: auto;
    bottom: 8px;
    left: 7px;
    width: 1px;
    height: auto;
  }

  .milestones-section ol::after {
    display: none;
  }

  .milestones-section li {
    align-items: stretch;
    min-height: 0;
    padding: 0 0 8px;
  }

  .milestones-section li::after {
    top: 5px;
    left: -24px;
    transform: rotate(45deg);
  }

  .milestones-section time {
    text-align: left;
  }

  .milestones-section h3 {
    position: static;
    width: max-content;
    max-width: min(100%, 250px);
    margin: 10px 0 0;
    transform: none;
  }

  .milestones-section p {
    position: static;
    width: auto;
    max-width: none;
    margin: 6px 0 0;
    text-align: left;
    transform: none;
  }
}

@media (max-width: 600px) {
  .seasonal-grid {
    grid-template-columns: 246px;
    padding: 25px;
  }

  .testimonials-grid,
  .message-card-grid,
  .news-grid {
    grid-template-columns: 1fr;
  }

  .quote {
    min-height: auto;
  }

  .seasonal-card p {
    min-height: auto;
  }
}
</style>
