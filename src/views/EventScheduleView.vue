<template>
  <div class="schedule-page">
    <HomeHeader @select-locale="setLocale" />
    <main class="schedule-main" :aria-busy="loading">
      <nav class="crumb" :aria-label="t('events.hero.title')">
        <RouterLink :to="{ name: 'home' }">{{ t('portal.common.home') }}</RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink :to="{ name: 'events' }">{{ t('events.hero.title') }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ t('events.schedule.breadcrumb') }}</span>
      </nav>
      <header class="schedule-heading">
        <p>{{ t('events.schedule.eyebrow') }}</p>
        <h1>{{ isFuture ? t('events.schedule.futureTitle') : t('events.schedule.title') }}</h1>
        <small>{{ isFuture ? t('events.schedule.futureSubtitle') : t('events.schedule.subtitle') }}</small>
      </header>

      <p v-if="loading" class="visually-hidden">{{ t('events.loading') }}</p>
      <div v-if="loading" class="schedule-grid" aria-hidden="true">
        <div v-for="index in pageSize" :key="`skeleton-${index}`" class="schedule-skeleton">
          <span class="sk-media" />
          <span class="sk-title" />
          <span class="sk-date" />
          <span class="sk-desc" />
          <span class="sk-button" />
        </div>
      </div>
      <div v-else-if="items.length" class="schedule-grid">
        <EventCard v-for="(item, index) in items" :key="item.id || `schedule-${index}`" :item="item"
          :image="item.image" :details="t('events.details')" />
      </div>
      <EmptyData v-else :label="t('events.empty')" />

      <nav v-if="!loading && totalCount > 0" class="pager" :aria-label="t('events.schedule.pagination')">
        <button type="button" :disabled="page <= 1" @click="go(page - 1)">‹ {{ t('events.schedule.previous') }}</button>
        <span>{{ t('events.schedule.pageInfo', { current: page, total: totalPages }) }}</span>
        <span>{{ t('events.schedule.total', { count: totalCount }) }}</span>
        <button type="button" :disabled="page >= totalPages" @click="go(page + 1)">{{ t('events.schedule.next') }} ›</button>
      </nav>
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import { getActivityList } from '@/api/activity'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import EventCard from '@/components/events/EventCard.vue'
import EmptyData from '@/components/common/EmptyData.vue'
import { formatSchedule, splitList, text } from '@/utils/activityDisplay'
import recent1 from '@/assets/events/recent-1.webp'; import recent2 from '@/assets/events/recent-2.webp'; import recent3 from '@/assets/events/recent-3.webp'; import recent4 from '@/assets/events/recent-4.webp'; import recent5 from '@/assets/events/recent-5.webp'; import recent6 from '@/assets/events/recent-6.webp'
import future1 from '@/assets/events/future-1.webp'; import future2 from '@/assets/events/future-2.webp'; import future3 from '@/assets/events/future-3.webp'; import future4 from '@/assets/events/future-4.webp'; import future5 from '@/assets/events/future-5.webp'; import future6 from '@/assets/events/future-6.webp'

const pageSize = 9
const recentImages = [recent1, recent2, recent3, recent4, recent5, recent6]
const futureImages = [future1, future2, future3, future4, future5, future6]
const props = defineProps({ isFuture: { type: Number, default: 0 } })
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const loading = ref(true)
const items = ref([])
const totalCount = ref(0)
const totalPages = ref(1)

const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const images = computed(() => props.isFuture ? futureImages : recentImages)

function mapActivity(item, index) {
  const pictures = splitList(item.pictureUrls)
  return {
    id: item.id ?? null,
    title: text(item.title),
    date: text(item.subTitle) || formatSchedule(item),
    desc: text(item.intro),
    tags: splitList(item.tag),
    image: pictures[0] || images.value[index % images.value.length],
  }
}

function readPage(result, list) {
  const totalRow = Number(result?.totalRow ?? result?.total ?? result?.totalCount)
  const pageCount = Number(result?.totalPage ?? result?.pages ?? result?.pageCount)
  const total = Number.isFinite(totalRow) && totalRow >= 0 ? totalRow : list.length
  const pages = Number.isFinite(pageCount) && pageCount > 0 ? pageCount : Math.max(1, Math.ceil(total / pageSize))
  return { total, pages }
}

async function load() {
  loading.value = true
  items.value = []
  try {
    const result = await getActivityList({ isFuture: props.isFuture, page: page.value, pageSize }, { silent: true })
    const list = Array.isArray(result) ? result : result?.list || result?.records || result?.rows
    if (!Array.isArray(list)) throw new Error('empty')
    const visible = list.filter((item) => Number(item?.type) !== 2)
    items.value = visible.map(mapActivity)
    const counted = readPage(result, list)
    totalCount.value = counted.total
    totalPages.value = counted.pages
  } catch {
    items.value = []
    totalCount.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

function go(next) {
  if (next < 1 || next > totalPages.value || next === page.value) return
  router.push({ name: route.name, query: next === 1 ? {} : { page: String(next) } })
}

watch(() => [props.isFuture, page.value], load, { immediate: true })
const setLocale = (locale) => setAppLocale(locale)
</script>

<style scoped>
.schedule-page { min-width: 320px; overflow-x: clip; color: #333; background: #f8f4ec; }
.schedule-page :deep(.site-header) { background-image: linear-gradient(rgba(29, 78, 110, .9), rgba(29, 78, 110, .9)), url('@/assets/blessings/header-texture.webp'); background-position: center; background-size: cover; }
.schedule-main { width: min(1180px, calc(100% - 48px)); margin: 0 auto; padding: 28px 0 88px; }
.crumb { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 28px; color: #9d7a55; font-size: 14px; }
.crumb a { color: inherit; text-decoration: none; }
.crumb a:hover { color: #6d4e32; }
.schedule-heading { margin-bottom: 36px; text-align: center; }
.schedule-heading p { margin: 0; color: #d0a06d; font: 18px/1.4 var(--font-serif, 'Songti SC', serif); letter-spacing: 1px; }
.schedule-heading h1 { margin: 10px 0 8px; color: #1d4e6e; font: 40px/1.25 var(--font-calligraphy); font-weight: 400; letter-spacing: 2px; }
.schedule-heading small { color: #6f675e; font-size: 15px; }
.schedule-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px 32px; }
.pager { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 18px 28px; margin-top: 42px; color: #8a7764; font-size: 14px; }
.pager button { padding: 0; color: inherit; font: inherit; background: none; border: 0; cursor: pointer; }
.pager button:disabled { color: #c4b8aa; cursor: default; }
.pager button:not(:disabled):hover { color: #cc3513; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.schedule-skeleton { position: relative; height: 420px; overflow: hidden; background: #fff; border-radius: 12px; }
.schedule-skeleton span { position: absolute; display: block; overflow: hidden; background: #f3efe8; border-radius: 6px; }
.schedule-skeleton span::after { position: absolute; inset: 0; content: ''; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .75), transparent); transform: translateX(-100%); animation: schedule-shimmer 1.3s ease-in-out infinite; }
.sk-media { inset: 0 0 auto; height: 247px; border-radius: 12px 12px 0 0; }
.sk-title { top: 206px; right: 19px; left: 19px; height: 18px; }
.sk-date { top: 232px; left: 19px; width: 42%; height: 12px; }
.sk-desc { top: 268px; right: 19px; left: 19px; height: 48px; }
.sk-button { top: 366px; left: 19px; width: 137px; height: 36px; border-radius: 999px; }
@keyframes schedule-shimmer { to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) {
  .schedule-skeleton span::after { animation: none; }
}
@media (max-width: 1100px) {
  .schedule-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .schedule-main { width: calc(100% - 32px); }
  .schedule-heading h1 { font-size: 32px; }
  .schedule-grid { grid-template-columns: minmax(0, 1fr); justify-items: center; }
  .schedule-grid :deep(.event-card) { width: min(100%, 380px); }
}
</style>
