<template>
  <!-- 活动卡片区：近期与预告共用本组件，kind 决定纵向定位与配色。 -->
  <section class="event-section" :class="kind">
    <OrnateSectionHeading :title="title" />
    <div v-if="loading" class="event-grid" aria-busy="true">
      <p class="event-sr-only">{{ t('events.loading') }}</p>
      <div v-for="index in skeletonCount" :key="`${kind}-skeleton-${index}`" class="event-skeleton" aria-hidden="true">
        <span class="event-skeleton-media" />
        <span class="event-skeleton-title" />
        <span class="event-skeleton-date" />
        <span class="event-skeleton-desc" />
        <span class="event-skeleton-tags"><i /><i /><i /></span>
        <span class="event-skeleton-button" />
      </div>
    </div>
    <div v-else-if="items.length" class="event-grid">
      <EventCard v-for="(item, index) in items" :key="item.id || `${kind}-${index}`" :item="item"
        :image="item.image || images[index % images.length]" :details="t('events.details')" />
    </div>
    <EmptyData v-else :label="t('events.empty')" />
    <RouterLink v-if="!loading && items.length" class="more-button" :to="moreTo">{{ t('events.more') }} </RouterLink>
  </section>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import EventCard from './EventCard.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import EmptyData from '@/components/common/EmptyData.vue'
// kind 取 recent / future；items 与 images 由父级按同一顺序传入。moreTo 指向对应的分页日程。
defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  images: { type: Array, required: true },
  kind: { type: String, required: true },
  loading: { type: Boolean, default: false },
  moreTo: { type: [String, Object], required: true },
})
const skeletonCount = 6
const { t } = useI18n()
</script>
<style scoped>
/* 绝对定位到页面指定高度，窄屏再改回常规文档流。 */
.event-section {
  position: absolute;
  z-index: 2;
  left: 50%;
  width: 1240px;
  transform: translateX(-50%);
}

/* 近期、预告两块在设计稿中的固定纵向位置。 */
.event-section.recent {
  top: 1238px;
}

.event-section.future {
  top: 2377px;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(3, 380px);
  gap: 30px 50px;
  margin-top: -15px;
}

.more-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 140px;
  height: 36px;
  margin: 30px auto 0;
  color: #fff;
  font: 16px/1 var(--font-calligraphy);
  text-decoration: none;
  cursor: pointer;
  background: #cc3513 url('@/assets/blessings/button-texture.png') center/100% 100%;
  border: 1px solid #c29f79;
  border-radius: 999px;
  box-shadow: 0 7px 10px rgba(147, 54, 20, .18);
}

.more-button span {
  font-size: 23px;
  line-height: 1;
}

.event-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.event-skeleton {
  position: relative;
  height: 420px;
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
}

.event-skeleton span,
.event-skeleton i {
  position: absolute;
  display: block;
  overflow: hidden;
  background: #f3efe8;
  border-radius: 6px;
}

.event-skeleton span::after,
.event-skeleton i::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .75), transparent);
  transform: translateX(-100%);
  animation: event-shimmer 1.3s ease-in-out infinite;
}

.event-skeleton-media { inset: 0 0 auto; height: 247px; border-radius: 12px 12px 0 0; }
.event-skeleton-title { top: 206px; right: 19px; left: 19px; height: 18px; }
.event-skeleton-date { top: 232px; left: 19px; width: 42%; height: 12px; }
.event-skeleton-desc { top: 268px; right: 19px; left: 19px; height: 48px; }
.event-skeleton-tags { top: 328px; left: 19px; width: 210px; height: 18px; background: transparent; }
.event-skeleton-tags::after { content: none; }
.event-skeleton-tags i { position: relative; display: inline-block; width: 60px; height: 18px; margin-right: 10px; }
.event-skeleton-button { top: 366px; left: 19px; width: 137px; height: 36px; border-radius: 999px; }

@keyframes event-shimmer {
  to { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .event-skeleton span::after,
  .event-skeleton i::after { animation: none; }
}

@media (max-width:1100px) {
  .event-section {
    position: relative;
    top: auto !important;
    left: auto;
    width: auto;
    padding: 58px 24px 0;
    transform: none;
  }

  .event-grid {
    grid-template-columns: repeat(2, 380px);
    justify-content: center;
  }
}

@media (max-width:850px) {
  .event-grid {
    grid-template-columns: minmax(280px, 380px);
  }
}
</style>
