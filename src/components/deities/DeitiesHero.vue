<template>
  <section id="top" class="deities-hero">
    <!-- Figma 的火纹是独立透明切图，文字层保持可翻译、可缩放。 -->
    <img class="hero-art" :src="heroArt" alt="" aria-hidden="true" />

    <header class="hero-heading">
      <p>{{ t('deities.hero.eyebrow') }}</p>
      <h1>{{ t('deities.hero.title') }}</h1>
      <span>{{ t('deities.hero.subtitle') }}</span>
    </header>

    <!-- 卷轴图片只承担装饰，经典引文仍使用真实文本以兼顾多语言和无障碍。 -->
    <blockquote class="hero-quote">
      <img :src="quoteScroll" alt="" aria-hidden="true" />
      <p>{{ t('deities.hero.quote') }}</p>
      <cite>{{ t('deities.hero.quoteSource') }}</cite>
    </blockquote>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import heroArt from '@/assets/deities/hero-art.webp'
import quoteScroll from '@/assets/deities/quote-scroll.webp'

const { t } = useI18n()
</script>

<style scoped>
.deities-hero {
  position: relative;
  height: 474px;
  overflow: hidden;
  background: linear-gradient(180deg, #fff8ef 0%, #f9f3eb 72%, #f3f0e9 100%);
}

.hero-art {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin-left: 0;
  max-width: none;
  object-fit: cover;
  object-position: center;
  transform: none;
}

.hero-heading {
  position: absolute;
  z-index: 1;
  top: 120px;
  left: 50%;
  width: min(92vw, 620px);
  text-align: center;
  transform: translateX(-50%);
}

.hero-heading p,
.hero-heading h1,
.hero-heading span {
  display: block;
  margin: 0;
}

.hero-heading p {
  color: #d0a06d;
  font-family: var(--font-dyming-a);
  font-size: 24px;
  font-weight: 600;
  line-height: 22px;
}

.hero-heading h1 {
  margin-top: 12px;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 2px;
}

.hero-heading span {
  margin-top: 10px;
  color: #333;
  font-size: 16px;
  line-height: 1.25;
}

.hero-quote {
  position: absolute;
  z-index: 1;
  top: 254px;
  left: 50%;
  width: 663px;
  height: 140px;
  margin: 0;
  color: #8e6e49;
  transform: translateX(-50%);
}

.hero-quote img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-quote p,
.hero-quote cite {
  position: absolute;
  z-index: 1;
  margin: 0;
  font-style: normal;
}

.hero-quote p {
  top: 31px;
  left: 50%;
  width: calc(100% - 120px);
  font-family: var(--font-calligraphy);
  font-size: 32px;
  line-height: 42px;
  text-align: center;
  transform: translateX(-50%);
}

.hero-quote cite {
  right: 52px;
  bottom: 22px;
  font-family: var(--font-dyming-a);
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
}

@media (max-width: 760px) {
  .deities-hero { height: 392px; }
  .hero-art { top: 0; width: 100%; height: 100%; object-position: center center; opacity: .24; }
  .hero-heading { top: 70px; }
  .hero-heading p { font-size: 17px; }
  .hero-heading h1 { margin-top: 8px; font-size: 34px; }
  .hero-heading span { margin-top: 10px; padding-inline: 22px; font-size: 13px; }
  .hero-quote { top: 218px; width: min(94vw, 663px); height: auto; aspect-ratio: 663 / 140; }
  .hero-quote p { top: 22%; width: 78%; font-size: clamp(16px, 4.5vw, 25px); line-height: 1.35; }
  .hero-quote cite { right: 8%; bottom: 14%; font-size: clamp(9px, 2.5vw, 13px); }
}

:global(html[data-locale-layout='international'] .hero-heading p) {
  font-family: var(--font-ui-international);
  font-size: 20px;
  letter-spacing: .04em;
}

:global(html[data-locale-layout='international'] .hero-heading h1) {
  font-family: var(--font-serif-cn);
  font-size: 36px;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .hero-heading span) {
  font-size: 15px;
}

:global(html[data-locale-layout='international'] .hero-quote p) {
  top: 28px;
  font-family: var(--font-serif-cn);
  font-size: 23px;
  line-height: 1.35;
}

:global(html[data-locale-layout='international'] .hero-quote cite) {
  max-width: 70%;
  font-family: var(--font-serif-cn);
  font-size: 13px;
  text-align: right;
}

@media (max-width: 760px) {
  /* 英文引文更长：增加卷轴纵向空间，避免正文与出处互相覆盖。 */
  :global(html[data-locale-layout='international'] .deities-hero) { height: 420px; }
  :global(html[data-locale-layout='international'] .hero-quote) { top: 218px; height: 132px; aspect-ratio: auto; }
  :global(html[data-locale-layout='international'] .hero-quote p) { top: 18px; width: 82%; font-size: 19px; line-height: 1.25; }
  :global(html[data-locale-layout='international'] .hero-quote cite) { right: 9%; bottom: 13px; max-width: 76%; font-size: 11px; line-height: 1.2; }
}
</style>
