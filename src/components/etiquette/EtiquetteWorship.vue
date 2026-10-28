<template>
  <section class="worship-section">
    <EtiquetteSectionHeading :title="t('etiquette.worship.title')" :subtitle="t('etiquette.worship.subtitle')"
      :images="{ 'zh-CN': worshipHeading }" />

    <!-- 入殿前的净手仪轨使用设计稿中的横向主卡片。 -->
    <article class="wide-ritual-card cleanse-card">
      <span class="section-number" aria-hidden="true">壹</span>
      <img class="card-background" :src="cleanseBackground" alt="" aria-hidden="true" />
      <img class="card-outline" :src="wideOutline" alt="" aria-hidden="true" />
      <div class="wide-copy">
        <EtiquetteWorshipSeal tone="red" :title="cleanse.title" :slogan="cleanse.slogan" />
        <p class="wide-description">{{ cleanse.desc }}</p>
        <EtiquetteTip :text="cleanse.tip" />
      </div>
    </article>

    <!-- 叩拜主流程：桌面端按设计稿交错排列，窄屏自动改为单列顺序阅读。 -->
    <section class="ceremony-panel">
      <!-- 原稿切图分层，装饰不参与布局、不遮挡正文。 -->
      <img class="card-background" :src="panelBackground" alt="" aria-hidden="true" />
      <img class="panel-header-background" :src="panelHeader" alt="" aria-hidden="true" />
      <img class="card-outline" :src="panelOutline" alt="" aria-hidden="true" />
      <img class="ceremony-branches" :src="branches" alt="" aria-hidden="true" />
      <img class="ceremony-cranes" :src="cranes" alt="" aria-hidden="true" />
      <img class="ceremony-path" :src="ceremonyPath" alt="" aria-hidden="true" />
      <span class="section-number" aria-hidden="true">贰</span>
      <header class="ceremony-heading">
        <EtiquetteWorshipSeal tone="blue" :title="ceremony.title" :slogan="ceremony.slogan" />
        <p>{{ ceremony.lead }}</p>
      </header>

      <div class="ceremony-grid">
        <article v-for="(stage, index) in ceremony.stages" :key="stage.title" class="ceremony-stage"
          :class="`stage-${index + 1}`">
          <header>
            <span>{{ stage.number }}</span>
            <h4>{{ stage.title }}</h4>
          </header>
          <p class="stage-description">{{ stage.desc }}</p>

          <div v-if="stageImages[index]" class="stage-visual">
            <img class="stage-image" :src="stageImages[index]" alt="" />
          </div>

          <div v-if="stage.prayer" class="prayer-copy">
            <div v-for="item in stage.prayer" :key="item.title">
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </div>
            <p class="prayer-notice">{{ stage.notice }}</p>
          </div>
        </article>
      </div>

    </section>

    <!-- 礼成后退步离殿，对应设计稿第三个横向主卡片。 -->
    <article class="wide-ritual-card retreat-card">
      <span class="section-number" aria-hidden="true">叁</span>
      <img class="card-background" :src="retreatBackground" alt="" aria-hidden="true" />
      <img class="card-outline" :src="wideOutline" alt="" aria-hidden="true" />
      <div class="wide-copy">
        <EtiquetteWorshipSeal tone="green" :title="retreat.title" :slogan="retreat.slogan" />
        <p class="wide-description">{{ retreat.desc }}</p>
        <EtiquetteTip :text="retreat.tip" />
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import EtiquetteSectionHeading from './EtiquetteSectionHeading.vue'
import EtiquetteTip from './EtiquetteTip.vue'
import worshipHeading from '@/assets/etiquette/heading-worship.png'
import EtiquetteWorshipSeal from './EtiquetteWorshipSeal.vue'
import bowHands from '@/assets/etiquette/worship/hands.webp'
import bowGuide from '@/assets/etiquette/worship/guide.webp'
import finishHands from '@/assets/etiquette/worship/finish.webp'

import cleanseBackground from '@/assets/etiquette/worship/cleanse.webp'
import retreatBackground from '@/assets/etiquette/worship/retreat.webp'
import wideOutline from '@/assets/etiquette/worship/wideOutline.svg'
import panelBackground from '@/assets/etiquette/worship/panel.png'
import panelHeader from '@/assets/etiquette/worship/panelHeader.webp'
import panelOutline from '@/assets/etiquette/worship/panelOutline.svg'
import branches from '@/assets/etiquette/worship/branches.webp'
import cranes from '@/assets/etiquette/worship/cranes.png'
import ceremonyPath from '@/assets/etiquette/worship/path.svg'

const { t, tm } = useI18n()
const cleanse = computed(() => tm('etiquette.worship.cleanse'))
const ceremony = computed(() => tm('etiquette.worship.ceremony'))
const retreat = computed(() => tm('etiquette.worship.retreat'))
const stageImages = [bowHands, bowGuide, null, finishHands]

</script>

<style scoped>
.worship-section {
  position: relative;
  padding: 0 24px 80px;
  overflow: hidden;
  background: #f8f5ed;
}

.wide-ritual-card,
.ceremony-panel {
  position: relative;
  isolation: isolate;
  width: min(1240px, 100%);
  margin-inline: auto;
}

.card-background,
.card-outline,
.panel-header-background,
.ceremony-branches,
.ceremony-cranes,
.ceremony-path {
  position: absolute;
  pointer-events: none;
  z-index: -1;
}

.card-background {
  inset: 0;
  width: 100%;
  height: 100%;
}

.card-outline {
  inset: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}

.wide-ritual-card {
  min-height: 400px;
  margin-top: 40px;
  padding: 60px 24px 38px;
}

.section-number {
  position: absolute;
  top: 34px;
  left: 42px;
  color: rgb(255 255 255 / 50%);
  font-family: var(--font-calligraphy);
  font-size: 120px;
  line-height: 1;
  pointer-events: none;
}

.wide-copy {
  position: relative;
  width: min(650px, 100%);
  margin: 0 auto;
  color: #222;
  text-align: center;
}

.wide-description {
  max-width: 507px;
  min-height: 70px;
  margin: 17px auto 18px;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  font-family: var(--font-calligraphy);
  letter-spacing: 1.6px;
}

.retreat-card .wide-description {
  max-width: 613px;
}

.worship-section :deep(.ritual-tip) {
  padding-block: 5px;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1px;
}

.ceremony-panel {
  margin-top: 40px;
  padding: 59px 0 57px;
}

.panel-header-background {
  inset: 0 0 auto;
  width: 100%;
  height: 260px;
}

.ceremony-heading {
  position: relative;
  text-align: center;
}

.ceremony-heading>p {
  display: table;
  max-width: calc(100% - 48px);
  padding: 5px 21px;
  margin: 39px auto 0;
  color: #222;
  font-size: 18px;
  line-height: 20px;
  letter-spacing: 1.8px;
  border-radius: 30px;
  background: linear-gradient(90deg, rgb(242 210 175 / 70%), rgb(242 210 175 / 0%), rgb(242 210 175 / 70%));
}

.ceremony-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 500px));
  gap: 50px 120px;
  margin: 60px 57px 221px 63px;
  align-items: start;
}

.ceremony-stage {
  min-width: 0;
  min-height: 640px;
  padding: 29px 18px 24px;
  color: #fff;
  background: url('@/assets/etiquette/worship/stage.svg') center / 100% 100% no-repeat;
}

.ceremony-stage:nth-child(even) {
  transform: translateY(186px);
}

.ceremony-stage header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
}

.ceremony-stage header span {
  display: grid;
  flex: 0 0 48px;
  height: 48px;
  place-items: center;
  color: #000;
  font-family: var(--font-calligraphy);
  font-size: 28px;
  line-height: 1;
  background: url('@/assets/etiquette/worship/number.svg') center / contain no-repeat;
}

.ceremony-stage h4 {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 1.25;
}

.stage-description {
  min-height: 60px;
  margin: 16px 2px 14px;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 1.6px;
  font-family: var(--font-calligraphy);
}

.stage-visual {
  position: relative;
  height: 440px;
  overflow: hidden;
  border-radius: 16px;
}

.stage-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stage-visual::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, #fbfaf8);
  pointer-events: none;
}

.stage-1 .stage-visual::before,
.stage-4 .stage-visual::before {
  content: '';
  position: absolute;
  z-index: 1;
  inset: 12px;
  border: 1px solid #f2d2af;
  border-radius: 16px;
  pointer-events: none;
}

.stage-2 .stage-visual {
  background: #fff;
}

.stage-2 .stage-image {
  width: 110.43%;
  height: 91.8%;
  max-width: none;
  margin: 11px 0 0 -3.57%;
  object-fit: fill;
}

.stage-2 .stage-visual::after {
  background: linear-gradient(180deg, transparent 89%, #fbfaf8 98%);
}

.stage-4 .stage-visual {
  height: 430px;
}

.stage-4 .stage-image {
  height: 113.64%;
  margin-top: -5.3%;
}

.stage-3 {
  padding-bottom: 18px;
}

.stage-3 .stage-description {
  min-height: 20px;
  margin-bottom: 19px;
}

.prayer-copy {
  min-height: 490px;
  padding: 10px 17px 16px;
  color: #333;
  background: linear-gradient(180deg, #fff 68.75%, transparent);
  border-radius: 16px;
}

.prayer-copy strong {
  color: #c7955f;
  font-size: 18px;
  line-height: 34px;
  font-weight: 400;
}

.prayer-copy p {
  overflow-wrap: anywhere;
  margin: 0;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
    font-family: var(--font-calligraphy); 
}

.prayer-copy .prayer-notice {
  padding: 10px 14px;
  margin-top: 16px;
  font-size: 16px;
  line-height: 24px;
  border-radius: 16px;
  background: linear-gradient(#ffe9d2, rgb(255 233 210 / 30%));
}

.ceremony-tip {
  position: relative;
  max-width: calc(100% - 48px);
}

.ceremony-branches {
  top: 157px;
  right: 0;
  width: 594px;
  transform: scaleX(-1);
}

.ceremony-cranes {
  bottom: -6px;
  left: -91px;
  width: 345px;
  transform: scaleX(-1);
}

.ceremony-path {
  top: 745px;
  left: 37.62%;
  width: 25.44%;
  height: 720px;
}

@media (max-width: 1279px) {
  .ceremony-grid {
    gap: 50px 5%;
    margin-inline: 4%;
  }

  .ceremony-stage h4 {
    font-size: 26px;
  }

  .stage-description {
    min-height: 80px;
  }

  .ceremony-branches {
    width: 45%;
    right: -5%;
  }

  .ceremony-cranes {
    width: 26%;
    left: -5%;
  }
}

@media (max-width: 900px) {
  .ceremony-grid {
    grid-template-columns: minmax(0, 500px);
    justify-content: center;
    gap: 32px;
    margin: 48px 24px 38px;
  }

  .ceremony-stage:nth-child(even) {
    transform: none;
  }

  .ceremony-path {
    display: none;
  }

  .ceremony-branches {
    top: 190px;
    width: 280px;
    opacity: .6;
  }

  .ceremony-cranes {
    width: 160px;
    opacity: .6;
  }

  .section-number {
    left: 24px;
    font-size: 90px;
  }
}

@media (max-width: 600px) {
  .worship-section {
    padding-inline: 14px;
    padding-bottom: 48px;
  }

  .wide-ritual-card {
    padding: 40px 20px 28px;
  }

  .section-number {
    top: 22px;
    left: 18px;
    font-size: 64px;
  }

  .wide-description {
    margin-top: 24px;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: .5px;
  }

  .ceremony-panel {
    padding-top: 40px;
    padding-bottom: 32px;
  }

  .ceremony-heading>p {
    font-size: 14px;
    line-height: 22px;
    letter-spacing: .5px;
  }

  .ceremony-grid {
    margin-inline: 12px;
  }

  .ceremony-stage {
    min-height: 0;
    padding-inline: 14px;
  }

  .ceremony-stage h4 {
    font-size: 22px;
  }

  .ceremony-stage header span {
    flex-basis: 40px;
    height: 40px;
    font-size: 24px;
  }

  .stage-description {
    min-height: 0;
    font-size: 14px;
    line-height: 23px;
    letter-spacing: .5px;
  }

  .stage-visual,
  .stage-4 .stage-visual {
    height: auto;
    aspect-ratio: 466 / 440;
  }

  .stage-2 .stage-visual {
    aspect-ratio: 1;
  }

  .prayer-copy {
    min-height: 0;
    padding: 12px;
  }

  .prayer-copy strong {
    font-size: 16px;
    line-height: 30px;
  }

  .prayer-copy p,
  .prayer-copy .prayer-notice {
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0;
  }

  .worship-section :deep(.ritual-tip) {
    font-size: 13px;
    line-height: 21px;
    letter-spacing: 0;
  }
}

:global(html[data-locale-layout='international'] .wide-description),
:global(html[data-locale-layout='international'] .stage-description),
:global(html[data-locale-layout='international'] .prayer-copy p),
:global(html[data-locale-layout='international'] .ceremony-heading > p) {
  letter-spacing: 0;
  line-height: 1.6;
}

:global(html[data-locale-layout='international'] .ceremony-stage h4) {
  font-family: Georgia, serif;
  font-size: 24px;
}

:global(html[data-locale-layout='international'] .stage-description) {
  min-height: 112px;
}

:global(html[data-locale-layout='international'] .stage-3 .stage-description) {
  min-height: 0;
}

@media (max-width: 600px) {
  :global(html[data-locale-layout='international'] .ceremony-stage h4) {
    font-size: 20px;
  }

  :global(html[data-locale-layout='international'] .stage-description) {
    min-height: 0;
  }

  :global(html[data-locale-layout='international'] .worship-section .ritual-heading .heading-row) {
    width: 100%;
    grid-template-columns: minmax(0, 1fr) minmax(0, 220px) minmax(0, 1fr);
  }

  :global(html[data-locale-layout='international'] .worship-section .ritual-heading h2) {
    max-width: none;
    font-size: 22px;
  }
}
</style>
