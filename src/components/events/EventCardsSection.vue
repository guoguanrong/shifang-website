<template>
  <!-- 活动卡片区：近期与预告共用本组件，kind 决定纵向定位与配色。 -->
  <section class="event-section" :class="kind">
    <OrnateSectionHeading :title="title" />
    <div class="event-grid">
      <EventCard v-for="(item, index) in items" :key="`${kind}-${index}`" :item="item" :image="images[index]"
        :details="t('events.details')" />
    </div>
    <button class="more-button" type="button">{{ t('events.more') }} <span>→</span></button>
  </section>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import EventCard from './EventCard.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
// kind 取 recent / future；items 与 images 由父级按同一顺序传入。
defineProps({ title: { type: String, required: true }, items: { type: Array, required: true }, images: { type: Array, required: true }, kind: { type: String, required: true } })
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
