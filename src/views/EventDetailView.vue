<template>
  <div class="event-detail-page">
    <HomeHeader @select-locale="setLocale" />
    <main class="event-detail" :aria-busy="loading">
      <p v-if="loading" class="visually-hidden">{{ t('events.loading') }}</p>
      <template v-if="loading">
        <div class="detail-skeleton" aria-hidden="true">
          <span class="sk-line sk-crumb" />
          <span class="sk-line sk-eyebrow" />
          <span class="sk-line sk-title" />
          <span class="sk-line sk-sub" />
          <span class="sk-hero" />
          <span class="sk-facts" />
          <span class="sk-panel" />
        </div>
      </template>
      <template v-else-if="activity">
        <nav class="crumb" :aria-label="t('events.hero.title')">
          <RouterLink :to="{ name: 'home' }">{{ t('portal.common.home') }}</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink :to="{ name: 'events' }">{{ t('events.hero.title') }}</RouterLink>
          <span aria-hidden="true">/</span>
          <span>{{ activity.title }}</span>
        </nav>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ activity.title }}</h1>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>

        <div v-if="pictures.length" class="carousel-frame" :tabindex="pictures.length > 1 ? 0 : undefined"
          @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false"
          @keydown.left.prevent="step(-1)" @keydown.right.prevent="step(1)">
          <div class="carousel">
            <div class="track" :style="{ transform: `translateX(-${index * 100}%)` }">
              <img v-for="(url, imageIndex) in pictures" :key="`${url}-${imageIndex}`" :src="url"
                :alt="imageIndex === index ? activity.title : ''" />
            </div>
          </div>
          <template v-if="pictures.length > 1">
            <button class="arrow prev" type="button" :aria-label="t('events.detail.prev')" @click="step(-1)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.5 6.5 9 12l5.5 5.5" />
              </svg>
            </button>
            <button class="arrow next" type="button" :aria-label="t('events.detail.next')" @click="step(1)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.5 6.5 15 12l-5.5 5.5" />
              </svg>
            </button>
          </template>
        </div>

        <dl v-if="facts.length" class="facts">
          <div v-for="fact in facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>

        <div class="detail-body">
          <section v-if="intro.length" class="panel intro">
            <h2>{{ t('events.detail.intro') }}</h2>
            <p v-for="(paragraph, paragraphIndex) in intro" :key="paragraphIndex">{{ paragraph }}</p>
          </section>

          <section v-if="rituals.length" class="panel">
            <h2>{{ t('events.detail.ritual') }}</h2>
            <ol>
              <li v-for="(stepItem, stepIndex) in rituals" :key="`${stepItem.title}-${stepIndex}`">
                <span>{{ String(stepIndex + 1).padStart(2, '0') }}</span>
                <div>
                  <strong v-if="stepItem.title">{{ stepItem.title }}</strong>
                  <p v-if="stepItem.text">{{ stepItem.text }}</p>
                </div>
              </li>
            </ol>
          </section>

          <section v-if="benefits.length" class="panel">
            <h2>{{ t('events.detail.benefit') }}</h2>
            <div class="benefit-grid">
              <article v-for="(item, benefitIndex) in benefits" :key="`${item.title}-${benefitIndex}`">
                <h3 v-if="item.title">{{ item.title }}</h3>
                <p v-if="item.text">{{ item.text }}</p>
              </article>
            </div>
          </section>

          <section v-if="crowd.length" class="panel">
            <h2>{{ t('events.detail.crowd') }}</h2>
            <div class="pills"><span v-for="item in crowd" :key="item">{{ item }}</span></div>
          </section>

          <div class="register">
            <CeremonialButton class="register-button" :label="registerLabel" @click="registerOpen = true" />
            <p v-if="deadlineLine">{{ deadlineLine }}</p>
          </div>
          <EventRegisterDialog v-if="registerOpen && activity.id != null" :activity-id="activity.id" :activity-title="activity.title" @close="registerOpen = false" />
        </div>
      </template>
      <div v-else class="empty">
        <EmptyData :label="t('events.empty')" />
        <RouterLink :to="{ name: 'events' }">{{ t('events.detail.back') }}</RouterLink>
      </div>
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import { getActivityById } from '@/api/activity'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import CeremonialButton from '@/components/common/CeremonialButton.vue'
import EmptyData from '@/components/common/EmptyData.vue'
import EventRegisterDialog from '@/components/events/EventRegisterDialog.vue'
import { formatSchedule, formatStamp, paragraphs, parseBlocks, splitList, text } from '@/utils/activityDisplay'

const route = useRoute()
const { t, locale } = useI18n()
const loading = ref(true)
const registerOpen = ref(false)
const activity = ref(null)
const index = ref(0)
const paused = ref(false)
let timer = 0

const pictures = computed(() => splitList(activity.value?.pictureUrls))
const subtitle = computed(() => text(activity.value?.subTitle))
const intro = computed(() => paragraphs(activity.value?.intro))
const rituals = computed(() => parseBlocks(activity.value?.yigui))
const benefits = computed(() => parseBlocks(activity.value?.benefit))
const crowd = computed(() => splitList(activity.value?.matchCrowd))
const eyebrow = computed(() => {
  const type = Number(activity.value?.activityType)
  if (type === 1) return t('events.detail.collective')
  if (type === 2) return t('events.detail.reserved')
  return ''
})
const facts = computed(() => {
  const item = activity.value
  if (!item) return []
  const schedule = formatSchedule(item, {
    monthly: t('events.detail.monthly', { day: item.day ?? '' }),
    daily: t('events.detail.daily'),
  })
  const tags = splitList(item.tag)
  const join = Number(item.joinType)
  const deadline = formatStamp(item.registerEndTime, locale.value) || (item.aheadDays ? t('events.detail.ahead', { days: item.aheadDays }) : '')
  const people = splitList(item.matchCrowd)
  const limit = item.limitUser == null || item.limitUser === ''
    ? ''
    : t('events.detail.limitPeople', { count: item.limitUser })
  return [
    schedule ? { label: t('events.detail.time'), value: schedule } : null,
    text(item.location) ? { label: t('events.detail.location'), value: text(item.location) } : null,
    tags.length ? { label: t('events.detail.tags'), value: tags.join(' · ') } : null,
    join === 1 || join === 2 ? { label: t('events.detail.join'), value: t(join === 1 ? 'events.detail.joinOnline' : 'events.detail.joinOffline') } : null,
    limit ? { label: t('events.detail.limit'), value: limit } : null,
    deadline ? { label: t('events.detail.deadline'), value: deadline } : null,
    people.length ? { label: t('events.detail.audience'), value: people.join(' · ') } : null,
  ].filter(Boolean)
})
const registerLabel = computed(() => Number(activity.value?.joinType) === 2 ? t('events.detail.registerOffline') : t('events.detail.registerOnline'))
const deadlineLine = computed(() => {
  const time = formatStamp(activity.value?.registerEndTime, locale.value)
  return time ? t('events.detail.deadlineLine', { time }) : ''
})

function stopAutoplay() {
  window.clearInterval(timer)
  timer = 0
}

function startAutoplay() {
  stopAutoplay()
  if (pictures.value.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = window.setInterval(() => {
    if (!paused.value && !document.hidden) advance(1)
  }, 7000)
}

let slideLock = false

function advance(delta) {
  const total = pictures.value.length
  if (total < 2 || slideLock) return
  slideLock = true
  index.value = (index.value + delta + total) % total
  window.setTimeout(() => { slideLock = false }, 900)
}

function step(delta) {
  advance(delta)
  startAutoplay()
}

async function load(id) {
  stopAutoplay()
  loading.value = true
  activity.value = null
  index.value = 0
  if (id == null || id === '') {
    loading.value = false
    return
  }
  try {
    const data = await getActivityById(id, { silent: true })
    activity.value = data && (data.id != null || data.title) ? data : null
  } catch {
    activity.value = null
  } finally {
    loading.value = false
    startAutoplay()
  }
}

watch(() => route.params.id, load, { immediate: true })
watch(pictures, () => {
  index.value = 0
  if (!loading.value) startAutoplay()
})

onBeforeUnmount(stopAutoplay)
const setLocale = (next) => setAppLocale(next)
</script>

<style scoped>
.event-detail-page {
  min-width: 320px;
  overflow-x: clip;
  color: #333;
  background: #f3f0e9;
}

.event-detail-page :deep(.site-header) {
  background-image: linear-gradient(rgba(29, 78, 110, .9), rgba(29, 78, 110, .9)), url('@/assets/blessings/header-texture.webp');
  background-position: center;
  background-size: cover;
}

.event-detail {
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
  padding: 36px 0 88px;
}

.crumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 28px;
  color: #9d7a55;
  font-size: 14px;
}

.crumb a {
  color: inherit;
  text-decoration: none;
}

.crumb a:hover {
  color: #6d4e32;
}

.crumb span:last-child {
  color: #5c5146;
}

.eyebrow {
  margin: 0;
  color: #b08968;
  font: 13px/1.4 var(--font-serif, 'Songti SC', serif);
  letter-spacing: 2px;
  text-align: center;
  text-transform: uppercase;
}

h1 {
  margin: 10px 0 0;
  color: #38627d;
  font: 40px/1.25 var(--font-calligraphy);
  text-align: center;
}

.subtitle {
  max-width: 720px;
  margin: 12px auto 0;
  color: #7a7168;
  font-size: 16px;
  line-height: 1.7;
  text-align: center;
}

.carousel-frame {
  position: relative;
  margin-top: 28px;
}

.carousel-frame:focus-visible {
  outline: 2px solid #1d4e6e;
  outline-offset: 6px;
  border-radius: 18px;
}

.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: #e7e1d6;
  aspect-ratio: 16 / 7;
}

.track {
  position: absolute;
  inset: 0;
  display: flex;
  transition: transform .9s cubic-bezier(.22, .61, .36, 1);
  transition-duration: .9s !important;
}

.track img {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.arrow {
  position: absolute;
  top: 50%;
  z-index: 1;
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  color: #4a4a4a;
  background: rgba(255, 255, 255, .6);
  border: 0;
  border-radius: 50%;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .12);
  transform: translateY(-50%);
  cursor: pointer;
  fill: rgba(255, 255, 255, .6);
}

.arrow.prev {
  left: 18px;
}

.arrow.next {
  right: 18px;
}

.arrow svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.arrow:hover {
  color: #cc3513;
}

.arrow:focus-visible {
  outline: 2px solid #1d4e6e;
  outline-offset: 3px;
}

.facts {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin: 22px 0 0;
}

.facts div {
  min-width: 0;
  padding: 18px 14px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(90, 60, 30, .06);
}

.facts dt {
  color: #c4a574;
  font-size: 14px;
}

.facts dd {
  margin: 10px 0 0;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.detail-body {
  width: 100%;
  margin-top: 28px;
  padding: 32px 36px 36px;
  border-radius: 12px;
  background: linear-gradient(309deg, #f3eae0 6.54%, #fff 35.17%);
}

.panel {
  margin-top: 28px;
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}

.detail-body .panel:first-child {
  margin-top: 0;
}

.panel h2 {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 177.647px;
  height: 30px;
  margin: 0 0 16px;
  padding: 0 8px;
  color: #333;
  text-align: justify;
  text-wrap: pretty;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 1.6px;
  white-space: nowrap;
  background: linear-gradient(270deg, #fff 0%, #caab89 100%);
  border-radius: 20px 0 0 20px;
}

.panel.intro p {
  color: #333;
  text-align: justify;
  text-wrap: pretty;
  font-family: var(--font-calligraphy);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 1.6px;
}

.panel p {
  margin: 0 0 12px;
  color: #5c564e;
  font-size: 15px;
  line-height: 1.85;
}

.panel p:last-child {
  margin-bottom: 0;
}

.panel ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

.panel li {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 8px 12px;
  padding: 14px 0;
  border-top: 1px solid #efe8dc;
}

.panel li span {
  color: #c45a2a;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.panel li strong {
  display: block;
  color: #3a342c;
  font-size: 16px;
}

.panel li p {
  margin-top: 4px;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.benefit-grid article {
  padding: 18px;
  background: #fbf8f3;
  border: 1px solid #efe4d4;
  border-radius: 12px;
}

.benefit-grid h3 {
  margin: 0 0 8px;
  font: 18px/1.4 var(--font-calligraphy);
  color: #C7955F;
  text-align: justify;
  font-family: Huiwen-mincho;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  /* 111.111% */
  letter-spacing: 1.8px;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pills span {
  padding: 6px 14px;
  background: #f6efe4;
  border-radius: 999px;
  color: #333;
  font-family: Huiwen-mincho;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  /* 125% */
  letter-spacing: 1.6px;
}

.register {
  display: grid;
  justify-items: center;
  gap: 12px;
  margin-top: 36px;
}

.register :deep(.ceremonial-button) {
  min-width: 196px;
  height: 44px;
  font-size: 18px;
}

.register p {
  margin: 0;
  color: #8a8178;
  font-size: 14px;
}

.empty {
  display: grid;
  justify-items: center;
  gap: 16px;
  padding: 80px 0;
  color: #7a7168;
}

.empty a {
  color: #8a6234;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.detail-skeleton {
  display: grid;
  justify-items: center;
  gap: 14px;
}

.detail-skeleton span {
  position: relative;
  display: block;
  overflow: hidden;
  background: #e7e1d6;
  border-radius: 8px;
}

.detail-skeleton span::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .55), transparent);
  transform: translateX(-100%);
  animation: detail-shimmer 1.3s ease-in-out infinite;
}

.sk-crumb {
  justify-self: start;
  width: 220px;
  height: 14px;
}

.sk-eyebrow {
  width: 120px;
  height: 12px;
}

.sk-title {
  width: min(420px, 80%);
  height: 32px;
}

.sk-sub {
  width: min(280px, 60%);
  height: 14px;
}

.sk-hero,
.sk-facts,
.sk-panel {
  width: 100%;
}

.sk-hero {
  height: 360px;
  border-radius: 18px;
}

.sk-facts {
  height: 86px;
  border-radius: 16px;
}

.sk-panel {
  height: 180px;
  border-radius: 16px;
}

@keyframes detail-shimmer {
  to {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .detail-skeleton span::after {
    animation: none;
  }
}

@media (max-width: 1180px) {
  .facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .benefit-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 32px;
  }
}

@media (max-width: 640px) {
  .event-detail {
    width: calc(100% - 32px);
  }

  .arrow.prev {
    left: 8px;
  }

  .arrow.next {
    right: 8px;
  }

  .facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .detail-body {
    padding: 24px 18px 28px;
  }

  .sk-hero {
    height: 210px;
  }
}
</style>
