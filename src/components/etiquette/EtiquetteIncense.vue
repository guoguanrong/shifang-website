<template>
  <section class="incense-section">
    <EtiquetteSectionHeading :title="t('etiquette.incense.title')" :subtitle="t('etiquette.incense.subtitle')"
      :images="{ 'zh-CN': incenseHeading }" />

    <div class="incense-grid">
      <article v-for="(step, index) in steps" :key="step.title" class="incense-card"
        :class="[`tone-${index + 1}`, { 'has-order': step.order }]">
        <!-- 卡片照片、异形外框和内描边均使用 Figma 的原始导出资源。 -->
        <img class="card-surface" :src="cardVisuals[index].surface" alt="" />
        <img class="card-outline" :src="cardOutline" alt="" />
        <img class="card-inner" :src="cardInner" alt="" />

        <!-- 彩色印章由金色外饰与色块叠放，文字单独渲染以支持多语言。 -->
        <img class="seal-outline" :src="sealOutline" alt="" />
        <img class="seal-color" :src="cardVisuals[index].seal" alt="" />
        <div class="seal-copy">
          <strong>{{ step.title }}</strong>
          <small>
            <!-- 设计稿副标题为两行，按中点分隔符折行，三种语言共用同一规则。 -->
            <span v-for="line in sloganLines(step.slogan)" :key="line">{{ line }}</span>
          </small>
        </div>

        <img class="step-ribbon-image" :src="stepRibbon" alt="" />
        <span class="step-ribbon-copy">{{ step.step }}</span>
        <p class="card-description">{{ step.desc }}</p>

        <!-- 第三步严格复用设计稿的三组插香顺序切图。 -->
        <div v-if="step.order" class="incense-order">
          <figure v-for="(label, orderIndex) in step.order" :key="label" :class="`order-${orderIndex + 1}`">
            <img :src="orderVisuals[orderIndex]" alt="" />
            <figcaption>{{ label }}</figcaption>
          </figure>
        </div>

        <div class="card-tip" :class="`tip-${index + 1}`">
          <img class="tip-background" :src="cardVisuals[index].tip" alt="" />
          <img class="tip-emblem" :src="tipEmblem" alt="" />
          <p>{{ step.tip }}</p>
        </div>

        <!-- 卡片之间的金色箭头表示「一 → 二 → 三」的仪轨顺序，末张卡片不再输出。 -->
        <img v-if="index < steps.length - 1" class="flow-arrow" :src="flowArrow" alt="" aria-hidden="true" />
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import EtiquetteSectionHeading from './EtiquetteSectionHeading.vue'
import incenseHeading from '@/assets/etiquette/heading-incense.png'
import cardSurfaceOne from '@/assets/etiquette/incense/card-1.webp'
import cardSurfaceTwo from '@/assets/etiquette/incense/card-2.webp'
import cardSurfaceThree from '@/assets/etiquette/incense/card-3.webp'
import cardOutline from '@/assets/etiquette/incense/card-outline.svg'
import cardInner from '@/assets/etiquette/incense/card-inner.svg'
import sealOutline from '@/assets/etiquette/incense/seal-outline.svg'
import sealRed from '@/assets/etiquette/incense/seal-red.png'
import sealBlue from '@/assets/etiquette/incense/seal-blue.png'
import sealGreen from '@/assets/etiquette/incense/seal-green.png'
import stepRibbon from '@/assets/etiquette/incense/step-ribbon.svg'
import tipOne from '@/assets/etiquette/incense/tip-1.svg'
import tipTwo from '@/assets/etiquette/incense/tip-2.svg'
import tipThree from '@/assets/etiquette/incense/tip-3.svg'
import tipEmblem from '@/assets/etiquette/incense/tip-emblem.png'
import flowArrow from '@/assets/etiquette/incense/arrow-right.png'
import orderMiddle from '@/assets/etiquette/incense/order-middle.png'
import orderRight from '@/assets/etiquette/incense/order-right.png'
import orderLeft from '@/assets/etiquette/incense/order-left.png'

const { t, tm } = useI18n()

// 文案仍由 i18n 驱动；视觉资源只维护一份，切换语言时不会重新创建错误布局。
const steps = computed(() => tm('etiquette.incense.steps'))
const cardVisuals = [
  { surface: cardSurfaceOne, seal: sealRed, tip: tipOne },
  { surface: cardSurfaceTwo, seal: sealBlue, tip: tipTwo },
  { surface: cardSurfaceThree, seal: sealGreen, tip: tipThree },
]
const orderVisuals = [orderMiddle, orderRight, orderLeft]

// 印章副标题在 Figma 中固定为两行（如「拈香三柱 / 以左手持」），统一按「·」折行。
function sloganLines(slogan) {
  return slogan.split('·').map((line) => line.trim()).filter(Boolean)
}
</script>

<style scoped>
.incense-section {
  position: relative;
  z-index: 1;
  padding: 2px 24px 78px;
  background: #f9f5ed;
}

.incense-section p{
  font-family: var(--font-calligraphy) !important; 
}

.incense-grid {
  display: grid;
  grid-template-columns: repeat(3, 446.67px);
  gap: 50px;
  justify-content: center;
  width: min(1440px, 100%);
  margin: 23px auto 0;
}

.incense-card {
  --seal-left: 29.474%;
  --seal-color-left: 31.579%;
  /* 印章色块直径；标题文字按它的水平中心对齐，首张卡片印章左移时也不会跑偏。 */
  --seal-size: 36.43%;
  position: relative;
  width: 100%;
  aspect-ratio: 380 / 520;
  color: #222;
  isolation: isolate;
  transition: filter .25s ease, transform .25s ease;
}

.incense-card:first-child {
  --seal-left: 27.105%;
  --seal-color-left: 29.211%;
}

.incense-card:hover {
  z-index: 2;
  filter: drop-shadow(0 12px 12px rgba(90, 58, 30, .12));
  transform: translateY(-5px);
}

.card-surface,
.card-outline {
  position: absolute;
  inset: 0;
  z-index: -3;
  display: block;
  width: 100%;
  height: 100%;
}

.card-surface {
  object-fit: fill;
}

.card-outline {
  z-index: -2;
}

.card-inner {
  position: absolute;
  z-index: -1;
  top: 1.154%;
  left: 1.579%;
  display: block;
  width: 96.842%;
  height: 97.692%;
}

.seal-outline {
  position: absolute;
  top: 5.385%;
  left: var(--seal-left);
  width: 40.526%;
  aspect-ratio: 1;
}

.seal-color {
  position: absolute;
  top: 6.923%;
  left: var(--seal-color-left);
  width: var(--seal-size);
  aspect-ratio: 1;
}

.seal-copy {
  position: absolute;
  top: 12.75%;
  left: calc(var(--seal-color-left) + var(--seal-size) / 2);
  display: flex;
  width: 70.263%;
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-align: center;
  transform: translateX(-50%);
}

.seal-copy strong {
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 1.6px;
}

.seal-copy small {
  margin-top: 14px;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

/* 折行后的每一句独占一行，保持与设计稿一致的居中两行排版。 */
.seal-copy small span {
  display: block;
}

.step-ribbon-image {
  position: absolute;
  top: 5.827%;
  left: 0;
  width: 9.474%;
  height: 21.538%;
}

.step-ribbon-copy {
  position: absolute;
  top: 11.212%;
  left: 3.632%;
  display: block;
  width: 17px;
  color: #f2d2af;
  font-family: var(--font-calligraphy);
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  writing-mode: vertical-rl;
}

.card-description {
  position: absolute;
  top: 46.731%;
  left: 6.842%;
  width: 84.474%;
  height: 19.231%;
  margin: 0;
  overflow: hidden;
  font-size: 16px;
  line-height: 20px;
  text-align: justify;
  letter-spacing: 1.6px;
  font-family: var(--font-calligraphy);
}

.tone-2 .card-description {
  left: 10.263%;
  width: 80.263%;
}

.tone-3 .card-description {
  top: 38.654%;
  left: 9.737%;
  width: 80.789%;
}

.incense-order,
.incense-order figure {
  position: absolute;
  inset: 0;
  margin: 0;
}

.incense-order figure img {
  display: block;
  width: 100%;
  height: auto;
}

.incense-order figcaption {
  margin-top: 4px;
  color: #76583b;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  white-space: nowrap;
  letter-spacing: .6px;
}

.incense-order .order-1 {
  top: 62.692%;
  left: 13.158%;
  width: 15.789%;
}

.incense-order .order-2 {
  top: 63.654%;
  left: 40.263%;
  width: 13.158%;
}

.incense-order .order-3 {
  top: 63.077%;
  left: 64.737%;
  width: 17.368%;
}

.card-tip {
  position: absolute;
  height: 10.769%;
}

.tip-1 {
  top: 84.623%;
  left: 6.842%;
  width: 84.932%;
  height: 8.077%;
}

.tip-2 {
  top: 81.923%;
  left: 5.526%;
  width: 88.879%;
}

.tip-3 {
  top: 84.231%;
  left: 5.526%;
  width: 88.879%;
}

.tip-background {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.tip-emblem {
  position: absolute;
  top: 21%;
  left: 2.48%;
  width: 9.64%;
  aspect-ratio: 1;
}

.tip-2 .tip-emblem,
.tip-3 .tip-emblem {
  top: 21.4%;
}

.card-tip p {
  position: absolute;
  top: 25%;
  left: 11.47%;
  width: 86.47%;
  margin: 0;
  color: #3e2618;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

.tip-2 p,
.tip-3 p {
  top: 16.1%;
  left: 14.52%;
  width: 82.65%;
}

/* 设计稿在卡片之间用金色箭头串起「一 → 二 → 三」的仪轨顺序。 */
.flow-arrow {
  position: absolute;
  z-index: 3;
  top: 58%;
  left: 100%;
  width: 50px;
  margin-left: 25px;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

@media (max-width: 1439px) {
  .incense-grid {
    grid-template-columns: repeat(2, minmax(300px, 380px));
    gap: 38px;
  }

  /* 栅格换成两列/单列后「向右」的箭头不再成立，小屏直接隐藏。 */
  .flow-arrow {
    display: none;
  }
}

@media (max-width: 840px) {
  .incense-section {
    padding-top: 24px;
    padding-inline: 18px;
  }

  .incense-grid {
    grid-template-columns: minmax(0, 380px);
    gap: 28px;
    margin-top: 26px;
  }
}

@media (max-width: 420px) {
  .seal-copy strong {
    font-size: clamp(26px, 8.42vw, 32px);
  }

  .seal-copy small,
  .card-description,
  .card-tip p {
    font-size: clamp(12px, 4.21vw, 16px);
    line-height: 1.25;
  }

  .step-ribbon-copy {
    left: 2.35%;
    font-size: 16px;
    line-height: 22px;
  }
}

/* 非中文语言压缩长文案，但不改变卡片几何尺寸与三列设计节奏。 */
:global(html[data-locale-layout='international'] .seal-copy strong) {
  max-width: 170px;
  font-family: Georgia, serif;
  font-size: 22px;
  line-height: 1.05;
}

:global(html[data-locale-layout='international'] .seal-copy small) {
  max-width: 215px;
  margin-top: 9px;
  font-size: 11px;
  line-height: 14px;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .step-ribbon-copy) {
  top: 10.2%;
  font-family: Georgia, serif;
  font-size: 13px;
  line-height: 17px;
  writing-mode: vertical-rl;
}

:global(html[data-locale-layout='international'] .card-description) {
  font-family: Georgia, serif;
  font-size: 12.5px;
  line-height: 15px;
  text-align: left;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .tone-3 .card-description) {
  top: 37.5%;
}

:global(html[data-locale-layout='international'] .card-tip p) {
  top: 19%;
  font-family: Georgia, serif;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .tip-2 p),
:global(html[data-locale-layout='international'] .tip-3 p) {
  top: 13%;
}

:global(html[data-locale-layout='international'] .incense-order figcaption) {
  font-family: Georgia, serif;
  font-size: 10px;
  letter-spacing: 0;
}

@media (prefers-reduced-motion: reduce) {
  .incense-card {
    transition: none;
  }
}
</style>
