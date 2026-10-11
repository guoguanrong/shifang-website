<template>
  <section class="knowledge-section">
    <WellnessSectionHeading
      :eyebrow="t('wellness.knowledge.eyebrow')"
      :title="t('wellness.knowledge.title')"
      :subtitle="t('wellness.knowledge.subtitle')"
    />

    <div class="knowledge-grid">
      <article v-for="(item, index) in items" :key="item.title">
        <!-- 卡片下半部采用设计稿的半透明白色渐变，确保文字在照片上清晰可读。 -->
        <img :src="articleImages[index]" alt="" />
        <div class="knowledge-copy">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <small>{{ item.meta }}</small>
        </div>
      </article>
    </div>
    <button class="more-button" type="button">{{ t('wellness.knowledge.more') }}<span aria-hidden="true">›</span></button>
    <WellnessQuote class="closing-quote" closing :quote="t('wellness.closing.quote')" :source="t('wellness.closing.quoteSource')" />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import massage from '@/assets/wellness/article-massage.webp'
import meditation from '@/assets/wellness/article-meditation.webp'
import neijing from '@/assets/wellness/article-neijing.webp'
import qianjin from '@/assets/wellness/article-qianjin.webp'
import sleep from '@/assets/wellness/article-sleep.webp'
import tea from '@/assets/wellness/article-tea.webp'
import WellnessQuote from './WellnessQuote.vue'
import WellnessSectionHeading from './WellnessSectionHeading.vue'

const { t, tm } = useI18n()
const items = computed(() => tm('wellness.knowledge.items'))
const articleImages = [neijing, qianjin, sleep, massage, tea, meditation]
</script>

<style scoped>
.knowledge-section { height: 1051px; overflow: hidden; background: #f3f0e9; }
.knowledge-grid { display: grid; grid-template-columns: repeat(3, 446.67px); gap: 30px 50px; width: 1440px; margin: 37px auto 0; }
.knowledge-grid article { position: relative; height: 280px; overflow: hidden; background: #fff; border-radius: 12px; transition: box-shadow .25s ease, transform .25s ease; }
.knowledge-grid article > img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.knowledge-grid article:nth-child(3) > img { object-position: center 26%; }.knowledge-grid article:nth-child(4) > img { object-position: center 44%; }.knowledge-grid article:nth-child(6) > img { object-position: center 24%; }
.knowledge-copy { position: absolute; right: 0; bottom: 0; left: 0; height: 132px; padding: 28px 20px 8px; color: #333; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.7) 30%, #fff 70%); backdrop-filter: blur(3px); }
.knowledge-copy h3 { margin: 0 0 5px; font-family: var(--font-calligraphy); font-size: 18px; font-weight: 400; line-height: 20px; letter-spacing: 1.8px; }
.knowledge-copy p { height: 40px; margin: 0; font-size: 12px; line-height: 20px; letter-spacing: 1.2px; }
.knowledge-copy small { display: block; margin-top: 7px; color: #9e9e9e; font-size: 10px; line-height: 20px; letter-spacing: 1px; white-space: pre-wrap; }
.more-button { display: flex; align-items: center; justify-content: center; gap: 3px; min-width: 140px; height: 36px; padding: 0 12px 0 23px; margin: 30px auto 0; color: #fff; font-family: var(--font-calligraphy); font-size: 16px; letter-spacing: 1.6px; background: #cc3513; border: 0; border-radius: 100px; box-shadow: inset 0 0 0 2px #cc3513, inset 0 0 0 2.5px #f2d2af; cursor: pointer; transition: filter .2s ease, transform .2s ease; }
.more-button span { font-family: Arial, sans-serif; font-size: 27px; line-height: 1; }
.closing-quote { margin: 34px auto 0; }
@media (hover: hover) and (pointer: fine) { .knowledge-grid article:hover { box-shadow: 0 16px 35px rgba(35,57,70,.15); transform: translateY(-6px); }.knowledge-grid article:hover > img { transform: scale(1.045); }.more-button:hover { filter: brightness(1.08); transform: translateY(-2px); } }

@media (max-width: 1439px) { .knowledge-section { height: auto; padding-bottom: 60px; }.knowledge-grid { grid-template-columns: repeat(2, minmax(0, 380px)); justify-content: center; width: calc(100% - 40px); } }
@media (max-width: 820px) { .knowledge-grid { grid-template-columns: minmax(0, 380px); margin-top: 38px; }.closing-quote { margin-top: 42px; } }
@media (max-width: 430px) { .knowledge-grid { width: calc(100% - 28px); grid-template-columns: 1fr; }.knowledge-copy { padding-inline: 17px; }.knowledge-copy p { font-size: 11px; line-height: 18px; }.knowledge-copy small { margin-top: 7px; } }

:global(html[data-locale-layout='international'] .knowledge-section h3),
:global(html[data-locale-layout='international'] .knowledge-section p),
:global(html[data-locale-layout='international'] .knowledge-section small),
:global(html[data-locale-layout='international'] .knowledge-section button) { font-family: Georgia, serif; letter-spacing: 0; }
:global(html[data-locale-layout='international'] .knowledge-section .knowledge-copy h3) { font-size: 16px; }
:global(html[data-locale-layout='international'] .knowledge-section .knowledge-copy p) { font-size: 11px; line-height: 17px; }
</style>
