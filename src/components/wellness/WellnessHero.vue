<template>
  <section id="top" class="wellness-hero">
    <!-- 顶部大背景统一沿用神祇百科，正文与八卦卡片保留独立布局。 -->
    <PageHeroBackground />

    <div class="hero-heading">
      <p>{{ t('wellness.hero.eyebrow') }}</p>
      <h1>{{ t('wellness.hero.title') }}</h1>
      <span>{{ t('wellness.hero.subtitle') }}</span>
    </div>

    <WellnessQuote class="opening-quote" :quote="t('wellness.hero.quote')" :source="t('wellness.hero.quoteSource')" />

    <div class="hero-story">
      <article>
        <h2>{{ t('wellness.hero.lead') }}</h2>
        <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
      </article>
      <div class="hero-bagua-panel">
        <WellnessBagua />
      </div>
    </div>
  </section>
</template>

<script setup>
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import WellnessBagua from './WellnessBagua.vue'
import WellnessQuote from './WellnessQuote.vue'

const { t, tm } = useI18n()
const paragraphs = computed(() => tm('wellness.hero.paragraphs'))
</script>

<style scoped>
.wellness-hero {
  isolation: isolate;
  position: relative;
  min-height: 979px;
  padding: 119px 24px 78px;
  overflow: hidden;
  font-family: var(--font-calligraphy);
  background: #f8f5ed;
}

.hero-heading {
  position: relative;
  width: min(700px, 100%);
  margin: 0 auto;
  text-align: center;
}

.hero-heading p {
  margin: 0;
  color: #d0a06d;
  font-size: 24px;
  line-height: 22px;
}

.hero-heading h1 {
  margin: 11px 0 0;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 44px;
  letter-spacing: 3px;
}

.hero-heading span {
  display: block;
  margin-top: 8px;
  color: #333;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: .8px;
}

.opening-quote {
  margin: 23px auto 0;
}

.opening-quote :deep(p) {
  font-size: 32px;
  white-space: nowrap;
  letter-spacing: -1.3px;
}

.opening-quote :deep(cite) {
  margin-top: 13px;
}

.opening-quote {
  padding-inline: 30px;
}

.hero-story {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 587px) minmax(0, 1fr);
  gap: 80px;
  width: min(1240px, 100%);
  min-height: 425px;
  margin: 69px auto 0;
}

.hero-story::before {
  position: absolute;
  top: 0;
  bottom: 0;
  right: calc(100% + 80px);
  width: 100vw;
  content: '';
  background: linear-gradient(#cc3513, #d45f45);
}

.hero-story article {
  min-width: 0;
  padding-top: 92px;
  color: #333;
}

.hero-story h2 {
  margin: 0 0 24px;
  color: #2e4c7c;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: .8px;
}

.hero-story p {
  margin: 0;
  font-size: 16px;
  line-height: 28px;
  text-align: justify;
  letter-spacing: .8px;
}

.hero-bagua-panel {
  position: relative;
  isolation: isolate;
  padding: 7px 0 6px 17px;
}

.hero-bagua-panel::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0 auto 0 0;
  width: 100vw;
  background: linear-gradient(#cc3513, transparent), #d45f45;
}

.hero-bagua-panel::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0 auto 0 0;
  width: 100vw;
  background: url('@/assets/wellness/design/bagua-texture.webp') top left / 512px;
  mix-blend-mode: luminosity;
  opacity: .05;
  mask-image: linear-gradient(transparent, #000);
}

@media (max-width: 1279px) {
  .hero-story {
    grid-template-columns: minmax(0, 1fr) 409px;
    gap: 40px;
  }

  .hero-story article {
    padding-block: 50px 30px;
  }
}

@media (max-width: 900px) {
  .wellness-hero {
    min-height: 0;
    padding: 70px 20px 64px;
  }

  .hero-story {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    max-width: 680px;
    margin-top: 48px;
  }

  .hero-story article {
    padding: 0;
  }

  .hero-story h2 {
    line-height: 1.3;
    text-align: center;
  }

  .hero-story p {
    font-size: 15px;
    line-height: 26px;
  }

  .hero-story::before {
    display: none;
  }

  .hero-bagua-panel {
    display: flex;
    justify-content: center;
    padding: 12px;
  }

  .hero-bagua-panel::before,
  .hero-bagua-panel::after {
    width: 100%;
  }

  .opening-quote {
    max-width: 100%;
    height: auto;
    min-height: 162px;
    padding: 28px 8%;
  }

  .opening-quote :deep(p) {
    font-size: clamp(18px, 3.5vw, 28px);
    white-space: normal;
    letter-spacing: 0;
  }
}

@media (max-width: 520px) {
  .hero-heading p {
    font-size: 18px;
  }

  .hero-heading h1 {
    font-size: 34px;
    line-height: 1.2;
  }

  .hero-heading span {
    font-size: 13px;
    line-height: 20px;
  }

  .hero-story h2 {
    font-size: 26px;
  }

  .hero-story p {
    font-size: 14px;
    line-height: 24px;
    letter-spacing: .3px;
  }

  .hero-bagua-panel {
    height: 324px;
    padding: 10px 0;
  }

  .hero-bagua-panel :deep(.bagua) {
    transform: scale(.72);
    transform-origin: top center;
    margin-bottom: -115px;
  }
}

:global(html[data-locale-layout='international'] .wellness-hero .hero-heading h1),
:global(html[data-locale-layout='international'] .wellness-hero .hero-story h2) {
  font-family: Georgia, serif;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .wellness-hero .hero-story h2) {
  line-height: 1.3;
  font-size: 28px;
}

:global(html[data-locale-layout='international'] .wellness-hero .hero-story p) {
  font-family: Georgia, serif;
  line-height: 25px;
  letter-spacing: 0;
  text-align: left;
}

:global(html[data-locale-layout='international'] .wellness-hero .opening-quote) {
  height: auto;
  min-height: 162px;
  padding-inline: 8%;
}

:global(html[data-locale-layout='international'] .wellness-hero .opening-quote p) {
  font-size: 21px;
  white-space: normal;
  letter-spacing: 0;
}

@media (max-width: 520px) {
  :global(html[data-locale-layout='international'] .wellness-hero .hero-heading h1) {
    font-size: 30px;
  }

  :global(html[data-locale-layout='international'] .wellness-hero .opening-quote p) {
    font-size: 15px;
  }
}
</style>
