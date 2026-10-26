<template>
  <section class="incense-section" aria-labelledby="incense-title">
    <header class="incense-heading">
      <span class="heading-medallion" aria-hidden="true">
        <img :src="headingMedallion" alt="" />
      </span>
      <div class="heading-row">
        <img class="heading-line is-left" :src="headingLineLeft" alt="" />
        <h2 id="incense-title">{{ t('etiquette.incense.title') }}</h2>
        <img class="heading-line is-right" :src="headingLineRight" alt="" />
      </div>
      <p>{{ t('etiquette.incense.subtitle') }}</p>
    </header>

    <div class="incense-grid">
      <article v-for="(step, index) in steps" :key="step.title" class="incense-card">
        <img
          class="incense-card-photo"
          :class="{ 'is-mirrored': index === 0 || index === 2 }"
          :src="cardPhotos[index]"
          alt=""
        />
        <div class="incense-card-shade" aria-hidden="true" />
        <div class="incense-card-copy">
          <div class="incense-card-heading">
            <h3>{{ step.title }}</h3>
            <p>{{ stepSlogan(step.slogan) }}</p>
          </div>
          <p v-if="index === 0" class="incense-card-description">{{ step.desc }}</p>
          <img v-else class="incense-step-arrow" :src="stepArrow" alt="" aria-hidden="true" />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import headingMedallion from '@/assets/etiquette/incense-redesign/medallion.webp'
import headingMask from '@/assets/etiquette/incense-redesign/medallion-mask.svg'
import headingLineLeft from '@/assets/etiquette/incense-redesign/line-left.svg'
import headingLineRight from '@/assets/etiquette/incense-redesign/line-right.svg'
import incensePhoto from '@/assets/etiquette/incense-redesign/card-1.webp'
import raisePhoto from '@/assets/etiquette/incense-redesign/card-2.webp'
import placePhoto from '@/assets/etiquette/incense-redesign/card-3.webp'
import stepArrow from '@/assets/etiquette/incense-redesign/arrow.svg'

const { t, tm, locale } = useI18n()
const steps = computed(() => tm('etiquette.incense.steps'))
const cardPhotos = [incensePhoto, raisePhoto, placePhoto]
const headingMaskImage = `url("${headingMask}")`

function stepSlogan(slogan) {
  const separator = locale.value === 'en' ? ' ' : ''
  return slogan.split('·').map(part => part.trim()).filter(Boolean).join(separator)
}
</script>

<style scoped>
.incense-section {
  position: relative;
  z-index: 1;
  padding: 0 24px;
  background: #f9f5ed;
}

.incense-heading {
  position: relative;
  z-index: 2;
  height: 152px;
  text-align: center;
}

.heading-medallion {
  position: absolute;
  top: 0;
  left: 50%;
  width: 204px;
  height: 152px;
  -webkit-mask-image: v-bind(headingMaskImage);
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-image: v-bind(headingMaskImage);
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  transform: translateX(-50%);
}

.heading-medallion img {
  position: absolute;
  top: 6px;
  left: 33px;
  width: 139px;
  height: 139px;
  object-fit: cover;
}

.heading-row {
  position: absolute;
  top: 54px;
  left: 50%;
  display: grid;
  grid-template-columns: 177px auto 177px;
  align-items: start;
  gap: 8px;
  transform: translateX(-50%);
}

.heading-line {
  display: block;
  width: 177px;
  height: 9.5px;
  margin-top: 21px;
}

.heading-line.is-left { transform: scaleX(-1); }

.heading-row h2 {
  min-width: 175px;
  margin: 0;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 2.1px;
  white-space: nowrap;
}

.incense-heading > p {
  position: absolute;
  top: 120px;
  left: 50%;
  width: min(363px, 90vw);
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 1;
  transform: translateX(-50%);
}

.incense-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 394px));
  gap: 30px;
  justify-content: center;
  width: min(1240px, 100%);
  margin: 26px auto 0;
}

.incense-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  aspect-ratio: 394 / 431;
  color: #fff;
  background: #30251d;
  border-radius: 2px;
  isolation: isolate;
  transition: transform .22s ease, box-shadow .22s ease;
}

.incense-card-photo,
.incense-card-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.incense-card-photo {
  object-fit: cover;
  transition: transform .35s ease;
}

.incense-card-photo.is-mirrored { transform: scaleX(-1); }

@media (hover: hover) and (pointer: fine) {
  .incense-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(35, 29, 21, .28);
  }

  .incense-card:hover .incense-card-photo:not(.is-mirrored) {
    transform: scale(1.045);
  }

  .incense-card:hover .incense-card-photo.is-mirrored {
    transform: scaleX(-1) scale(1.045);
  }
}

.incense-card-shade {
  z-index: 1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, .8) 80.006%);
  pointer-events: none;
}

.incense-card-copy {
  position: absolute;
  z-index: 2;
  right: 20px;
  bottom: 30px;
  left: 20px;
}

.incense-card-heading {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.incense-card-heading h3 {
  margin: 0;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 1;
}

.incense-card-heading p {
  margin: 0;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.2px;
}

.incense-card-description {
  max-height: 140px;
  margin: 16px 0 0;
  overflow: hidden;
  color: rgba(255, 255, 255, .75);
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
  text-wrap: pretty;
}

.incense-step-arrow {
  display: block;
  width: 22px;
  height: 22px;
  margin-top: 24px;
  object-fit: contain;
}

html[data-locale-layout='international'] .heading-row {
  grid-template-columns: minmax(28px, 177px) minmax(0, auto) minmax(28px, 177px);
  width: min(545px, calc(100vw - 40px));
}

html[data-locale-layout='international'] .heading-line { width: 100%; }

html[data-locale-layout='international'] .heading-row h2 {
  min-width: 0;
  max-width: 60vw;
  font-family: var(--font-serif-cn);
  font-size: 31px;
  letter-spacing: 0;
  white-space: normal;
}

html[data-locale-layout='international'] .incense-card-heading h3 {
  font-family: var(--font-serif-cn);
  font-size: 25px;
}

html[data-locale-layout='international'] .incense-card-heading p,
html[data-locale-layout='international'] .incense-card-description {
  font-family: var(--font-serif-cn);
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0;
}

@media (max-width: 1100px) {
  .incense-grid {
    grid-template-columns: repeat(2, minmax(0, 394px));
    width: min(820px, 100%);
  }

  .incense-card:last-child { grid-column: 1 / -1; width: min(394px, 100%); justify-self: center; }
}

@media (max-width: 700px) {
  .incense-section { padding: 0 16px 38px; }
  .incense-heading { height: 128px; }
  .heading-medallion { width: 170px; height: 127px; }
  .heading-medallion img { top: 5px; left: 28px; width: 116px; height: 116px; }
  .heading-row { top: 47px; grid-template-columns: min(22vw, 95px) auto min(22vw, 95px); gap: 7px; }
  .heading-line { width: 100%; height: auto; margin-top: 12px; }
  .heading-row h2 { min-width: auto; font-size: 30px; line-height: 28px; letter-spacing: 1.5px; }
  html[data-locale-layout='international'] .heading-row h2 { font-size: 24px; line-height: 1.2; }
  .incense-heading > p { top: 98px; padding-inline: 18px; font-size: 13px; }
  .incense-grid { grid-template-columns: minmax(0, 394px); width: 100%; gap: 18px; margin-top: 16px; }
  .incense-card:last-child { grid-column: auto; width: 100%; }
  .incense-card-copy { right: 20px; left: 20px; }
  .incense-card-heading h3 { font-size: 30px; }
}

@media (max-width: 390px) {
  .incense-card-heading { gap: 6px 10px; }
  .incense-card-heading h3 { font-size: 26px; }
  .incense-card-heading p,
  .incense-card-description { font-size: 14px; }
}
</style>
