<template>
  <section class="methods-section">
    <WellnessSectionHeading
      :eyebrow="t('wellness.methods.eyebrow')"
      :title="t('wellness.methods.title')"
      :subtitle="t('wellness.methods.subtitle')"
    />

    <div class="methods-grid">
      <article v-for="(item, index) in items" :key="item.title" class="method-card">
        <!-- 卡框、圆形边饰和主图均使用设计稿资源，文字仍保持真实 DOM。 -->
        <img class="frame outer" :src="frameOuter" alt="" />
        <img class="frame inner" :src="frameInner" alt="" />
        <div class="method-portrait">
          <img class="circle" :src="methodCircle" alt="" />
          <img class="photo" :src="methodImages[index]" alt="" />
          <i class="portrait-diamond left" /><i class="portrait-diamond right" />
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import methodCircle from '@/assets/wellness/method-circle.svg'
import methodDiet from '@/assets/wellness/method-diet.webp'
import frameInner from '@/assets/wellness/method-frame-inner.svg'
import frameOuter from '@/assets/wellness/method-frame-outer.svg'
import methodGuidance from '@/assets/wellness/method-guidance.webp'
import methodMedicine from '@/assets/wellness/method-medicine.webp'
import methodMeditation from '@/assets/wellness/method-meditation.webp'
import methodSeasons from '@/assets/wellness/method-seasons.webp'
import methodTaiji from '@/assets/wellness/method-taiji.webp'
import WellnessSectionHeading from './WellnessSectionHeading.vue'

const { t, tm } = useI18n()
const items = computed(() => tm('wellness.methods.items'))
const methodImages = [methodGuidance, methodMeditation, methodDiet, methodSeasons, methodTaiji, methodMedicine]
</script>

<style scoped>
.methods-section { height: 1153px; background: #f8f5ed; }
.methods-grid { display: grid; grid-template-columns: repeat(3, 466.67px); grid-template-rows: 431px 451px; gap: 30px 20px; width: 1440px; margin: 59px auto 0; }
.method-card { position: relative; text-align: center; transition: filter .25s ease, transform .25s ease; }
.frame { position: absolute; pointer-events: none; }
.frame.outer { top: 31px; left: 0; width: 466.67px; height: calc(100% - 31px); }
.frame.inner { top: 38px; left: 6px; width: 454.67px; height: calc(100% - 44px); }
.method-portrait { position: absolute; z-index: 2; top: 0; left: 110.33px; width: 246px; height: 240px; }
.method-portrait .circle { position: absolute; top: 0; left: 4px; width: 240px; height: 240px; }
.method-portrait .photo { position: absolute; top: 5px; left: 9px; width: 230px; height: 230px; object-fit: cover; border-radius: 50%; }
.portrait-diamond { position: absolute; top: 116px; width: 6px; height: 6px; background: linear-gradient(#f2d2af, #d7b591); transform: rotate(45deg); }
.portrait-diamond.left { left: 0; }.portrait-diamond.right { right: 0; }
h3 { position: absolute; z-index: 2; top: 250px; left: 20px; width: 426.67px; margin: 0; color: #000; font-family: var(--font-calligraphy); font-size: 32px; font-weight: 400; line-height: 42px; }
.method-card p { position: absolute; z-index: 2; top: 313px; left: 26px; width: 427.67px; margin: 0; color: #333; font-size: 16px; line-height: 20px; text-align: justify; letter-spacing: 1.6px; }
@media (hover: hover) and (pointer: fine) { .method-card:hover { filter: brightness(1.02); transform: translateY(-6px); } }

@media (max-width: 1439px) { .methods-section { height: auto; padding-bottom: 80px; }.methods-grid { grid-template-columns: repeat(2, 400px); grid-template-rows: none; justify-content: center; width: calc(100% - 40px); }.method-card { height: 451px; } }
@media (max-width: 860px) { .methods-grid { grid-template-columns: minmax(0, 400px); margin-top: 44px; gap: 28px; } }
@media (max-width: 460px) { .methods-grid { width: calc(100% - 28px); grid-template-columns: 1fr; }.method-card { height: 440px; }.frame.outer { width: 100%; }.frame.inner { width: calc(100% - 12px); }.method-portrait { left: 50%; transform: translateX(-50%); }h3 { left: 20px; width: calc(100% - 40px); font-size: 28px; }.method-card p { left: 25px; width: calc(100% - 50px); font-size: 14px; line-height: 20px; letter-spacing: .5px; } }

:global(html[data-locale-layout='international'] .methods-section h3) { top: 251px; font-family: Georgia, serif; font-size: 24px; line-height: 31px; }
:global(html[data-locale-layout='international'] .methods-section .method-card p) { top: 296px; font-family: Georgia, serif; font-size: 14px; line-height: 18px; letter-spacing: 0; text-align: left; }
</style>
