<template>
  <!-- 云监工页头图区：标题居上，语录叠加在卷轴底图上。 -->
  <section id="top" class="cloud-build-hero">
    <PageHeroBackground />

    <header class="hero-heading">
      <p>{{ t('cloudBuild.hero.eyebrow') }}</p>
      <h1>{{ t('cloudBuild.hero.title') }}</h1>
      <span>{{ t('cloudBuild.hero.subtitle') }}</span>
    </header>

    <blockquote class="hero-quote">
      <img :src="quoteScroll" alt="" aria-hidden="true" />
      <p>{{ t('cloudBuild.hero.quote') }}</p>
      <cite>{{ t('cloudBuild.hero.quoteSource') }}</cite>
    </blockquote>
  </section>
</template>

<script setup>
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import { useI18n } from 'vue-i18n'
import quoteScroll from '@/assets/deities/quote-scroll.webp'

const { t } = useI18n()
</script>

<style scoped>
.cloud-build-hero {
  isolation: isolate;
  position: relative;
  height: 485px;
  overflow: visible;
  background: #f3f0e9;
}

.hero-heading {
  position: absolute;
  z-index: 1;
  top: 119px;
  left: 50%;
  width: 512px;
  text-align: center;
  transform: translateX(-50%);
}

.hero-heading :is(p, h1, span) {
  display: block;
  margin: 0;
}

.hero-heading p {
  color: #d0a06d;
  font-family: var(--font-dyming-a);
  font-size: 24px;
  line-height: 22px;
}

.hero-heading h1 {
  margin-top: 12px;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 38px;
}

.hero-heading span {
  margin-top: 14px;
  color: #333;
  font-size: 16px;
  line-height: 15px;
}

/* 语录块：卷轴底图 + 居中文字 + 右下署名。 */
.hero-quote {
  position: absolute;
  z-index: 1;
  top: 243px;
  left: 50%;
  width: 707px;
  height: 162px;
  margin: 0;
  color: #8e6e49;
  transform: translateX(-50%);
}

.hero-quote>img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hero-quote :is(p, cite) {
  position: absolute;
  z-index: 1;
  margin: 0;
  font-style: normal;
}

.hero-quote p {
  top: 49px;
  left: 50%;
  width: 660px;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  line-height: 40px;
  text-align: center;
  white-space: nowrap;
  transform: translateX(-50%);
}

.hero-quote cite {
  top: 109px;
  right: 96px;
  font-family: var(--font-dyming-a);
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
}

:global(html[data-locale-layout='international'] .cloud-build-hero .hero-heading h1),
:global(html[data-locale-layout='international'] .cloud-build-hero .hero-quote p) {
  font-family: Georgia, serif;
}

:global(html[data-locale-layout='international'] .cloud-build-hero .hero-heading h1) {
  font-size: 36px;
}

:global(html[data-locale-layout='international'] .cloud-build-hero .hero-quote p) {
  top: 43px;
  width: 600px;
  font-size: 23px;
  line-height: 30px;
  white-space: normal;
}

:global(html[data-locale-layout='international'] .cloud-build-hero .hero-quote cite) {
  top: auto;
  bottom: 25px;
  max-width: 70%;
  font-size: 13px;
  text-align: right;
}

@media (max-width: 760px) {
  .cloud-build-hero {
    height: 410px;
    overflow: hidden;
  }

  .hero-heading {
    top: 68px;
    width: calc(100% - 30px);
  }

  .hero-heading p {
    font-size: 18px;
  }

  .hero-heading h1 {
    margin-top: 8px;
    font-size: 34px;
  }

  .hero-heading span {
    margin-top: 12px;
    font-size: 14px;
  }

  .hero-quote {
    top: 205px;
    width: min(94vw, 707px);
    height: 160px;
  }

  .hero-quote p {
    top: 28px;
    width: 82%;
    font-size: clamp(18px, 5vw, 27px);
    line-height: 1.35;
    white-space: normal;
  }

  .hero-quote cite {
    top: auto;
    right: 10%;
    bottom: 15px;
    font-size: clamp(10px, 2.8vw, 13px);
  }

  :global(html[data-locale-layout='international'] .cloud-build-hero .hero-quote p) {
    top: 32px;
    width: 78%;
    font-size: 18px;
    line-height: 1.25;
  }

  :global(html[data-locale-layout='international'] .cloud-build-hero .hero-quote cite) {
    bottom: 17px;
  }
}
</style>
