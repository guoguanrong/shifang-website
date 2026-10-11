<template>
  <section class="rhythm-section">
    <header class="rhythm-heading">
      <img :src="rhythmBadge" alt="" />
      <h2>{{ t('wellness.rhythm.title') }}</h2>
    </header>

    <div class="rhythm-timeline">
      <!-- 桌面端以水平时辰轴呈现，移动端改为纵向阅读，避免内容压缩。 -->
      <img class="timeline-line" :src="rhythmLine" alt="" />
      <article v-for="(item, index) in items" :key="item.time">
        <img class="time-icon" :src="timeIcons[index]" alt="" aria-hidden="true" />
        <h3>{{ item.time }}</h3>
        <img class="time-node" :src="rhythmNode" alt="" aria-hidden="true" />
        <p>{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import rhythmBadge from '@/assets/wellness/rhythm-badge.svg'
import rhythmLine from '@/assets/wellness/rhythm-line.svg'
import rhythmNode from '@/assets/wellness/rhythm-node.svg'

import morning from '@/assets/wellness/design/morning.svg'
import noon from '@/assets/wellness/design/noon.svg'
import sunset from '@/assets/wellness/design/sunset.svg'
import night from '@/assets/wellness/design/night.svg'

const timeIcons = [morning, noon, sunset, night]
const { t, tm } = useI18n()
const items = computed(() => tm('wellness.rhythm.items'))
</script>

<style scoped>
.rhythm-section { position: relative; min-height: 402px; padding: 0 24px 80px; font-family: var(--font-calligraphy); background: #f3f0e9; }
.rhythm-heading { position: relative; min-height: 122px; padding-top: 43px; text-align: center; }
.rhythm-heading img { position: absolute; top: 0; left: 50%; width: 138px; height: 138px; transform: translateX(-50%); pointer-events: none; }
.rhythm-heading h2 { position: relative; margin: 0; color: #333; font-family: var(--font-calligraphy); font-size: 32px; font-weight: 400; line-height: 42px; }
.rhythm-timeline { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); width: min(1240px, 100%); min-height: 200px; padding-inline: 13px; margin: 0 auto; }
.rhythm-timeline::before { position: absolute; top: 72px; left: 0; width: 100%; height: 24px; content: ''; background: linear-gradient(90deg, transparent, rgb(242 210 175 / 30%) 23.5%, rgb(242 210 175 / 30%) 77.4%, transparent); }
.timeline-line { position: absolute; top: 83px; left: 0; width: 100%; height: 3px; }
.rhythm-timeline article { position: relative; isolation: isolate; min-width: 0; padding-top: 11px; text-align: center; }
.rhythm-timeline article:nth-of-type(odd)::before { content: ''; position: absolute; z-index: -1; inset: 0; width: 80%; margin-inline: auto; background: linear-gradient(90deg, transparent, rgb(255 255 255 / 70%), transparent); }
.time-icon { display: block; width: 24px; height: 24px; margin: 0 auto; }
.rhythm-timeline h3 { margin: 9px 0 0; color: #000; font-family: var(--font-calligraphy); font-size: 16px; font-weight: 400; line-height: 20px; }
.time-node { position: absolute; top: 74px; left: 50%; width: 21px; height: 21px; transform: translateX(-50%); }
.rhythm-timeline p { width: min(200px, calc(100% - 24px)); min-height: 50px; padding: 1px 0; margin: 48px auto 0; color: #333; font-size: 14px; line-height: 24px; background: linear-gradient(90deg, transparent, rgb(242 210 175 / 30%) 24%, rgb(242 210 175 / 30%) 77%, transparent); }
@media (max-width: 760px) {
  .rhythm-section { padding: 0 20px 64px; }
  .rhythm-heading { min-height: 128px; padding-top: 40px; }
  .rhythm-heading h2 { font-size: 26px; line-height: 34px; }
  .rhythm-timeline { grid-template-columns: minmax(0, 1fr); max-width: 480px; padding: 0; gap: 24px; }
  .timeline-line { display: none; }
  .rhythm-timeline::before { top: 18px; bottom: 18px; left: 10px; width: 3px; height: auto; background: linear-gradient(transparent, #cc3513 8%, #cc3513 92%, transparent); }
  .rhythm-timeline article { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 8px 12px; padding: 16px 12px 16px 38px; text-align: left; }
  .rhythm-timeline article:nth-of-type(odd)::before { width: 100%; }
  .time-icon { margin: 0; }
  .rhythm-timeline h3 { align-self: center; margin: 0; line-height: 24px; }
  .time-node { top: 18px; left: 0; transform: none; }
  .rhythm-timeline p { grid-column: 1 / -1; width: 100%; min-height: 0; margin: 0; font-size: 14px; line-height: 24px; }
}
:global(html[data-locale-layout='international'] .rhythm-section .rhythm-heading h2),
:global(html[data-locale-layout='international'] .rhythm-section h3),
:global(html[data-locale-layout='international'] .rhythm-section p) { font-family: Georgia, serif; }
:global(html[data-locale-layout='international'] .rhythm-section .rhythm-heading h2) { font-size: 27px; }
:global(html[data-locale-layout='international'] .rhythm-section h3) { font-size: 14px; }
:global(html[data-locale-layout='international'] .rhythm-section p) { font-size: 13px; line-height: 22px; }
</style>
