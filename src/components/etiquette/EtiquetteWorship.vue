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

    <!-- 叩拜主流程：左栏为站礼、默念与起身，右栏为跪礼图解，窄屏按序单列。 -->
    <section class="ceremony-panel">
      <!-- 原稿切图分层，装饰不参与布局、不遮挡正文。 -->
      <img class="card-background" :src="panelBackground" alt="" aria-hidden="true" />
      <img class="panel-header-background" :src="panelHeader" alt="" aria-hidden="true" />
      <img class="card-outline" :src="panelOutline" alt="" aria-hidden="true" />
      <img class="ceremony-blossom" :src="ceremonyBlossom" alt="" aria-hidden="true" />
      <img class="ceremony-path" :src="ceremonyPath" alt="" aria-hidden="true" />
      <span class="section-number" aria-hidden="true">贰</span>
      <header class="ceremony-heading">
        <EtiquetteWorshipSeal tone="blue" :title="ceremony.title" :slogan="ceremony.slogan" />
        <p>{{ ceremony.lead }}</p>
      </header>

      <div class="ceremony-grid">
        <article v-for="(stage, index) in ceremony.stages" :key="stage.title" class="ceremony-stage"
          :class="`stage-${index + 1}`">
          <header class="stage-heading">
            <span class="stage-number">{{ stage.number }}</span>
            <h4>{{ stage.title }}</h4>
          </header>
          <p class="stage-description">{{ stage.desc }}</p>

          <div v-if="stageVisuals[index]" class="stage-visual">
            <img class="stage-image" :src="stageVisuals[index]" alt="" />
          </div>

          <div v-else-if="stage.prayer" class="prayer-copy">
            <div v-for="item in stage.prayer" :key="item.title">
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </div>
            <p class="prayer-notice">{{ stage.notice }}</p>
          </div>

          <!-- 跪礼卡内的「一礼三叩」图解：每幅插画对应相邻两步。 -->
          <div v-else-if="stage.guide" class="guide-panel">
            <h5>{{ stage.guide.title }}</h5>
            <p class="guide-intro">{{ stage.guide.intro }}</p>
            <p class="guide-lead">{{ stage.guide.lead }}</p>
            <div class="guide-groups">
              <div v-for="(group, groupIndex) in guideGroups" :key="groupIndex" class="guide-group">
                <img class="guide-image" :src="group.image" alt="" />
                <div class="guide-steps">
                  <div v-for="step in group.steps" :key="step.title" class="guide-step">
                    <span class="guide-step-badge">{{ step.title }}</span>
                    <p>{{ step.text }}</p>
                  </div>
                </div>
              </div>
            </div>
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
import ceremonyBlossom from '@/assets/etiquette/worship/ceremonyBlossom.webp'
import stageStand from '@/assets/etiquette/worship/stageStand.webp'
import stageRise from '@/assets/etiquette/worship/stageRise.webp'
import guideStep1 from '@/assets/etiquette/worship/guideStep1.webp'
import guideStep2 from '@/assets/etiquette/worship/guideStep2.webp'
import guideStep3 from '@/assets/etiquette/worship/guideStep3.webp'
import guideStep4 from '@/assets/etiquette/worship/guideStep4.webp'

import cleanseBackground from '@/assets/etiquette/worship/cleanse.webp'
import retreatBackground from '@/assets/etiquette/worship/retreat.webp'
import wideOutline from '@/assets/etiquette/worship/wideOutline.svg'
import panelBackground from '@/assets/etiquette/worship/panel.png'
import panelHeader from '@/assets/etiquette/worship/panelHeader.webp'
import panelOutline from '@/assets/etiquette/worship/panelOutline.svg'
import ceremonyPath from '@/assets/etiquette/worship/path.svg'

const { t, tm } = useI18n()
const cleanse = computed(() => tm('etiquette.worship.cleanse'))
const ceremony = computed(() => tm('etiquette.worship.ceremony'))
const retreat = computed(() => tm('etiquette.worship.retreat'))
const stageVisuals = [stageStand, null, null, stageRise]
const guideImages = [guideStep1, guideStep2, guideStep3, guideStep4]
const guideGroups = computed(() => {
  const steps = ceremony.value.stages?.[1]?.guide?.steps ?? []
  return guideImages.map((image, index) => ({
    image,
    steps: steps.slice(index * 2, index * 2 + 2),
  }))
})

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
.ceremony-blossom,
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

/* 叩拜大卡的金线只延展到内容主体高度，与设计稿一致。 */
.ceremony-panel > .card-outline {
  inset: 10px auto auto 10px;
  height: auto;
  aspect-ratio: 1220 / 1580;
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
  padding: 59px 0 50px;
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
  column-gap: 120px;
  row-gap: 33px;
  justify-content: center;
  align-items: start;
  margin-top: 52px;
}

.ceremony-stage {
  min-width: 0;
  padding: 30px 20px 26px;
  color: #fff;
  background: url('@/assets/etiquette/worship/stage.svg') center / 100% 100% no-repeat;
}
.stage-2{
  background: url('@/assets/etiquette/worship/stage22.png') center / 100% 100% no-repeat;
}

/* 桌面端按设计稿分栏：壹 / 叁 / 肆 在左，贰 占满右栏。 */
.ceremony-stage:nth-child(1) {
  grid-column: 1;
  grid-row: 1;
  min-height: 443px;
}

.ceremony-stage:nth-child(2) {
  grid-column: 2;
  grid-row: 1 / span 3;
  align-self: stretch;
}

.ceremony-stage:nth-child(3) {
  grid-column: 1;
  grid-row: 2;
  min-height: 632px;
}

.ceremony-stage:nth-child(4) {
  grid-column: 1;
  grid-row: 3;
  min-height: 433px;
}

.stage-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 48px;
}

.stage-number {
  display: grid;
  flex: 0 0 48px;
  height: 48px;
  place-items: center;
  color: #b0260b;
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
  margin: 16px 0 0;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 1.6px;
  font-family: var(--font-calligraphy);
}

.stage-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 460 / 256;
  margin-top: 33px;
  overflow: hidden;
  border-radius: 16px;
}

.stage-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.stage-visual::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, #fbfaf8);
  pointer-events: none;
}

.stage-visual::before {
  content: '';
  position: absolute;
  z-index: 1;
  inset: 12px;
  border: 1px solid rgb(242 210 175 / 80%);
  border-radius: 16px;
  pointer-events: none;
}

.prayer-copy {
  min-height: 490px;
  padding: 10px 19px 16px;
  margin-top: 24px;
  color: #333;
  background: linear-gradient(180deg, #fff 68.75%, rgb(255 255 255 / 0%));
  border-radius: 16px;
}

.prayer-copy strong {
  color: #c7955f;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  line-height: 34px;
  font-weight: 400;
}

.prayer-copy p {
  overflow-wrap: anywhere;
  margin: 0;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 1.2px;
  font-family: var(--font-calligraphy);
}

.prayer-copy .prayer-notice {
  padding: 10px 12px;
  margin-top: 16px;
  font-size: 16px;
  line-height: 24px;
  border-radius: 16px;
  background: linear-gradient(#ffe9d2, rgb(255 233 210 / 30%));
}

/* 跪礼卡内的白色图解面板。 */
.guide-panel {
  padding: 20px;
  margin-top: 24px;
  color: #333;
  background: #fff;
  border-radius: 16px;
}

.guide-panel h5 {
  margin: 0;
  color: #b0260b;
  font-family: var(--font-calligraphy);
  font-size: 24px;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: 2.4px;
  text-align: center;
}

.guide-intro {
  margin: 16px 0 0;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 1.6px;
  text-align: justify;
  font-family: var(--font-calligraphy);
}

.guide-lead {
  margin: 8px 0 0;
  color: #b0260b;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 1.6px;
  font-family: var(--font-calligraphy);
}

.guide-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}

.guide-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.guide-image {
  display: block;
  width: 300px;
  max-width: 100%;
  aspect-ratio: 300 / 169;
  object-fit: cover;
}

.guide-steps {
  display: flex;
  width: 100%;
  gap: 24px;
  justify-content: space-between;
}

.guide-step {
  flex: 1 1 188px;
  width: auto;
  max-width: 188px;
  min-width: 0;
}

.guide-step-badge {
  display: inline-block;
  padding: 0 12px;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 1px;
  background: #b0260b;
  border-radius: 100px;
}

.guide-step p {
  overflow-wrap: anywhere;
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: .5px;
  font-family: var(--font-calligraphy);
}

.ceremony-blossom {
  top: 84px;
  right: 0;
  width: 391px;
  transform: rotate(180deg) scaleY(-1);
}

.ceremony-path {
  top: 745px;
  left: 37.6%;
  width: 21.1%;
  height: 991px;
}

@media (max-width: 1279px) {
  .ceremony-grid {
    column-gap: 4%;
    margin-inline: 4%;
  }

  .ceremony-stage h4 {
    font-size: 26px;
  }

  .ceremony-blossom {
    width: 32%;
    right: 0;
  }

  .ceremony-path {
    display: none;
  }
}

@media (max-width: 900px) {
  .ceremony-grid {
    grid-template-columns: minmax(0, 500px);
    justify-content: center;
    gap: 32px;
    margin: 48px 24px 38px;
  }

  .ceremony-stage:nth-child(n) {
    grid-column: auto;
    grid-row: auto;
    min-height: 0;
  }

  .ceremony-blossom {
    top: 70px;
    width: 200px;
    opacity: .65;
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
    padding: 24px 14px 22px;
  }

  .ceremony-stage h4 {
    font-size: 22px;
  }

  .stage-heading {
    gap: 10px;
    min-height: 40px;
  }

  .stage-number {
    flex-basis: 40px;
    height: 40px;
    font-size: 24px;
  }

  .stage-description {
    margin-top: 14px;
    font-size: 14px;
    line-height: 23px;
    letter-spacing: .5px;
  }

  .stage-visual {
    margin-top: 24px;
  }

  .prayer-copy {
    min-height: 0;
    padding: 12px;
    margin-top: 20px;
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

  .guide-panel {
    padding: 14px;
    margin-top: 20px;
  }

  .guide-panel h5 {
    font-size: 20px;
    letter-spacing: 1px;
  }

  .guide-intro,
  .guide-lead {
    margin-top: 12px;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: .5px;
  }

  .guide-groups {
    gap: 20px;
    margin-top: 14px;
  }

  .guide-image {
    width: 240px;
  }

  .guide-steps {
    align-items: flex-start;
    gap: 16px;
  }

  .guide-step {
    flex: 1 1 0;
    width: auto;
  }

  .guide-step-badge {
    padding: 0 9px;
    font-size: 12px;
    line-height: 24px;
  }

  .guide-step p {
    margin-top: 8px;
    font-size: 12px;
    line-height: 19px;
    letter-spacing: 0;
  }

  .ceremony-blossom {
    top: 54px;
    width: 150px;
    opacity: .5;
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

:global(html[data-locale-layout='international'] .prayer-copy strong),
:global(html[data-locale-layout='international'] .guide-panel h5),
:global(html[data-locale-layout='international'] .guide-step-badge) {
  font-family: Georgia, serif;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .guide-panel h5) {
  font-size: 20px;
}

:global(html[data-locale-layout='international'] .guide-intro),
:global(html[data-locale-layout='international'] .guide-lead),
:global(html[data-locale-layout='international'] .guide-step p) {
  font-family: Georgia, serif;
  letter-spacing: 0;
  line-height: 1.6;
}

:global(html[data-locale-layout='international'] .guide-intro) {
  text-align: left;
}

@media (max-width: 600px) {
  :global(html[data-locale-layout='international'] .ceremony-stage h4) {
    font-size: 20px;
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
