<template>
  <section id="top" class="etiquette-hero">
    <PageHeroBackground />
    <div class="hero-heading">
      <p>{{ t('etiquette.hero.eyebrow') }}</p>
      <h1>{{ t('etiquette.hero.title') }}</h1>
      <span>{{ t('etiquette.hero.subtitle') }}</span>
    </div>
    <blockquote>
      <img :src="quoteScroll" alt="" />
      <p>{{ t('etiquette.hero.quote') }}</p>
      <cite>{{ t('etiquette.hero.quoteSource') }}</cite>
    </blockquote>
    <p class="hero-intro">
      <!-- 两大环节专名需要单独标红，因此按段渲染，避免在文案里内嵌 HTML。 -->
      <template v-for="(part, index) in introParts" :key="index">
        <em v-if="part.accent" class="hero-intro-accent">{{ part.text }}</em>
        <template v-else>{{ part.text }}</template>
      </template>
    </p>
  </section>
</template>

<script setup>
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import quoteScroll from '@/assets/etiquette/quote-scroll.webp'

const { t, tm } = useI18n()

// 首屏说明按段拆开，便于单独突出“上香许愿”与“参拜神像”两个环节。
const introParts = computed(() => tm('etiquette.hero.intro'))
</script>

<style scoped>
.etiquette-hero {
  isolation: isolate;
  position: relative;
  height: 542px;
  overflow: hidden;
  background: #f8f5ed;
}

.hero-heading {
  position: relative;
  z-index: 1;
  padding-top: 115px;
  text-align: center;
}

.hero-heading p {
  margin: 0 0 4px;
  color: #d0a06d;
  font-family: var(--font-calligraphy);
  font-size: 24px;
  line-height: 1;
}

.hero-heading h1 {
  margin: 0;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: 4px;
}

.hero-heading span {
  display: block;
  margin-top: 8px;
  font-family: var(--font-calligraphy);
  color: #333;
  font-size: 18px;
  letter-spacing: 2px;
}

blockquote {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: center;
  width: 707px;
  height: 162px;
  padding: 15px 28px 18px;
  margin: 20px auto 0;
  color: #8c6b42;
  text-align: center;
}

blockquote img {
  position: absolute;
  z-index: -1;
  inset: 0;
  width: 100%;
  height: 100%;
}

blockquote p {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 29px;
  line-height: 1.35;
  letter-spacing: 2px;
}

blockquote cite {
  margin-top: 14px;
  padding-right: 28px;
  font-size: 16px;
  font-style: normal;
  text-align: right;
}

.hero-intro {
  position: relative;
  z-index: 1;
  width: min(880px, calc(100% - 40px));
  font-family: var(--font-calligraphy);
  margin: 22px auto 0;
  color: #333;
  font-size: 15px;
  line-height: 1.85;
  text-align: center;
  letter-spacing: .8px;
}

/* 两大环节的专名用印章红突出，作为整段说明的视觉落点。 */
.hero-intro-accent {
  color: #7F0001;
  font-style: normal;
  font-weight: 700;
}

@media (max-width: 760px) {
  .etiquette-hero {
    height: auto;
    min-height: 560px;
    padding: 0 18px 54px;
  }

  .hero-heading {
    padding-top: 70px;
  }

  .hero-heading p {
    font-size: 18px;
  }

  .hero-heading h1 {
    font-size: 34px;
  }

  .hero-heading span {
    font-size: 13px;
    letter-spacing: .8px;
  }

  blockquote {
    width: min(100%, 600px);
    height: 132px;
    padding: 20px 9vw 14px;
  }

  blockquote p {
    font-size: 18px;
    letter-spacing: .5px;
  }

  blockquote cite {
    padding-right: 0;
    font-size: 11px;
    text-align: center;
  }

  .hero-intro {
    width: 100%;
    margin-top: 18px;
    font-size: 13px;
    line-height: 1.7;
    text-align: left;
  }
}

:global(html[data-locale-layout='international'] .etiquette-hero .hero-heading h1),
:global(html[data-locale-layout='international'] .etiquette-hero blockquote p) {
  font-family: Georgia, serif;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .etiquette-hero .hero-heading h1) {
  font-size: 38px;
}

:global(html[data-locale-layout='international'] .etiquette-hero blockquote p) {
  font-size: 20px;
}

:global(html[data-locale-layout='international'] .etiquette-hero .hero-intro) {
  font-family: Georgia, serif;
  letter-spacing: 0;
}
</style>
