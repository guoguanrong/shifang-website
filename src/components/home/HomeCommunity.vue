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
  <!-- <section id="news" class="activity-section">
    <div class="section-content">
      <HomeSectionHeading :eyebrow="t('homeActivity.en')" :title="t('homeActivity.title')"
        :description="t('homeActivity.subtitle')" />
      <div class="activity-tabs" role="tablist" :aria-label="t('homeActivity.title')">
        <button v-for="tab in activityTabs" :key="tab.key" type="button" role="tab"
          :class="['activity-tab', 'activity-tab--' + tab.key, { active: activeActivityTab === tab.key }]"
          :aria-selected="activeActivityTab === tab.key" aria-controls="home-activity-panel"
          :tabindex="activeActivityTab === tab.key ? 0 : -1" @click="activeActivityTab = tab.key">
          <img :src="tab.image" alt="" aria-hidden="true" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <div id="home-activity-panel" class="activity-card-grid" role="tabpanel" :aria-busy="activityLoading">
        <RouterLink v-for="item in activityItems" :key="item.id" :to="activityDetailRoute(item)"
          class="activity-card" :aria-label="t('homeActivity.openDetail', { title: item.title })">
          <img class="activity-card__image" :src="item.cover" alt="" />
          <span class="activity-card__shade" aria-hidden="true"></span>
          <span class="activity-card__badge" aria-hidden="true">
            <img class="activity-card__badge-shape" :src="activityBadge" alt="" />
            <span class="activity-card__badge-text" :style="{ '--badge-font-size': locale.startsWith('zh') ? '18px' : '10px' }">
              {{ activeActivityBadge }}
            </span>
            <img class="activity-card__flower" :src="activityFlower" alt="" />
          </span>
          <img class="activity-card__lines" :src="activityLines" alt="" aria-hidden="true" />
          <span v-if="item.isVideo" class="activity-card__play" aria-hidden="true">▶</span>
          <span class="activity-card__copy">
            <strong>{{ item.title }}</strong>
            <span>{{ item.description }}</span>
          </span>
        </RouterLink>
        <p v-if="activityLoading && !activityItems.length" class="activity-state" role="status">
          {{ t('homeActivity.loading') }}
        </p>
        <p v-else-if="!activityLoading && !activityItems.length" class="activity-state" role="status">
          {{ t('homeActivity.empty') }}
        </p>
      </div>

      <button class="activity-more" type="button" @click="goToActivityList">
        {{ t('homeActivity.more') }} <span aria-hidden="true">⟶</span>
      </button>
    </div>
  </section> -->

  <div id="news">
    <HomeSectionHeading :eyebrow="t('homeActivity.en')" :title="t('homeActivity.title')"
      :description="t('homeActivity.subtitle')" />

    <div class="home-events">
      <EventCardsSection class="recent" kind="recent" :title="t('events.recentTitle')" :items="recentActivities"
        :images="recentImages" :loading="recentLoading" :more-to="{ name: 'event-schedule' }" />
    </div>
  </div>


  <section id="milestones" class="milestones-section">
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

  <section class="sxb-box" aria-labelledby="sxb-box-title">
    <div class="sxb-card">
      <header class="sxb-heading">
        <span class="sxb-heading-emblem" aria-hidden="true" />
        <h2 id="sxb-box-title">{{ t('sxbBox.title') }}</h2>
      </header>
      <div class="sxb-copy">
        <p v-for="paragraph in tm('sxbBox.paragraphs')" :key="paragraph">{{ paragraph }}</p>
      </div>
      <button class="sxb-cta" type="button" @click="goToPage('co-build')">
        <span class="sxb-cta-ornament" aria-hidden="true"><img :src="sxbEmblem" alt="" /></span>
        <span>{{ t('sxbBox.cta') }}</span>
        <span class="sxb-cta-ornament" aria-hidden="true"><img :src="sxbEmblem" alt="" /></span>
      </button>
    </div>
  </section>

</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { getDynamicList } from '@/api/dynamic'
import { getMemoirList } from '@/api/memoir'
import { getWishesList } from '@/api/wishes'
import { getActivityList } from '@/api/activity'
import EventCardsSection from '@/components/events/EventCardsSection.vue'
import { formatSchedule, splitList, text } from '@/utils/activityDisplay'
import HomeSectionHeading from './HomeSectionHeading.vue'
import milestonesBackground from '@/assets/cuts/milestones-bg.png'
import milestoneEmblem from '@/assets/cuts/milestone-emblem.png'
import activityUpdate1 from '@/assets/home/activity/card-update-1.png'
import activityUpdate2 from '@/assets/home/activity/card-update-2.png'
import activityStory1 from '@/assets/home/activity/card-story-1.png'
import activityStory2 from '@/assets/home/activity/card-story-2.png'
import activityMessage1 from '@/assets/home/activity/card-message-1.png'
import activityMessage2 from '@/assets/home/activity/card-message-2.png'
import activityTabNews from '@/assets/home/activity/tab-dynamic.svg'
import activityTabTestimonials from '@/assets/home/activity/tab-testimonial.svg'
import activityTabMessages from '@/assets/home/activity/tab-message.svg'
import activityBadge from '@/assets/home/activity/card-badge.svg'
import activityFlower from '@/assets/home/activity/card-flower.png'
import activityLines from '@/assets/home/activity/card-lines.png'
import neutralNews1 from '@/assets/images/news-1.webp'
import neutralNews2 from '@/assets/images/news-2.webp'
import neutralNews3 from '@/assets/images/news-3.webp'
import neutralPortrait1 from '@/assets/images/msg-card-1.webp'
import neutralPortrait2 from '@/assets/images/msg-card-2.webp'
import neutralPortrait3 from '@/assets/images/msg-card-3.webp'
import sxbButtonTexture from '@/assets/home/sxb/panel.webp'
import sxbEmblem from '@/assets/home/sxb/emblem.svg'
import sxbTitleEmblem from '@/assets/home/sxb/union.svg'
import seasonal1 from '@/assets/images/seasonal-scroll-1.webp'
import seasonal2 from '@/assets/images/seasonal-scroll-2.webp'
import seasonal3 from '@/assets/images/seasonal-scroll-3.webp'
import seasonal4 from '@/assets/images/seasonal-scroll-4.webp'
import recent1 from '@/assets/events/recent-1.webp'; import recent2 from '@/assets/events/recent-2.webp'; import recent3 from '@/assets/events/recent-3.webp'; import recent4 from '@/assets/events/recent-4.webp'; import recent5 from '@/assets/events/recent-5.webp'; import recent6 from '@/assets/events/recent-6.webp'
import future1 from '@/assets/events/future-1.webp'; import future2 from '@/assets/events/future-2.webp'; import future3 from '@/assets/events/future-3.webp'; import future4 from '@/assets/events/future-4.webp'; import future5 from '@/assets/events/future-5.webp'; import future6 from '@/assets/events/future-6.webp'

const { t, tm, locale } = useI18n()
const router = useRouter()
// 分类标签顺序与语言包 messages.tabs 一一对应，取值为后端 category 字段的中文类别。
const seasonalImages = [seasonal1, seasonal2, seasonal3, seasonal4]
const seasonalItems = computed(() => tm('seasonal.items'))

const SEASONAL_ROUTES = [
  '/blessings',
  '',
  '/blessings',
  '/blessings',
]

function openSeasonal(index) {
  const target = SEASONAL_ROUTES[index]
  if (target) router.push(target)
}

const activityFallbackImages = computed(() => locale.value === 'zh-CN'
  ? {
    news: [activityUpdate1, activityUpdate2],
    testimonials: [activityStory1, activityStory2],
    messages: [activityMessage2, activityMessage2],
  }
  : {
    news: [neutralNews1, neutralNews2, neutralNews3],
    testimonials: [neutralPortrait1, neutralPortrait2, neutralPortrait3],
    messages: [neutralPortrait1, neutralPortrait2, neutralPortrait3],
  })
const activityTabArt = {
  news: activityTabNews,
  testimonials: activityTabTestimonials,
  messages: activityTabMessages,
}
const activityTabs = computed(() => [
  { key: 'news', label: t('homeActivity.tabs.news'), badge: t('homeActivity.badges.news'), image: activityTabArt.news },
  { key: 'testimonials', label: t('homeActivity.tabs.testimonials'), badge: t('homeActivity.badges.testimonials'), image: activityTabArt.testimonials },
  { key: 'messages', label: t('homeActivity.tabs.messages'), badge: t('homeActivity.badges.messages'), image: activityTabArt.messages },
])
const activeActivityTab = ref('news')
const activityItems = ref([])
const activityLoading = ref(false)
let activityRequestId = 0

const activeActivityBadge = computed(() => (
  activityTabs.value.find((tab) => tab.key === activeActivityTab.value)?.badge || ''
))
// 三个分类的「查看更多」统一进入 /news，列表页按 kind 调用对应接口渲染。
function goToActivityList() {
  router.push({ name: 'news', query: { kind: activeActivityTab.value } })
}

async function loadActivity() {
  const tab = activeActivityTab.value
  const requestId = ++activityRequestId
  activityItems.value = []
  activityLoading.value = true

  try {
    let result
    if (tab === 'news') {
      result = await getDynamicList({ page: 1, pageSize: 6, show: true }, { silent: true })
    } else if (tab === 'testimonials') {
      result = await getMemoirList({ page: 1, pageSize: 6, show: true }, { silent: true })
    } else {
      result = await getWishesList({ page: 1, pageSize: 6, show: true }, { silent: true })
    }

    if (requestId !== activityRequestId) return
    const list = Array.isArray(result) ? result : result?.list
    const fallbacks = activityFallbackImages.value[tab]
    activityItems.value = Array.isArray(list)
      ? list.slice(0, 6).filter((item) => item?.id !== null && item?.id !== undefined).map((item, index) => ({
        id: item.id,
        title: item.title || item.username || '',
        description: item.content || item.detail || '',
        cover: parseWishImages(tab === 'messages' ? item.imgArrUrls : item.cover)[0]
          || fallbacks[index % fallbacks.length],
        kind: tab,
        name: item.username || '',
        role: item.job || '',
        category: item.category || '',
        content: item.content || '',
        detail: item.detail || '',
        wishes: item.wishes || '',
        videoUrl: item.videoUrl || '',
        isVideo: tab === 'messages' && (Number(item.type) === 1 || Boolean(item.videoUrl)),
        createTime: item.createTime || '',
        readNum: item.readNum ?? null,
      }))
      : []
  } catch {
    if (requestId === activityRequestId) activityItems.value = []
  } finally {
    if (requestId === activityRequestId) activityLoading.value = false
  }
}

function activityDetailRoute(item) {
  const query = { id: String(item.id) }
  if (item.kind && item.kind !== 'news') query.kind = item.kind
  return { name: 'news-detail', query }
}

watch(activeActivityTab, loadActivity, { immediate: true })

const milestones = computed(() => tm('milestones.items'))
const milestoneEmblemBackground = 'url("' + milestoneEmblem + '")'
const sxbButtonTextureBackground = 'url("' + sxbButtonTexture + '")'
const sxbTitleEmblemBackground = 'url("' + sxbTitleEmblem + '")'
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

function goToPage(name) {
  router.push({ name })
}

// 道会活动列表：与道会页共用接口、卡片组件与路由（近期回顾 / 未来预告）。
const PAGE_SIZE = 6
const recentImages = [recent1, recent2, recent3, recent4, recent5, recent6]
const futureImages = [future1, future2, future3, future4, future5, future6]
const recentLoading = ref(true)
const futureLoading = ref(true)
const recentActivities = ref([])
const futureActivities = ref([])

function mapActivity(item, index, images) {
  const pictures = splitList(item.pictureUrls)
  return {
    id: item.id ?? null,
    title: text(item.title),
    date: text(item.subTitle) || formatSchedule(item),
    desc: text(item.intro),
    tags: splitList(item.tag),
    image: pictures[0] || images[index % images.length],
  }
}

async function loadActivities(isFuture, images) {
  const result = await getActivityList({ isFuture, page: 1, pageSize: PAGE_SIZE }, { silent: true })
  const list = Array.isArray(result) ? result : result?.list
  if (!Array.isArray(list)) return []
  return list
    .filter((item) => Number(item?.type) !== 2)
    .map((item, index) => mapActivity(item, index, images))
}

async function loadEventSection(isFuture, images, target, loading) {
  try {
    target.value = await loadActivities(isFuture, images)
  } catch {
    // 接口失败或 data 为 null 时按暂无数据处理。
    target.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEventSection(0, recentImages, recentActivities, recentLoading)
  loadEventSection(1, futureImages, futureActivities, futureLoading)
})
</script>

<style scoped>
.seasonal-section {
  /* 文案长度随语言变化：区块高度由内容撑开，设计稿高度仅作下限。 */
  min-height: 843px;
  padding-top: 0;
  background: transparent;
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
  display: flex;
  flex-direction: column;
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

/* 卡片内容纵向排列：徽章、标题、正文、按钮自上而下对齐；正文不拉伸，避免按钮被挤到卷轴外。 */
.seasonal-card>div {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 64px 24px 60px;
  text-align: center;
}

.seasonal-card strong {
  display: grid;
  flex: 0 0 auto;
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
  flex: 0 0 auto;
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
  flex: 0 0 auto;
  width: 100%;
  min-height: 121px;
  margin: 35px auto 0;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  line-height: 25px;
  text-align: center;
}

.seasonal-card button {
  display: block;
  flex: 0 0 auto;
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

.activity-section {
  position: relative;
  z-index: 1;
  padding: 72px 24px 38px;
  overflow: hidden;
  background: #f5f1ea;
}

.activity-section .section-content {
  width: min(100%, 1240px);
  /* 宽屏下内容区靠 margin 居中，否则整块会贴着左侧（与里程碑区块保持一致）。 */
  margin-inline: auto;
}

.activity-section :deep(.section-heading) {
  margin-bottom: 36px;
}

.activity-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin: 0 0 43px;
}

.activity-tab {
  position: relative;
  display: inline-grid;
  min-width: 118px;
  min-height: 36px;
  place-items: center;
  padding: 0 22px;
  color: #fed8ae;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  letter-spacing: 1.6px;
  background: transparent;
  border: 0;
  cursor: pointer;
  isolation: isolate;
  transition: transform .2s ease, filter .2s ease;
}

.activity-tab img {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
}

.activity-tab--messages {
  min-width: 140px;
}

.activity-tab--news img {
  filter: brightness(1.55) saturate(1.2);
}

.activity-tab--news[aria-selected='true'] img {
  filter: none;
}

.activity-tab--testimonials[aria-selected='true'] img,
.activity-tab--messages[aria-selected='true'] img {
  filter: brightness(.62) saturate(1.15);
}

.activity-tab span {
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

@media (hover: hover) and (pointer: fine) {
  .activity-tab:hover {
    transform: translateY(-1px);
  }
}

.activity-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px 50px;
}

.activity-card {
  position: relative;
  display: block;
  aspect-ratio: 19 / 14;
  min-width: 0;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  background: #6d4b30;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgb(61 44 25 / 12%);
  isolation: isolate;
  transition: transform .28s ease, box-shadow .28s ease;
}

.activity-card:focus-visible {
  outline: 2px solid #bf5a31;
  outline-offset: 3px;
}

@media (hover: hover) and (pointer: fine) {
  .activity-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 32px rgb(61 44 25 / 20%);
  }

  .activity-card:hover .activity-card__image {
    transform: scale(1.04);
  }
}

.activity-card__image,
.activity-card__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.activity-card__image {
  object-fit: cover;
  transition: transform .45s ease;
}

.activity-card__shade {
  z-index: 1;
  background: linear-gradient(180deg, rgb(21 19 15 / 0%) 41%, rgb(24 21 18 / 36%) 62%, rgb(20 19 18 / 92%) 100%);
}

.activity-card__badge {
  position: absolute;
  z-index: 2;
  top: 13.6%;
  left: 10.5%;
  display: block;
  width: 38px;
  height: 133px;
}

.activity-card__badge-shape {
  position: absolute;
  inset: 0;
  display: block;
}

.activity-card__badge-text {
  position: absolute;
  top: 13px;
  left: 10px;
  display: block;
  width: 18px;
  height: 88px;
  overflow: hidden;
  color: #805c2b;
  font-family: 'Songti SC', 'Noto Serif CJK SC', serif;
  font-size: var(--badge-font-size);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 1.8px;
  text-align: center;
  writing-mode: vertical-rl;
  text-orientation: upright;
  white-space: nowrap;
}

.activity-card__flower {
  position: absolute;
  top: 108px;
  left: 9px;
  display: block;
}

.activity-card__lines {
  position: absolute;
  z-index: 2;
  top: calc(13.6% + 52px);
  left: calc(10.5% + 46px);
  display: block;
}

.activity-card__play {
  position: absolute;
  z-index: 2;
  top: 37%;
  left: 50%;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  padding-left: 3px;
  color: #fff;
  font-size: 14px;
  background: rgb(29 78 110 / 72%);
  border: 1px solid rgb(255 255 255 / 86%);
  border-radius: 50%;
  transform: translateX(-50%);
}

.activity-card__copy {
  position: absolute;
  z-index: 2;
  right: 20px;
  bottom: 18px;
  left: 20px;
  display: grid;
  gap: 7px;
}

.activity-card__copy strong {
  display: -webkit-box;
  overflow: hidden;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 1.4px;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.activity-card__copy>span {
  display: -webkit-box;
  overflow: hidden;
  color: rgb(255 255 255 / 93%);
  font-size: 12px;
  line-height: 1.65;
  letter-spacing: .7px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.activity-state {
  grid-column: 1 / -1;
  display: grid;
  min-height: 280px;
  place-items: center;
  margin: 0;
  color: #8f806f;
  font-size: 15px;
  letter-spacing: 1px;
}

.activity-more {
  display: flex;
  min-width: 134px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin: 30px auto 0;
  padding: 6px 20px;
  color: #713421;
  font-family: var(--font-calligraphy);
  font-size: 15px;
  letter-spacing: 1px;
  background: #f8ead7;
  border: 1px solid #bd694d;
  border-radius: 99px;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 78%);
  cursor: pointer;
  transition: background-color .2s ease, transform .2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .activity-more:hover {
    background-color: #fbe0bf;
    transform: translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {

  .activity-tab,
  .activity-card,
  .activity-card__image,
  .activity-more {
    transition: none;
  }
}

.milestones-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  z-index: 4;
  height: 566px;
  padding-top: 69px;
  background: #f8f5ed;
}

.milestones-section>img {
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.milestones-section .section-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
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
  .activity-section {
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

  .activity-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

  .activity-card-grid {
    grid-template-columns: 1fr;
  }

  .activity-section {
    padding: 56px 16px 32px;
  }

  .activity-tabs {
    gap: 6px;
    margin-bottom: 28px;
  }

  .activity-tab,
  .activity-tab--messages {
    min-width: 0;
    padding: 0 15px;
    font-size: 14px;
    letter-spacing: 1px;
  }

  .activity-card__badge {
    left: 9%;
  }

  .activity-card__lines {
    left: calc(9% + 46px);
  }

  .activity-card__copy strong {
    font-size: 17px;
  }

  .quote {
    min-height: auto;
  }

  .seasonal-card p {
    min-height: auto;
  }
}

.sxb-box {
  position: relative;
  z-index: 4;
  padding: 0px 24px 88px;
  background: #f8f5ed;
}

.sxb-card {
  display: flex;
  width: min(1240px, 100%);
  flex-direction: column;
  gap: 0;
  margin: 0 auto;
  padding: 40px 70px;
  color: #333;
  background: #fff;
  border-radius: 40px;
}

.sxb-heading {
  position: relative;
  display: grid;
  min-height: 120px;
  place-items: center;
  isolation: isolate;
}

.sxb-heading-emblem {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 50%;
  width: 138px;
  height: 120px;
  background: v-bind(sxbTitleEmblemBackground) center / contain no-repeat;
  opacity: .2;
  transform: translateX(-50%);
}

.sxb-heading h2 {
  margin: 35px 0 0;
  color: #333;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 3.2px;
  text-align: center;
}

.sxb-copy {
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 1.6px;
  text-align: justify;
}

.sxb-copy p {
  margin: 0;
}

.sxb-copy p+p {
  margin-top: 24px;
}

.sxb-cta {
  position: relative;
  display: flex;
  width: min(520px, 100%);
  height: 56px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  align-self: center;
  margin-top: 40px;
  overflow: hidden;
  padding: 0 20px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 24px;
  line-height: 1;
  background: linear-gradient(105deg, #cc3513, #981c04);
  border: 2px solid #c29f79;
  border-radius: 100px;
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, .12);
  cursor: pointer;
  transition: filter .2s ease, transform .2s ease;
}

.sxb-cta::before {
  position: absolute;
  inset: 3px;
  content: '';
  background: v-bind(sxbButtonTextureBackground) center / cover;
  border: 1px solid rgba(194, 159, 121, .8);
  border-radius: inherit;
  opacity: .24;
  pointer-events: none;
}

.sxb-cta>span {
  position: relative;
  z-index: 1;
}

.sxb-cta-ornament {
  display: grid;
  width: 10px;
  height: 10px;
  place-items: center;
  flex: 0 0 10px;
  border-top: 1px solid #d9bb99;
  border-left: 1px solid #d9bb99;
  transform: rotate(-45deg);
}

.sxb-cta-ornament img {
  display: block;
  width: 3px;
  height: 3px;
  transform: rotate(45deg);
}

@media (hover: hover) and (pointer: fine) {
  .sxb-cta:hover {
    filter: brightness(1.08);
    transform: translateY(-2px);
  }
}

html[data-locale-layout='international'] .sxb-heading h2 {
  max-width: min(760px, 100%);
  font-family: var(--font-serif-cn);
  font-size: 28px;
  letter-spacing: 0;
}

html[data-locale-layout='international'] .sxb-copy {
  font-family: var(--font-serif-cn);
  line-height: 1.7;
  letter-spacing: 0;
  text-align: left;
}

html[data-locale-layout='international'] .sxb-cta {
  font-size: 18px;
}

@media (max-width: 760px) {
  .sxb-box {
    padding: 40px 16px 60px;
  }

  .sxb-card {
    gap: 0;
    padding: 30px 24px;
    border-radius: 24px;
  }

  .sxb-heading {
    min-height: 100px;
  }

  .sxb-heading-emblem {
    width: 118px;
    height: 100px;
  }

  .sxb-heading h2 {
    margin-top: 25px;
    font-size: 26px;
    letter-spacing: 1.5px;
  }

  .sxb-copy {
    font-size: 14px;
    line-height: 1.8;
    letter-spacing: .5px;
  }

  .sxb-copy p+p {
    margin-top: 18px;
  }

  .sxb-cta {
    height: 52px;
    margin-top: 28px;
    font-size: 20px;
  }
}

@media (max-width: 430px) {
  .sxb-card {
    padding-inline: 18px;
  }

  .sxb-heading h2 {
    font-size: 23px;
  }

  html[data-locale-layout='international'] .sxb-heading h2 {
    font-size: 22px;
  }

  html[data-locale-layout='international'] .sxb-cta {
    font-size: 16px;
  }
}

/* 首页道会活动：只保留内容区域（卡片列表），隐藏子组件自带的两个章节标题。 */
.home-events :deep(.event-section > .ornate-heading) {
  display: none;
}

.home-events :deep(.event-section.recent),
.home-events :deep(.event-section.future) {
  position: relative;
  top: auto;
  left: auto;
  width: min(1240px, calc(100% - 48px));
  padding: 0;
  margin: 80px auto 0;
  transform: none;
}

.home-events :deep(.event-grid) {
  grid-template-columns: repeat(3, minmax(0, 380px));
  justify-content: space-between;
  gap: 30px 40px;
  margin-top: 0;
}

@media (max-width: 1100px) {
  .home-events :deep(.event-grid) {
    grid-template-columns: repeat(2, minmax(0, 380px));
    justify-content: center;
  }
}

@media (max-width: 850px) {
  .home-events :deep(.event-section.recent),
  .home-events :deep(.event-section.future) {
    width: calc(100% - 40px);
    margin-top: 58px;
  }

  .home-events :deep(.event-grid) {
    grid-template-columns: minmax(0, 380px);
  }
}
</style>
