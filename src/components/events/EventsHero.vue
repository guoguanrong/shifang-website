<template>
  <!-- 活动页头图区：标题、卷轴语录与简介三段构成。 -->
  <section class="events-hero">
    <PageHeroBackground />
    <div class="hero-copy"><p>{{ t('events.hero.eyebrow') }}</p><h1>{{ t('events.hero.title') }}</h1><small>{{ t('events.hero.subtitle') }}</small></div>
    <div class="hero-quote"><p>{{ t('events.hero.quote') }}</p><small>{{ t('events.hero.quoteSource') }}</small></div>
    <p class="hero-intro">{{ t('events.hero.intro') }}</p>
  </section>
</template>
<script setup>
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<style scoped>
.events-hero {
  isolation: isolate; position: relative; min-height: 546px; padding: 119px 24px 36px; font-family: var(--font-calligraphy); }

.hero-copy { width: min(100%, 700px); margin: 0 auto; text-align: center; }
.hero-copy p { margin: 0; color: #d0a06d; font-size: 24px; line-height: 22px; }
.hero-copy h1 { margin: 11px 0 8px; color: #1d4e6e; font-size: 42px; font-weight: 400; line-height: 44px; letter-spacing: 2px; }
.hero-copy small { display: block; color: #333; font-size: 16px; line-height: 18px; }
/* 语录区：卷轴底图 + 居中文字 + 右对齐出处。 */
.hero-quote { display: flex; flex-direction: column; justify-content: center; width: min(707px, 100%); min-height: 162px; padding: 35px 30px 20px; margin: 21px auto 0; color: #8e6e49; background: url('@/assets/events/quote-scroll.webp') center / 100% 100% no-repeat; }
.hero-quote p { margin: 0; font-size: 32px; line-height: 44px; text-align: center; white-space: nowrap; letter-spacing: -1px; }
.hero-quote small { display: block; margin-top: 11px; padding-right: 40px; font-family: var(--font-dyming-a); font-size: 16px; line-height: 20px; text-align: right; }
.hero-intro { width: min(879px, 100%); margin: 49px auto 0; color: #333; font-size: 16px; line-height: 28px; letter-spacing: .8px; text-align: center; text-indent: 35px; }
@media (max-width: 900px) {
  .events-hero { min-height: 0; padding: 76px 20px 40px; }
  .hero-copy p { font-size: 18px; }
  .hero-copy h1 { font-size: 34px; }
  .hero-copy small { font-size: 14px; line-height: 22px; }
  .hero-quote { margin-top: 28px; padding: 30px 8% 24px; }
  .hero-quote p { font-size: clamp(20px, 3.5vw, 28px); line-height: 32px; white-space: normal; letter-spacing: 0; }
  .hero-quote small { padding: 0; font-size: 13px; line-height: 20px; }
  .hero-intro { margin-top: 30px; font-size: 14px; line-height: 24px; text-indent: 0; }
}
:global(html[data-locale-layout='international'] .events-hero .hero-copy h1) { line-height: 1.2; }
:global(html[data-locale-layout='international'] .events-hero .hero-quote p) { font-size: 23px; line-height: 32px; white-space: normal; letter-spacing: 0; }
:global(html[data-locale-layout='international'] .events-hero .hero-intro) { letter-spacing: 0; text-indent: 0; }
@media (max-width: 600px) {
  :global(html[data-locale-layout='international'] .events-hero .hero-quote p) { font-size: 18px; line-height: 26px; }
}
</style>
