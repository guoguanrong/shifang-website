<template>
  <div class="events-page">
    <HomeHeader @select-locale="setLocale" />
    <main class="events-stage">
      <EventsHero />
      <EventOpportunities />
      <EventCardsSection class="recent" kind="recent" :title="t('events.recentTitle')" :items="recentItems"
        :images="recentImages" />
      <EventCardsSection class="future" kind="future" :title="t('events.futureTitle')" :items="futureItems"
        :images="futureImages" />
    </main>
    <HomeFooter />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import EventsHero from '@/components/events/EventsHero.vue'
import EventOpportunities from '@/components/events/EventOpportunities.vue'
import EventCardsSection from '@/components/events/EventCardsSection.vue'
import recent1 from '@/assets/events/recent-1.webp'; import recent2 from '@/assets/events/recent-2.webp'; import recent3 from '@/assets/events/recent-3.webp'; import recent4 from '@/assets/events/recent-4.webp'; import recent5 from '@/assets/events/recent-5.webp'; import recent6 from '@/assets/events/recent-6.webp'
import future1 from '@/assets/events/future-1.webp'; import future2 from '@/assets/events/future-2.webp'; import future3 from '@/assets/events/future-3.webp'; import future4 from '@/assets/events/future-4.webp'; import future5 from '@/assets/events/future-5.webp'; import future6 from '@/assets/events/future-6.webp'
const recentImages = [recent1, recent2, recent3, recent4, recent5, recent6]
const futureImages = [future1, future2, future3, future4, future5, future6]
const { t, tm } = useI18n()
const recentItems = computed(() => tm('events.cards'))
const futureItems = computed(() => tm('events.futureCards'))
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
