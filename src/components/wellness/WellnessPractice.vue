<template>
  <!-- 养生功法：六张卡片，含封面播放按钮、标签与「开始练习」。 -->
  <section class="practice-section">
    <WellnessSectionHeading
      :eyebrow="t('wellness.practice.eyebrow')"
      :title="t('wellness.practice.title')"
      :subtitle="t('wellness.practice.subtitle')"
    />

    <div class="practice-grid">
      <article v-for="(item, index) in items" :key="item.title" class="practice-card">
        <div class="practice-cover">
          <img :src="practiceImages[index]" alt="" />
          <!-- 播放按钮目前只做展示，尚未绑定播放行为。 -->
          <button class="play-button" type="button" :aria-label="`${t('wellness.practice.action')}：${item.title}`">
            <img :src="playCircle" alt="" /><img :src="playIcon" alt="" />
          </button>
        </div>
        <div class="practice-body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <div class="practice-tags"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
          <button class="practice-action" type="button">{{ t('wellness.practice.action') }}</button>
        </div>
      </article>
    </div>
    <button class="more-button" type="button">{{ t('wellness.practice.more') }}<span aria-hidden="true">›</span></button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import playCircle from '@/assets/wellness/play-circle.svg'
import playIcon from '@/assets/wellness/play-icon.svg'
import baduanjin from '@/assets/wellness/practice-baduanjin.webp'
import changshou from '@/assets/wellness/practice-changshou.webp'
import jingang from '@/assets/wellness/practice-jingang.webp'
import liuzijue from '@/assets/wellness/practice-liuzijue.webp'
import taiji from '@/assets/wellness/practice-taiji.webp'
import wuqinxi from '@/assets/wellness/practice-wuqinxi.webp'
import WellnessSectionHeading from './WellnessSectionHeading.vue'

const { t, tm } = useI18n()
const items = computed(() => tm('wellness.practice.items'))
// 功法条目与六张封面图按顺序对应。
const practiceImages = [baduanjin, jingang, wuqinxi, changshou, liuzijue, taiji]
</script>

<style scoped>
.practice-section { height: 1057px; background: #f3f0e9; }
/* 三列卡片，窄屏依次降为两列、一列。 */
.practice-grid { display: grid; grid-template-columns: repeat(3, 446.67px); gap: 30px 50px; width: 1440px; margin: 39px auto 0; }
.practice-card { height: 368px; overflow: hidden; background: linear-gradient(130deg, #fff 35%, #f3eae0 100%); border-radius: 12px; transition: box-shadow .25s ease, transform .25s ease; }
.practice-cover { position: relative; width: 100%; height: 180px; overflow: hidden; border-radius: 12px 12px 0 0; }
.practice-cover > img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.practice-card:nth-child(2) .practice-cover > img { object-position: center 39%; }.practice-card:nth-child(3) .practice-cover > img { object-position: center 43%; }
.play-button { position: absolute; top: 75px; left: 50%; width: 43px; height: 40px; padding: 0; background: none; border: 0; cursor: pointer; transform: translateX(-50%); transition: transform .2s ease, filter .2s ease; }
.play-button img { position: absolute; inset: 0; width: 100%; height: 100%; }.play-button img:last-child { top: 2px; left: 0; }
.practice-body { position: relative; height: 188px; padding: 20px; }
.practice-body h3 { width: 100%; margin: 0 0 5px; color: #000; font-family: var(--font-calligraphy); font-size: 18px; font-weight: 400; line-height: 20px; letter-spacing: 1.8px; }
.practice-body p { height: 40px; margin: 0; color: #000; font-size: 12px; line-height: 20px; letter-spacing: 1.2px; }
.practice-tags { display: flex; gap: 12px; margin-top: 5px; }
.practice-tags span { display: inline-flex; align-items: center; justify-content: center; min-width: 48px; height: 18px; padding: 0 8px; color: #000; font-size: 12px; line-height: 18px; background: #ffe9d2; border-radius: 100px; }
.practice-action { min-width: 137px; height: 36px; padding: 0 22px; margin-top: 14px; color: #fff; font-family: var(--font-calligraphy); font-size: 14px; letter-spacing: 1.4px; background: #cc3513; border: 1px solid #c29f79; border-radius: 100px; box-shadow: inset 0 0 0 2px #cc3513, inset 0 0 0 2.5px #c29f79; cursor: pointer; transition: filter .2s ease, transform .2s ease; }
.more-button { display: flex; align-items: center; justify-content: center; gap: 3px; min-width: 140px; height: 36px; padding: 0 12px 0 23px; margin: 30px auto 0; color: #fff; font-family: var(--font-calligraphy); font-size: 16px; letter-spacing: 1.6px; background: #cc3513; border: 0; border-radius: 100px; box-shadow: inset 0 0 0 2px #cc3513, inset 0 0 0 2.5px #f2d2af; cursor: pointer; transition: filter .2s ease, transform .2s ease; }
.more-button span { font-family: Arial, sans-serif; font-size: 27px; line-height: 1; }
@media (hover: hover) and (pointer: fine) { .practice-card:hover { box-shadow: 0 16px 35px rgba(35,57,70,.15); transform: translateY(-6px); }.practice-card:hover .practice-cover > img { transform: scale(1.045); }.play-button:hover { filter: brightness(1.12); transform: translateX(-50%) scale(1.1); }.practice-action:hover,.more-button:hover { filter: brightness(1.08); transform: translateY(-2px); } }

@media (max-width: 1439px) { .practice-section { height: auto; padding-bottom: 84px; }.practice-grid { grid-template-columns: repeat(2, minmax(0, 380px)); justify-content: center; width: calc(100% - 40px); } }
@media (max-width: 820px) { .practice-grid { grid-template-columns: minmax(0, 380px); margin-top: 38px; } }
@media (max-width: 430px) { .practice-grid { width: calc(100% - 28px); grid-template-columns: 1fr; }.practice-card { height: 382px; }.practice-body { padding-inline: 17px; }.practice-body p { height: 54px; font-size: 12px; line-height: 18px; }.practice-action { margin-top: 12px; } }

:global(html[data-locale-layout='international'] .practice-section h3),
:global(html[data-locale-layout='international'] .practice-section p),
:global(html[data-locale-layout='international'] .practice-section button) { font-family: Georgia, serif; letter-spacing: 0; }
:global(html[data-locale-layout='international'] .practice-section .practice-body h3) { font-size: 18px; }
:global(html[data-locale-layout='international'] .practice-section .practice-body p) { font-size: 12.5px; line-height: 17px; }
:global(html[data-locale-layout='international'] .practice-section .practice-tags) { gap: 7px; }
:global(html[data-locale-layout='international'] .practice-section .practice-tags span) { font-size: 10px; }
</style>
