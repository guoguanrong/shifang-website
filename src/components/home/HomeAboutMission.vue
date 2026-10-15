<template>
  <!-- 宣纸背景容器串联“关于我们”和“神殿规划”两个连续模块。 -->
  <div class="heritage-stage">
    <img class="heritage-paper" :src="templeStageBackground" alt="" />

    <!-- 关于我们：标题、经典引文、机构介绍与实景图。 -->
    <section id="about" class="about-section" aria-labelledby="about-title">
      <HomeSectionHeading
        id="about-title"
        :eyebrow="t('about.en')"
        :title="t('about.title')"
        :description="t('about.subtitle')"
      />

      <div class="about-scroll">
        <img :src="aboutScroll" alt="" />
        <blockquote>
          <p>{{ t('about.quote') }}</p>
          <cite>{{ t('about.quoteSource') }}</cite>
        </blockquote>
      </div>

      <div class="about-slab about-slab-left" />
      <div class="about-slab about-slab-right" />

      <div class="about-copy">
        <h3>{{ t('about.lead[0]') }}</h3>
        <p class="about-lead">{{ t('about.lead[1]') }}</p>
        <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
      </div>

      <div class="about-photo-frame">
        <img :src="aboutTemple" alt="斗姆元君大殿实景" />
      </div>
    </section>

    <!-- 神殿规划沿用同一舞台背景，保持两个区域视觉连续。 -->
    <HomeTemplePlan />
  </div>

  <!-- 使命愿景：三张图文卡分别展示使命、愿景和核心价值。 -->
  <section id="mission" class="mission-section" aria-labelledby="mission-title">
    <img class="mission-clouds" :src="missionClouds" alt="" />
    <div class="mission-content">
      <HomeSectionHeading
        id="mission-title"
        :eyebrow="t('mission.en')"
        :title="t('mission.title')"
        :description="t('mission.subtitle')"
      />
      <div class="mission-grid">
        <article v-for="(item, index) in missionItems" :key="item.title">
          <img :src="missionIcons[index]" alt="" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HomeSectionHeading from './HomeSectionHeading.vue'
import HomeTemplePlan from './HomeTemplePlan.vue'
import templeStageBackground from '@/assets/cuts/temple-stage-bg.webp'
import aboutScroll from '@/assets/images/wenbanck.png'
import aboutTemple from '@/assets/cuts/about-temple.webp'
import aboutPattern from '@/assets/cuts/about-pattern.webp'
import missionClouds from '@/assets/cuts/mission-clouds.png'
import missionWay from '@/assets/cuts/mission-way.png'
import missionKindness from '@/assets/cuts/mission-kindness.png'
import missionTrust from '@/assets/cuts/mission-trust.png'

const { t, tm } = useI18n()
// tm 返回语言包中的数组/对象；computed 确保切换语言后列表立即更新。
const paragraphs = computed(() => tm('about.paragraphs'))
const missionItems = computed(() => tm('mission.items'))
// 图片数组顺序必须与 mission.items 的顺序保持一致。
const missionIcons = [missionWay, missionKindness, missionTrust]
// 将打包后的纹理地址传给当前组件样式中的 CSS 变量。
const aboutPatternBackground = `url("${aboutPattern}")`
</script>

<style scoped>
.heritage-stage {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 1834px;
  margin-top: -164px;
  overflow: hidden;
  color: #333;
  background: #f9f5ed;
}

.heritage-paper {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1440px;
  height: 1173px;
  max-width: none;
  object-fit: cover;
  transform: translateX(-50%);
}

.about-section {
  position: absolute;
  top: 83px;
  left: 50%;
  width: 1440px;
  height: 1090px;
  transform: translateX(-50%);
}

.about-section :deep(.section-heading) {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.about-section :deep(.section-heading p) { margin-bottom: 2px; }
.about-section :deep(.section-heading .description) { margin-top: 6px; }

.about-scroll {
  position: absolute;
  top: 134px;
  left: 388px;
  width: 663px;
  height: 140px;
}

.about-scroll > img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.about-scroll blockquote {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: center;
  margin: 0;
  padding: 6px 64px 0;
  color: #8e6e49;
  text-align: center;
}

.about-scroll blockquote p {
  margin: 0 0 14px;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  line-height: 1;
}

.about-scroll cite {
  padding-right: 8px;
  font-size: 16px;
  font-style: normal;
  text-align: right;
}

.about-slab {
  position: absolute;
  top: 383px;
  height: 707px;
  background-color: #163464;
  background-image: linear-gradient(rgba(22, 52, 100, .9), rgba(22, 52, 100, .9)), v-bind(aboutPatternBackground);
  background-size: auto 100%;
  opacity: 1;
}

.about-slab-left { left: 0; width: 23px; background-position: right center; }
.about-slab-right { right: 0; width: 567px; background-position: left center; }

.about-copy {
  position: absolute;
  top: 504px;
  left: 100px;
  width: 587px;
  font-family: var(--font-calligraphy);
  letter-spacing: .8px;
}

.about-copy h3 {
  margin: 0 0 5px;
  color: #2e4c7c;
  font-size: 32px;
  font-weight: 400;
  line-height: 1;
}

.about-copy .about-lead {
  margin: 0 0 24px;
  color: #2e4c7c;
}

.about-copy p {
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 24px;
  text-align: justify;
}

.about-photo-frame {
  position: absolute;
  top: 441px;
  left: 756px;
  width: 590px;
  height: 590px;
  padding: 5px;
  border: 1px solid #f2d2af;
}

.about-photo-frame::before,
.about-photo-frame::after {
  position: absolute;
  z-index: 1;
  content: '';
  pointer-events: none;
  border: 1px solid #f2d2af;
}

.about-photo-frame::before { inset: -5px 5px 5px -5px; }
.about-photo-frame::after { inset: 5px -5px -5px 5px; }

.about-photo-frame img {
  width: 580px;
  height: 580px;
  object-fit: cover;
}

.mission-section {
  position: relative;
  height: 530px;
  margin-top: 53px;
  overflow: hidden;
  color: #333;
  background: #f9f5ed;
}

.mission-clouds {
  position: absolute;
  top: 74px;
  left: 50%;
  width: 100%;
  height: 277px;
  max-width: none;
  object-fit: fill;
  transform: translateX(-50%);
}

.mission-content {
  position: relative;
  width: min(100%, 1440px);
  height: 100%;
  margin: 0 auto;
  padding-top: 27px;
}

.mission-content :deep(.section-heading) { margin-bottom: 37px; }

.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 84px;
}

.mission-grid article { text-align: center; }
.mission-grid img { width: 160px; height: 154px; margin: 0 auto 20px; object-fit: contain; }
.mission-grid h3 { margin: 0 0 18px; font-family: var(--font-calligraphy); font-size: 30px; font-weight: 400; }
.mission-grid p { max-width: 250px; margin: 0 auto; font-family: var(--font-calligraphy); font-size: 16px; line-height: 24px; }

@media (max-width: 900px) {
  .heritage-stage { height: auto; margin-top: 0; overflow: visible; background: #f9f5ed; }
  .heritage-paper { top: 0; width: auto; height: 720px; opacity: .8; }
  .about-section { position: relative; top: auto; left: auto; width: 100%; height: auto; padding: 70px 20px 80px; transform: none; }
  .about-section :deep(.section-heading), .about-scroll, .about-copy, .about-photo-frame { position: relative; inset: auto; }
  .about-section :deep(.section-heading) { margin-bottom: 28px; }
  .about-scroll { width: min(100%, 663px); height: auto; aspect-ratio: 663 / 140; margin: 0 auto 38px; }
  .about-scroll blockquote p { font-size: clamp(18px, 4vw, 28px); }
  .about-scroll cite { font-size: 13px; }
  .about-slab { display: none; }
  .about-copy { width: min(100%, 650px); margin: 0 auto; }
  .about-copy h3 { font-size: 27px; }
  .about-copy p { font-size: 14px; line-height: 1.9; }
  .about-photo-frame { width: min(100%, 590px); height: auto; aspect-ratio: 1; margin: 36px auto 0; }
  .about-photo-frame img { width: 100%; height: 100%; }
  .mission-section { height: auto; min-height: 530px; margin-top: 0; padding: 55px 20px 70px; }
  .mission-content { padding-top: 0; }
  .mission-grid { grid-template-columns: 1fr; gap: 42px; }
}
</style>
