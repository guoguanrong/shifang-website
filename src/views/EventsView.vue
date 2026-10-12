<template>
  <div class="events-page">
    <HomeHeader @select-locale="setLocale" />
    <main class="events-stage">
      <EventsHero />
      <EventOpportunities />
      <EventCardsSection class="recent" kind="recent" :title="t('events.recentTitle')" :items="recentActivities"
        :images="recentImages" :loading="recentLoading" :more-to="{ name: 'event-schedule' }" />
      <EventCardsSection class="future" kind="future" :title="t('events.futureTitle')" :items="futureActivities"
        :images="futureImages" :loading="futureLoading" :more-to="{ name: 'event-schedule-future' }" />
    </main>
    <HomeFooter />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import { getActivityList } from '@/api/activity'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import EventsHero from '@/components/events/EventsHero.vue'
import EventOpportunities from '@/components/events/EventOpportunities.vue'
import EventCardsSection from '@/components/events/EventCardsSection.vue'
import { formatSchedule, splitList, text } from '@/utils/activityDisplay'
import recent1 from '@/assets/events/recent-1.webp'; import recent2 from '@/assets/events/recent-2.webp'; import recent3 from '@/assets/events/recent-3.webp'; import recent4 from '@/assets/events/recent-4.webp'; import recent5 from '@/assets/events/recent-5.webp'; import recent6 from '@/assets/events/recent-6.webp'
import future1 from '@/assets/events/future-1.webp'; import future2 from '@/assets/events/future-2.webp'; import future3 from '@/assets/events/future-3.webp'; import future4 from '@/assets/events/future-4.webp'; import future5 from '@/assets/events/future-5.webp'; import future6 from '@/assets/events/future-6.webp'

const PAGE_SIZE = 6
const recentImages = [recent1, recent2, recent3, recent4, recent5, recent6]
const futureImages = [future1, future2, future3, future4, future5, future6]
const { t } = useI18n()
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

async function loadSection(isFuture, images, target, loading) {
  try {
    target.value = await loadActivities(isFuture, images)
  } catch {
    // 1002 等失败，以及 data 为 null，都按暂无数据处理。
    target.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSection(0, recentImages, recentActivities, recentLoading)
  loadSection(1, futureImages, futureActivities, futureLoading)
})

const setLocale = (locale) => setAppLocale(locale)
</script>
<style scoped>
.events-page {
  min-width: 320px;
  overflow-x: clip;
  color: #333;
  background: #f3f0e9;
}

.events-stage {
  position: relative;
  width: 100%;
  padding-bottom: 60px;
  isolation: isolate;
  margin-inline: auto;
  background: #f3f0e9;
}

.events-page :deep(.site-header) {
  background-image: linear-gradient(rgba(29, 78, 110, .9), rgba(29, 78, 110, .9)), url('@/assets/blessings/header-texture.webp');
  background-position: center;
  background-size: cover;
}

@media (min-width:1281px) {

  .events-page :deep(.site-header),
  .events-page :deep(.site-footer) {
    /* padding-inline: max(100px, calc((100vw - 1440px)/2)); */
  }


}

@media (max-width:1100px) {
  .events-stage {
    height: auto;
    padding-bottom: 70px;
    background-size: auto 1100px;
  }
}
/* 两个顶部模块改为自然流，后续列表随翻译长度顺延，保留原稿 80px 章节间隔。 */
.events-stage :deep(.event-section) { position: relative; top: auto; left: auto; width: min(1240px, calc(100% - 48px)); padding: 0; margin: 80px auto 0; transform: none; }
.events-stage :deep(.event-grid) { grid-template-columns: repeat(3, minmax(0, 380px)); justify-content: space-between; gap: 30px 40px; }
@media (max-width: 1100px) {
  .events-stage :deep(.event-grid) { grid-template-columns: repeat(2, minmax(0, 380px)); justify-content: center; }
}
@media (max-width: 850px) {
  .events-stage :deep(.event-section) { width: calc(100% - 40px); margin-top: 58px; }
  .events-stage :deep(.event-grid) { grid-template-columns: minmax(0, 380px); }
}
</style>
