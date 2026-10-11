<template>
  <!-- 神殿规划卡片：同一条文案按索引匹配边框切图与实景图片。 -->
  <section id="temple-plan" class="temple-plan" aria-labelledby="temple-title">
    <HomeSectionHeading
      id="temple-title"
      :eyebrow="t('templePlan.en')"
      :title="t('templePlan.title')"
      :description="t('templePlan.subtitle')"
    />

    <div class="temple-grid">
      <article
        v-for="(card, index) in templeCards"
        :key="card.title"
        class="temple-card"
        :class="{ 'temple-card-first': index === 0 }"
      >
        <img class="temple-card-frame" :src="cardFrames[index]" alt="" />
        <img class="temple-card-photo" :src="cardPhotos[index]" :alt="card.title" />
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HomeSectionHeading from './HomeSectionHeading.vue'
import frameRed from '@/assets/cuts/temple-card-red.png'
import frameBlue from '@/assets/cuts/temple-card-blue.png'
import frameGreen from '@/assets/cuts/temple-card-green.png'
import frameIndigo from '@/assets/cuts/temple-card-indigo.png'
import templePhoto1 from '@/assets/images/temple-icon-1.webp'
import templePhoto2 from '@/assets/images/temple-icon-2.webp'
import templePhoto3 from '@/assets/images/temple-icon-3.webp'
import templePhoto4 from '@/assets/images/temple-icon-4.webp'

const { t, tm } = useI18n()
// 装饰框和实景图顺序均对应语言包中的 templePlan.cards。
const cardFrames = [frameRed, frameBlue, frameGreen, frameIndigo]
const cardPhotos = [templePhoto1, templePhoto2, templePhoto3, templePhoto4]
// 统一组件所需的 description 字段，隔离语言包内部使用的 desc 命名。
const templeCards = computed(() =>
  tm('templePlan.cards').map((card) => ({
    title: card.title,
    description: card.desc,
  })),
)
</script>

<style scoped>
.temple-plan {
  position: absolute;
  top: 1173px;
  left: 50%;
  width: 1440px;
  height: 661px;
  transform: translateX(-50%);
}

.temple-plan :deep(.section-heading) {
  position: absolute;
  top: 55px;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.temple-plan :deep(.section-heading p) { margin-bottom: 2px; }
.temple-plan :deep(.section-heading .description) { margin-top: 6px; }

.temple-grid {
  position: absolute;
  top: 220px;
  left: 129px;
  display: grid;
  grid-template-columns: repeat(4, 280px);
  gap: 20px;
}

.temple-card {
  position: relative;
  width: 280px;
  height: 436px;
  color: #fff;
  text-align: center;
}

.temple-card-first { top: -5px; height: 441px; }

.temple-card-frame {
  position: absolute;
  inset: 0;
  width: 280px;
  height: 436px;
  object-fit: fill;
}

.temple-card-first .temple-card-frame { height: 441px; }

.temple-card-photo {
  position: absolute;
  top: 5px;
  left: 35px;
  width: 210px;
  height: 210px;
  object-fit: cover;
  border-radius: 50%;
}

.temple-card h3 {
  position: absolute;
  top: 237px;
  left: 17px;
  width: 246px;
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 1.15;
  white-space: nowrap;
}

.temple-card p {
  position: absolute;
  top: 295px;
  left: 23px;
  width: 234px;
  height: 116px;
  margin: 0;
  overflow: hidden;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

@media (max-width: 900px) {
  .temple-plan { position: relative; top: auto; left: auto; width: 100%; height: auto; padding: 65px 20px 80px; transform: none; }
  .temple-plan :deep(.section-heading), .temple-grid { position: relative; inset: auto; }
  .temple-plan :deep(.section-heading) { margin-bottom: 55px; }
  .temple-grid { grid-template-columns: repeat(2, 280px); justify-content: center; gap: 44px 20px; }
}

@media (max-width: 620px) {
  .temple-grid { grid-template-columns: 280px; }
}
</style>
