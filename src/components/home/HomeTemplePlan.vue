<template>
  <section id="temple-plan" class="temple-plan" aria-labelledby="temple-title">
    <header class="temple-heading">
      <p>{{ t('templePlan.en') }}</p>
      <h2 id="temple-title">{{ t('templePlan.title') }}</h2>
      <span>{{ t('templePlan.subtitle') }}</span>
    </header>

    <div class="temple-grid">
      <article
        v-for="(card, index) in templeCards"
        :key="card.title"
        class="temple-card"
        :class="{ 'temple-card-first': index === 0 }"
        tabindex="0"
      >
        <img class="temple-card-photo" :src="cardPhotos[index]" :alt="card.title" />
        <div class="temple-card-shade" aria-hidden="true" />
        <div class="temple-card-copy">
          <img class="temple-card-symbol" :src="cardSymbols[index]" alt="" />
          <div class="temple-card-text">
            <h3>{{ card.title }}</h3>
            <div class="temple-card-desc">
              <p>{{ card.description }}</p>
            </div>
          </div>
          <img  class="temple-card-arrow" :src="cardArrow" alt="" />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import templePhoto1 from '@/assets/home/temple-plan/doumu-hall.webp'
import templePhoto2 from '@/assets/home/temple-plan/statue.webp'
import templePhoto3 from '@/assets/home/temple-plan/mural.webp'
import templePhoto4 from '@/assets/home/temple-plan/garden.webp'
import firstSymbol from '@/assets/home/temple-plan/frame.svg'
import secondSymbol from '@/assets/home/temple-plan/symbol.webp'
import thirdSymbol from '@/assets/home/temple-plan/icon-1.svg'
import fourthSymbol from '@/assets/home/temple-plan/icon-2.svg'
import cardArrow from '@/assets/home/temple-plan/arrow.svg'

const { t, tm } = useI18n()
const cardPhotos = [templePhoto1, templePhoto2, templePhoto3, templePhoto4]
const cardSymbols = [firstSymbol, secondSymbol, thirdSymbol, fourthSymbol]
const templeCards = computed(() => tm('templePlan.cards').map(card => ({
  title: card.title,
  description: card.desc,
})))
</script>

<style scoped>
.temple-plan {
  position: absolute;
  top: 1173px;
  left: 50%;
  width: 1440px;
  height: 592px;
  transform: translateX(-50%);
}

.temple-heading {
  position: absolute;
  inset: 0 0 auto;
  height: 111px;
  text-align: center;
}

.temple-heading p,
.temple-heading h2,
.temple-heading span {
  position: absolute;
  left: 50%;
  width: max-content;
  max-width: calc(100% - 32px);
  margin: 0;
  transform: translateX(-50%);
}

.temple-heading p {
  top: 0;
  color: #d0a06d;
  font-size: 24px;
  line-height: 30px;
}

.temple-heading h2 {
  top: 38px;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 1.1;
}

.temple-heading span {
  top: 95px;
  color: #333;
  font-size: 16px;
  line-height: 20px;
}

.temple-grid {
  position: absolute;
  top: 160px;
  left: 50%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(1200px, calc(100% - 48px));
  transform: translateX(-50%);
}

.temple-card {
  --temple-desc-gap: 16px;
  position: relative;
  min-width: 0;
  overflow: hidden;
  aspect-ratio: 300 / 431;
  color: #fff;
  isolation: isolate;
  transition: transform .22s ease, box-shadow .22s ease;
}

.temple-card:focus-visible {
  outline: 2px solid rgba(208, 160, 109, .9);
  outline-offset: 2px;
}

.temple-card-photo,
.temple-card-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.temple-card-photo {
  object-fit: cover;
  transition: transform .35s ease;
}

.temple-card-shade {
  z-index: 1;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, .8) 80.006%);
  pointer-events: none;
}

.temple-card:not(.temple-card-first) .temple-card-shade {
  top: auto;
  height: 50%;
  transition: height .4s ease;
}

.temple-card-copy {
  position: absolute;
  z-index: 2;
  right: 30px;
  bottom: 30px;
  left: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.temple-card-symbol {
  display: block;
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.temple-card-text {
  width: 100%;
}

/* 描述默认折叠，悬停/聚焦时展开。 */
.temple-card-desc {
  display: grid;
  grid-template-rows: 0fr;
  margin-top: 0;
  opacity: 0;
  transform: translateY(6px);
  transition: grid-template-rows .4s ease, margin-top .4s ease, opacity .28s ease, transform .4s ease;
}

.temple-card:hover .temple-card-desc,
.temple-card:focus-within .temple-card-desc {
  grid-template-rows: 1fr;
  margin-top: var(--temple-desc-gap);
  opacity: 1;
  transform: none;
}

.temple-card:not(.temple-card-first):hover .temple-card-shade,
.temple-card:not(.temple-card-first):focus-within .temple-card-shade {
  height: 80%;
}

.temple-card h3 {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 1;
  overflow-wrap: anywhere;
}

.temple-card-desc p {
  min-height: 0;
  margin: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, .7);
  font-family: var(--font-calligraphy);
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: 1.2px;
}

.temple-card-arrow {
  display: block;
  width: 22px;
  height: 22px;
  margin-top: -8px;
  object-fit: contain;
  transition: height .35s ease, margin-top .35s ease, opacity .25s ease;
}

/* 展开描述时箭头淡出并收起占位。 */
.temple-card:hover .temple-card-arrow,
.temple-card:focus-within .temple-card-arrow {
  height: 0;
  margin-top: -24px;
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .temple-card:hover {
    z-index: 3;
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(35, 29, 21, .28);
  }

  .temple-card:hover .temple-card-photo {
    transform: scale(1.045);
  }
}

html[data-locale-layout='international'] .temple-heading h2 {
  font-family: var(--font-serif-cn);
  font-size: 34px;
}

html[data-locale-layout='international'] .temple-card-copy {
  right: 24px;
  left: 24px;
}

html[data-locale-layout='international'] .temple-card h3 {
  font-family: var(--font-serif-cn);
  font-size: 25px;
  line-height: 1.15;
}

html[data-locale-layout='international'] .temple-card-desc p {
  font-family: var(--font-serif-cn);
  font-size: 14px;
  letter-spacing: 0;
}

@media (max-width: 1439px) and (min-width: 901px) {
  .temple-plan { width: 100vw; }
  .temple-card { --temple-desc-gap: 8px; }
  .temple-card-copy { right: 20px; bottom: 22px; left: 20px; gap: 16px; }
  .temple-card-symbol { width: 34px; height: 34px; }
  .temple-card h3 { font-size: 27px; line-height: 1.1; }
  .temple-card-desc p { font-size: 13px; line-height: 1.35; letter-spacing: .6px; }
  .temple-card-arrow { margin-top: -8px; }
}

@media (max-width: 900px) {
  .temple-plan {
    position: relative;
    inset: auto;
    width: 100%;
    height: auto;
    padding: 65px 20px 70px;
    transform: none;
  }

  .temple-heading {
    position: relative;
    height: 111px;
  }

  .temple-grid {
    position: relative;
    top: auto;
    left: auto;
    grid-template-columns: repeat(2, minmax(0, 300px));
    width: min(100%, 620px);
    margin: 0 auto;
    gap: 20px;
    transform: none;
  }

  .temple-card-copy {
    right: 20px;
    left: 20px;
    bottom: 22px;
    gap: 16px;
  }

  .temple-card { --temple-desc-gap: 10px; }

  .temple-card h3 {
    font-size: 26px;
  }

  .temple-card-desc p {
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .temple-plan { padding: 55px 20px 60px; }
  .temple-heading { height: 120px; }
  .temple-heading p { font-size: 18px; }
  .temple-heading h2 { top: 34px; font-size: 32px; }
  .temple-heading span { top: 84px; width: calc(100% - 32px); white-space: normal; }
  html[data-locale-layout='international'] .temple-heading h2 { font-size: 26px; white-space: normal; }
  .temple-grid { grid-template-columns: minmax(0, 360px); width: 100%; gap: 16px; }
  .temple-card-copy { right: 26px; left: 26px; bottom: 26px; }
  .temple-card h3 { font-size: 30px; }
  .temple-card-desc p { font-size: 15px; }
}

@media (max-width: 600px) and (min-width: 400px) {
  html[data-locale-layout='international'] .temple-card h3 { font-size: 24px; }
}
</style>
