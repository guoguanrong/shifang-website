<template>
  <section class="services" :aria-label="t('blessings.servicesAria')">
    <article v-for="item in items" :key="item.title" class="service-card">
      <img class="service-card__union" :src="cardUnion" width="295" height="518" alt="" aria-hidden="true" />
      <img class="service-card__ornament" :src="cardOrnament" alt="" aria-hidden="true" />

      <div class="service-card__icon" :class="`service-card__icon--${item.iconType}`" aria-hidden="true">
        <div class="service-card__icon-window">
          <img :src="item.icon" alt="" />
        </div>
      </div>

      <div class="service-card__copy">
        <h2>{{ item.title }}</h2>
        <p>
          <span v-for="line in item.lines" :key="line">{{ line }}</span>
        </p>

        <div class="service-card__action">
          <img class="service-card__shadow" :src="buttonShadow" alt="" aria-hidden="true" />
          <span v-for="side in ['left', 'right']" :key="`diamond-${side}`" class="service-card__diamond"
            :class="`is-${side}`" aria-hidden="true"><span /></span>
          <img v-for="side in ['left', 'right']" :key="`dot-${side}`" class="service-card__dot"
            :class="`is-${side}`" :src="buttonDot" alt="" aria-hidden="true" />
          <CeremonialButton :label="item.action" :to="{ name: item.route }" />
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import cardUnion from '@/assets/blessings/services-v2/card-union.png'
import cardOrnament from '@/assets/blessings/services-v2/card-ornament.svg'
import lamp from '@/assets/blessings/services-v2/lamp.png'
import talisman from '@/assets/blessings/services-v2/talisman.png'
import talisman2 from '@/assets/blessings/services-v2/talisman2.png'
import calendar from '@/assets/blessings/services-v2/calendar.png'
import buttonShadow from '@/assets/blessings/services-v2/button-shadow.svg'
import buttonDot from '@/assets/blessings/services-v2/button-dots.svg'

const icons = [lamp, talisman2, talisman, calendar]
const iconTypes = ['lamp', 'talisman2', 'talisman', 'calendar']
const serviceRoutes = ['lamp-offerings', 'deities', 'digital-talisman', 'seasonal-reminders']
const { t, tm } = useI18n()

const items = computed(() => tm('blessings.services').map((item, index) => ({
  ...item,
  icon: icons[index],
  iconType: iconTypes[index],
  route: serviceRoutes[index],
})))
</script>

<style scoped>
.services {
  position: absolute;
  z-index: 2;
  top: 254px;
  left: 50%;
  display: grid;
  grid-template-columns: repeat(4, 295px);
  gap: 20px;
  width: 1240px;
  transform: translateX(-50%);
}

.service-card {
  position: relative;
  isolation: isolate;
  width: 295px;
  height: 518px;
  text-align: center;
  transition: transform .25s ease, filter .25s ease;
}

.service-card__union,
.service-card__ornament {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  display: block;
  pointer-events: none;
}

.service-card__union {
  width: 295px;
  height: 518px;
}

.service-card__ornament {
  top: 6px;
  left: 6px;
}

.service-card__icon {
  position: absolute;
  z-index: 1;
  top: 76px;
  left: 50%;
  width: 200px;
  height: 142px;
  transform: translateX(-50%);
  transition: translate .25s ease;
}

.service-card__icon--lamp { height: 132px; }

.service-card__icon-window {
  position: absolute;
  top: 0;
  left: 50%;
  width: 137px;
  height: 142px;
  overflow: hidden;
  transform: translateX(-50%);
}

.service-card__icon--lamp .service-card__icon-window {
  width: 166px;
  height: 132px;
}

.service-card__icon--calendar .service-card__icon-window {
  top: 50%;
  width: 200px;
  height: auto;
  aspect-ratio: 216 / 131;
  transform: translate(-50%, -50%);
}

/* 神像供奉图标：原图 200×132，和其他图标尺寸不同，单独按原比例居中。 */
.service-card__icon--talisman2 .service-card__icon-window {
  top: 50%;
  width: 200px;
  height: 132px;
  transform: translate(-50%, -50%);
}

.service-card__icon--talisman2 img {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.service-card__icon-window img {
  position: absolute;
  display: block;
  max-width: none;
}

.service-card__icon--lamp img {
  top: -5.63%;
  left: 0;
  width: 108.02%;
  height: 105.63%;
}

.service-card__icon--talisman img {
  top: 0;
  left: -17.86%;
  width: 118.19%;
  height: 100%;
}

.service-card__icon--calendar img {
  top: -.85%;
  left: -6.48%;
  width: 110.65%;
  height: 113.15%;
}

.service-card__copy {
  position: absolute;
  z-index: 2;
  top: 261px;
  left: 50%;
  display: flex;
  width: 251px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transform: translateX(-50%);
}

.service-card h2 {
  margin: 0;
  color: #000;
  font: 32px/1.2 var(--font-calligraphy);
  letter-spacing: 0;
  white-space: nowrap;
}

.service-card p {
  display: flex;
  width: 100%;
  min-height: 80px;
  flex-direction: column;
  margin: 0;
  color: #333;
  font: 16px/20px var(--font-calligraphy);
  letter-spacing: 1.6px;
}

.service-card__action {
  position: relative;
  z-index: 0;
  width: 158px;
  height: 36px;
}

.service-card__shadow {
  position: absolute;
  z-index: 0;
  top: 24px;
  left: 12px;
  display: block;
  pointer-events: none;
}

.service-card__diamond {
  position: absolute;
  z-index: 2;
  top: 15px;
  display: grid;
  width: 5.568px;
  height: 5.568px;
  place-items: center;
  pointer-events: none;
}

.service-card__diamond.is-left { left: .81px; }
.service-card__diamond.is-right { right: .87px; }

.service-card__diamond span {
  width: 3.938px;
  height: 3.938px;
  background: linear-gradient(180deg, #f8f5f1, #caab89);
  transform: rotate(45deg);
}

.service-card__dot {
  position: absolute;
  z-index: 2;
  top: 17px;
  display: block;
  max-width: none;
  pointer-events: none;
}

.service-card__dot.is-left { left: 7.56px; }
.service-card__dot.is-right { right: 7.56px; }

.service-card :deep(.ceremonial-button) {
  position: relative;
  z-index: 1;
  width: 158px;
  min-width: 158px;
  height: 36px;
  padding: 0 12px;
  color: #fff;
  font: 16px/1 var(--font-calligraphy);
  letter-spacing: 0;
  background-color: #cc3513;
  background-image: url('@/assets/blessings/services-v2/button-texture.png');
  background-position: center;
  background-size: 100% 100%;
  border-color: #c29f79;
  box-shadow: none;
}

.service-card :deep(.ceremonial-button::before) {
  inset: 2.8px 3px;
  border-color: rgba(242, 210, 175, .75);
}

.service-card :deep(.ceremonial-button::after) { content: none; }

@media (hover: hover) and (pointer: fine) {
  .service-card:hover {
    filter: drop-shadow(0 16px 18px rgba(90, 58, 30, .18));
    transform: translateY(-6px);
  }

  .service-card:hover .service-card__icon { translate: 0 -4px; }
}

.service-card:focus-within {
  filter: drop-shadow(0 16px 18px rgba(90, 58, 30, .18));
  transform: translateY(-6px);
}

.service-card:focus-within .service-card__icon { translate: 0 -4px; }

.service-card :deep(.ceremonial-button:active) {
  filter: brightness(.95);
  transform: translateY(1px);
}

/* 英文布局：内容区固定高度，标题限宽换行不溢出卡片，正文自适应，按钮统一贴卡片底部。
   注意：选择器必须整段写进 :global(...)，否则编译后只剩 html[...] 选择器，
   会把 top/height 等样式错加到 <html> 上（导致页面高度异常、滚动条失效）。 */
:global(html[data-locale-layout='international'] .service-card__copy) {
  top: 246px;
  height: 209px;
  gap: 14px;
}

:global(html[data-locale-layout='international'] .service-card h2) {
  display: block;
  width: 100%;
  min-height: 24px;
  font-size: 20px;
  line-height: 1.2;
  overflow-wrap: anywhere;
  text-align: center;
  white-space: normal;
}

:global(html[data-locale-layout='international'] .service-card p) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  font-size: 12.5px;
  line-height: 18px;
  letter-spacing: 0;
}

/* 按钮不再跟随正文长度浮动，四张卡片底部对齐。 */
:global(html[data-locale-layout='international'] .service-card__action) {
  margin-top: auto;
}

:global(html[data-locale-layout='international'] .service-card .ceremonial-button) {
  padding-inline: 8px;
  font-size: 12px;
  letter-spacing: .1px;
}

@media (max-width: 1239px) {
  .services {
    position: relative;
    top: auto;
    left: 0;
    grid-template-columns: repeat(2, 295px);
    justify-content: center;
    width: 100vw;
    padding: 0 24px;
    margin-top: 254px;
    margin-inline: 0;
    transform: none;
  }
}

@media (max-width: 900px) {
  .services { margin-top: 0; }
}

@media (max-width: 680px) {
  .services {
    grid-template-columns: 295px;
    row-gap: 24px;
    padding: 0 12px;
  }
}
</style>
