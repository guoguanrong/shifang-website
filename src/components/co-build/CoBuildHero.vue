<template>
  <section class="co-build-hero" :style="{ '--hero-height': `${heroHeight}px` }">
    <!-- 全站内页统一顶部背景，募捐卡片的独立切图不变。 -->
    <PageHeroBackground />

    <header class="hero-heading">
      <p>{{ t('coBuild.hero.eyebrow') }}</p>
      <h1>{{ t('coBuild.hero.title') }}</h1>
      <span>{{ t('coBuild.hero.subtitle') }}</span>
    </header>

    <div class="hero-quote">
      <img class="hero-quote-frame hero-quote-frame-outer" :src="quoteFrameOuter" alt="" aria-hidden="true" />
      <div class="hero-quote-landscape" aria-hidden="true">
        <img :src="quoteLandscape" alt="" />
      </div>
      <img class="hero-quote-frame hero-quote-frame-inner" :src="quoteFrameInner" alt="" aria-hidden="true" />
      <div class="hero-quote-copy">
        <p v-for="paragraph in tm('coBuild.hero.introduction')" :key="paragraph">{{ paragraph }}</p>
      </div>
    </div>

    <CoBuildSectionHeading class="fundraising-heading" :title="t('coBuild.project.heading')"
      :subtitle="t('coBuild.project.eyebrow')" />

    <div v-if="goals.length" class="project-list">
      <article v-for="(goal, index) in goals" :id="index === 0 ? 'donation-project' : undefined"
        :key="goal.id" class="project-card">
        <img class="project-frame project-frame-outer" :src="projectFrameOuter" alt="" aria-hidden="true" />
        <img class="project-frame project-frame-inner" :src="projectFrameInner" alt="" aria-hidden="true" />
        <div class="project-card-inner">
          <figure class="project-photo">
            <img class="project-photo-frame" :src="projectImageFrame" alt="" aria-hidden="true" />
            <img v-if="goal.picture" class="project-photo-image" :src="goal.picture" :alt="goal.title || ''" />
            <span v-else class="project-photo-empty" />
          </figure>

          <div class="project-copy">
            <h2>{{ goal.title }}</h2>
            <strong class="project-total">{{ formatMoney(goal.targetAmount) }}</strong>
            <p v-if="goal.subTitle" class="project-description">{{ goal.subTitle }}</p>

            <div class="progress-track" role="progressbar" :aria-label="t('coBuild.project.progressLabel')"
              aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(progressValue(goal))">
              <span :style="{ width: `${progressWidth(goal)}%` }" />
            </div>
            <div class="progress-copy">
              <span>{{ t('coBuild.project.raisedLabel') }} <b>{{ formatMoney(goal.completedAmount) }}</b></span>
              <span>{{ progressLabel(goal) }}%</span>
            </div>

            <dl class="project-stats">
              <div v-for="stat in projectStats(goal)" :key="stat.label">
                <dt>{{ stat.label }}</dt>
                <dd>{{ stat.value }}</dd>
              </div>
            </dl>

            <button class="ornate-button" type="button" @click="goToDonation(goal)">
              <span>{{ t(`donation.types.${goalType(goal)}.title`) }}</span>
            </button>
          </div>
        </div>
      </article>
    </div>
    <p v-else-if="!loading" class="project-empty">{{ t('coBuild.project.empty') }}</p>

    
  </section>
</template>

<script setup>
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CoBuildSectionHeading from './CoBuildSectionHeading.vue'
import { getDonateTargetList } from '@/api/donateTarget'
import quoteLandscape from '@/assets/co-build/hero-quote-v2/hero-quote-landscape.png'
import quoteFrameOuter from '@/assets/co-build/hero-quote-v2/hero-quote-outer.svg'
import quoteFrameInner from '@/assets/co-build/hero-quote-v2/hero-quote-inner.svg'
import projectFrameOuter from '@/assets/co-build/project-frame-outer.svg'
import projectFrameInner from '@/assets/co-build/project-frame-inner.svg'
import projectImageFrame from '@/assets/co-build/project-image-frame.svg'
import assuranceFrame1 from '@/assets/co-build/assurance-frame-1.svg'
import assuranceFrame2 from '@/assets/co-build/assurance-frame-2.svg'
import assuranceFrame3 from '@/assets/co-build/assurance-frame-3.svg'
import assuranceIcon1 from '@/assets/co-build/assurance-icon-1.svg'
import assuranceIcon2 from '@/assets/co-build/assurance-icon-2.svg'
import assuranceIcon3 from '@/assets/co-build/assurance-icon-3.svg'

const { t, tm, locale } = useI18n()
const router = useRouter()
const assurances = computed(() => tm('coBuild.assurances'))
const goals = ref([])
const loading = ref(true)
const heroHeight = computed(() => Math.max(1240, 689 + Math.max(goals.value.length, 1) * 434
  + Math.max(0, goals.value.length - 1) * 16 + 22 + 174 + 6))
const assuranceTop = computed(() => 689 + Math.max(goals.value.length, 1) * 434
  + Math.max(0, goals.value.length - 1) * 16 + 22)
const assuranceFrames = [assuranceFrame1, assuranceFrame2, assuranceFrame3]
const assuranceIcons = [assuranceIcon1, assuranceIcon2, assuranceIcon3]

function goalType(goal) {
  return Number(goal?.type) === 2 ? 'goods' : 'money'
}

function progressValue(goal) {
  const target = Number(goal?.targetAmount || 0)
  const completed = Number(goal?.completedAmount || 0)
  if (!target || completed <= 0) return 0
  return Math.min(100, completed / target * 100)
}

function progressLabel(goal) {
  const value = progressValue(goal)
  if (value > 0 && value < 1) return value.toFixed(1)
  return String(Math.round(value))
}

function progressWidth(goal) {
  const value = progressValue(goal)
  if (value <= 0) return 0
  return Math.max(value, 1)
}

// 统计条：已收善款 / 目标金额 / 善捐人次（接口未公布捐赠人数时按 0 展示）。
function projectStats(goal) {
  return [
    { label: t('coBuild.project.statRaised'), value: formatMoney(goal.completedAmount) },
    { label: t('coBuild.project.statTarget'), value: formatMoney(goal.targetAmount) },
    { label: t('coBuild.project.statDonors'), value: formatCount(goal.donateUserCount) },
  ]
}

function formatCount(value) {
  const count = Number(value || 0)
  return Number.isFinite(count) && count > 0 ? count.toLocaleString('en-US') : '0'
}

function formatMoney(value) {
  return `$${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(Number(value || 0))}`
}

async function loadGoals() {
  loading.value = true
  try {
    const payload = await getDonateTargetList({ status: 1, page: 1, pageSize: 100 }, { silent: true })
    const result = payload?.data ?? payload
    const list = Array.isArray(result) ? result : result?.list || result?.records || []
    goals.value = list.filter(item => item.status === undefined || Number(item.status) === 1)
  } catch {
    goals.value = []
  } finally {
    loading.value = false
  }
}

function goToDonation(goal) {
  router.push({
    name: 'donation',
    query: {
      type: goalType(goal) === 'goods' ? '2' : '1',
      ...(goal?.id ? { targetId: String(goal.id) } : {}),
    },
  })
}

onMounted(loadGoals)

</script>

<style scoped>
.co-build-hero {
  isolation: isolate;
  position: relative;
  height: max(1240px, var(--hero-height, 1240px));
  overflow: hidden;
  background: #f8f5ed;
}

.hero-heading {
  position: absolute;
  z-index: 1;
  top: 115px;
  left: 50%;
  width: min(680px, calc(100% - 40px));
  text-align: center;
  transform: translateX(-50%);
}

.hero-heading p {
  margin: 0;
  color: #d0a06d;
  font-family: var(--font-dyming-a);
  font-size: 24px;
  line-height: 28px;
}

.hero-heading h1 {
  margin: 6px 0 0;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: 42px;
  font-weight: 400;
  line-height: 48px;
  letter-spacing: 2px;
}

:global(html[lang='en'] .co-build-hero .hero-heading h1) {
  font-size: clamp(12px, 3.9vw, 28px);
  white-space: nowrap;
}

.hero-heading span {
  display: block;
  margin-top: 7px;
  color: #333;
  font-size: 16px;
  line-height: 20px;
}

.hero-quote {
  position: absolute;
  z-index: 1;
  top: 243px;
  left: 50%;
  width: min(1240px, calc(100vw - 48px));
  aspect-ratio: 1240 / 247;
  margin: 0;
  color: #171717;
  transform: translateX(-50%);
}

.hero-quote-frame {
  position: absolute;
  z-index: 0;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero-quote-frame-outer {
  top: .162%;
  bottom: auto;
  height: 99.595%;
}

.hero-quote-frame-inner {
  z-index: 2;
  inset: 4.21% .806% 4.29%;
  width: auto;
  height: auto;
}

.hero-quote-landscape {
  position: absolute;
  z-index: 1;
  top: 4.29%;
  right: .806%;
  width: 58.871%;
  height: 95.547%;
  overflow: hidden;
  -webkit-mask-image: url('@/assets/co-build/hero-quote-v2/hero-quote-mask.svg');
  mask-image: url('@/assets/co-build/hero-quote-v2/hero-quote-mask.svg');
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: 100% 2%;
  mask-position: 100% 2%;
  -webkit-mask-size: 167.123% 95.763%;
  mask-size: 167.123% 95.763%;
}

.hero-quote-landscape img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-quote-copy {
  position: absolute;
  z-index: 3;
  top: 20.08%;
  left: 4.03%;
  width: 76.61%;
  font-family: var(--font-calligraphy);
}

.hero-quote-copy p {
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
  letter-spacing: 0;
}

.hero-quote-copy p + p {
  margin-top: 8px;
}

.fundraising-heading {
  position: absolute;
  z-index: 1;
  top: 550px;
  left: 50%;
  transform: translateX(-50%);
}

.fundraising-heading :deep(h2) {
  letter-spacing: 19px;
}

.fundraising-heading :deep(.subtitle) {
  margin-top: 0;
  color: #cc3513;
  font-size: 14px;
  letter-spacing: 0;
}

.project-list,
.project-empty {
  position: absolute;
  z-index: 1;
  top: 689px;
  left: 0;
  width: 100%;
}

.project-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.project-empty {
  margin: 0;
  color: #6b5a48;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}

.project-card {
  position: relative;
  flex: 0 0 auto;
  width: 1440px;
  height: 520px;
}

.project-frame {
  position: absolute;
  pointer-events: none;
}

.project-frame-outer {
  inset: 0;
  width: 1440px;
  height: 520px;
}

.project-frame-inner {
  top: 10px;
  left: 10px;
  width: 1420px;
  height: 500px;
}

.project-card-inner {
  position: absolute;
  top: 40px;
  left: 40px;
  display: grid;
  grid-template-columns: 704px 617px;
  gap: 39px;
}

.project-photo {
  position: relative;
  width: 704px;
  height: 440px;
  margin: 0;
  overflow: hidden;
}

.project-photo-frame {
  position: absolute;
  z-index: 2;
  inset: 0;
  width: 704px;
  height: 440px;
  pointer-events: none;
}

.project-photo-image,
.project-photo-empty {
  position: absolute;
  z-index: 1;
  top: 6px;
  left: 6px;
  width: 692px;
  height: 429px;
  border: 1px solid #f2d2af;
}

.project-photo-image {
  object-fit: cover;
  object-position: center;
  transition: transform .45s ease;
}

.project-photo-empty {
  background: #f6f1e8;
}

.project-card:hover .project-photo-image {
  transform: scale(1.02);
}

.project-copy {
  padding-top: 0;
  color: #333;
}

.project-copy h2 {
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 39px;
}

.project-total {
  display: block;
  margin: 5px 0 0;
  color: #cc3513;
  font-family: Arial, sans-serif;
  font-size: 48px;
  line-height: 58px;
}

.project-description {
  margin: 12px 0 0;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

.progress-track {
  height: 14px;
  margin-top: 35px;
  overflow: hidden;
  background: #ffe9d2;
  border-radius: 100px;
}

.progress-track span {
  display: block;
  width: 68%;
  height: 100%;
  background: #cc3513;
  border-radius: inherit;
}

.progress-copy {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 16px;
  line-height: 20px;
}

.progress-copy b {
  font-family: Arial, sans-serif;
  font-weight: 500;
}

.project-stats {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100px;
  margin: 32px 0 0;
  padding: 20px 6px 10px;
  background: url('@/assets/co-build/project-stats-panel.svg') center / 100% 100% no-repeat;
}

.project-stats div {
  min-width: 0;
  text-align: center;
}

.project-stats div+div {
  border-left: 1px solid #f0e6dc;
}

.project-stats dt {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 1.4px;
}

.project-stats dd {
  margin: 10px 0 0;
  color: #cc3513;
  font-family: Arial, sans-serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
}

.ornate-button {
  position: relative;
  display: grid;
  width: 100%;
  height: 56px;
  margin-top: 32px;
  place-items: center;
  overflow: hidden;
  color: #fff;
  font-family: var(--font-calligraphy);
  font-size: 24px;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #cc3513, #981c04);
  border: 2px solid #c29f79;
  border-radius: 100px;
  box-shadow: inset 0 0 0 3px #cc3513, inset 0 0 0 4px #c29f79;
  cursor: pointer;
  transition: filter .2s ease, transform .2s ease;
}

.ornate-button::before {
  position: absolute;
  inset: 4px;
  content: '';
  background: url('@/assets/co-build/button-texture.png') center / cover;
  border-radius: inherit;
  mix-blend-mode: luminosity;
  opacity: .3;
}

.ornate-button span {
  position: relative;
  z-index: 1;
}

.ornate-button:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}

.assurance-grid {
  position: absolute;
  z-index: 1;
  top: var(--assurance-top, 1164px);
  left: 50%;
  display: grid;
  grid-template-columns: repeat(3, 466.67px);
  gap: 20px;
  width: 1440px;
  transform: translateX(-50%);
}

.assurance-card {
  position: relative;
  height: 210px;
  padding-top: 114px;
  color: #333;
  text-align: center;
}

.assurance-frame {
  position: absolute;
  inset: 0;
  width: 466.67px;
  height: 210px;
  pointer-events: none;
}

.assurance-icon {
  position: absolute;
  top: 27px;
  left: 50%;
  width: 78px;
  height: 78px;
  object-fit: contain;
  transform: translateX(-50%);
  transition: transform .25s ease;
}

.assurance-card:nth-child(2) .assurance-icon,
.assurance-card:nth-child(3) .assurance-icon {
  top: 36px;
  width: 59px;
  height: 59px;
}

.assurance-card:hover .assurance-icon {
  transform: translateX(-50%) translateY(-4px);
}

.assurance-card h3 {
  position: relative;
  margin: 0;
  font-family: var(--font-calligraphy);
  font-size: 32px;
  font-weight: 400;
  line-height: 39px;
}

.assurance-card p {
  position: relative;
  margin: 7px 20px 0;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1.6px;
}

:global(html[data-locale-layout='international'] .co-build-hero .hero-heading h1),
:global(html[data-locale-layout='international'] .co-build-hero .project-copy h2),
:global(html[data-locale-layout='international'] .co-build-hero .assurance-card h3),
:global(html[data-locale-layout='international'] .co-build-hero .ornate-button) {
  font-family: Georgia, serif;
  letter-spacing: 0;
}

:global(html[data-locale-layout='international'] .fundraising-heading h2) {
  letter-spacing: 1px;
}

:global(html[data-locale-layout='international'] .co-build-hero .hero-quote p) {
  font-family: Georgia, serif;
  font-size: 14px;
  line-height: 1.4;
}

:global(html[data-locale-layout='international'] .co-build-hero .assurance-card h3) {
  font-size: 26px;
}

:global(html[data-locale-layout='international'] .co-build-hero .assurance-card p) {
  font-size: 14px;
  letter-spacing: 0;
}

@media (max-width: 1439px) {
  .co-build-hero {
    display: flex;
    height: auto;
    min-height: 0;
    flex-direction: column;
    align-items: center;
    padding: 78px 24px 68px;
  }

  .hero-heading,
  .hero-quote,
  .fundraising-heading,
  .project-list,
  .project-empty,
  .project-card,
  .assurance-grid {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
  }

  .hero-quote {
    margin-top: 22px;
  }

  .fundraising-heading {
    margin-top: 56px;
  }

  .project-list {
    gap: 24px;
    margin-top: 2px;
  }

  .project-card {
    width: min(100%, 1000px);
    height: auto;
    min-height: 490px;
    margin-top: 0;
    padding: 34px;
    background: #fff;
    border: 1px solid #f2d2af;
    border-radius: 22px;
    box-shadow: 0 4px 0 #d7b591;
  }

  .project-frame {
    display: none;
  }

  .project-card-inner {
    position: relative;
    top: auto;
    left: auto;
    grid-template-columns: minmax(0, 1.1fr) minmax(390px, .9fr);
    gap: 30px;
  }

  .project-photo {
    width: 100%;
    height: 420px;
  }

  .project-photo-frame {
    width: 100%;
    height: 100%;
  }

  .project-photo-image,
  .project-photo-empty {
    width: calc(100% - 12px);
    height: calc(100% - 12px);
  }

  .project-copy {
    padding-top: 2px;
  }

  .project-copy h2 {
    font-size: 29px;
  }

  .project-total {
    font-size: 42px;
  }

  .ornate-button {
    margin-top: 22px;
  }

  .assurance-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: min(100%, 1000px);
    margin-top: 40px;
  }

  .assurance-card {
    height: 190px;
    padding-top: 104px;
    background: #fff;
    border: 1px solid #f2d2af;
    border-radius: 18px;
  }

  .assurance-frame {
    display: none;
  }

  .assurance-card h3 {
    font-size: 27px;
  }
}

@media (max-width: 1080px) {
  .hero-quote {
    height: auto;
    aspect-ratio: auto;
    padding: 30px clamp(24px, 4vw, 50px);
  }

  .hero-quote-copy {
    position: relative;
    top: auto;
    left: auto;
    width: min(100%, 950px);
    margin: 0 auto;
  }
}

@media (max-width: 900px) {
  .project-card {
    width: min(100%, 680px);
  }

  .project-card-inner {
    grid-template-columns: 1fr;
  }

  .project-photo {
    height: min(58vw, 430px);
  }

  .assurance-grid {
    grid-template-columns: 1fr;
    width: min(100%, 680px);
  }
}

@media (max-width: 600px) {
  .co-build-hero {
    padding: 52px 16px 52px;
  }

  .hero-heading p {
    font-size: 18px;
  }

  .hero-heading h1 {
    font-size: 32px;
    line-height: 39px;
  }

  .hero-heading span {
    font-size: 14px;
  }

  .hero-quote {
    width: 100%;
    padding: 26px 24px;
    margin-top: 22px;
  }

  .hero-quote-copy p {
    font-size: 14px;
    line-height: 1.55;
  }

  .hero-quote-copy p + p {
    margin-top: 10px;
  }

  .hero-quote-landscape {
    width: 50%;
    opacity: .45;
  }

  .fundraising-heading {
    margin-top: 34px;
  }

  .project-card {
    margin-top: 8px;
    padding: 16px;
    border-radius: 16px;
  }

  .project-card-inner {
    gap: 20px;
  }

  .project-photo {
    height: min(92vw, 390px);
  }

  .project-copy h2 {
    font-size: 26px;
  }

  .project-total {
    font-size: 36px;
    line-height: 46px;
  }

  .project-description {
    font-size: 14px;
    letter-spacing: .6px;
  }

  .progress-track {
    margin-top: 22px;
  }

  .progress-copy {
    font-size: 13px;
  }

  .project-stats {
    height: auto;
    min-height: 92px;
    margin-top: 22px;
    padding-inline: 0;
  }

  .project-stats dt {
    font-size: 12px;
    letter-spacing: 0;
  }

  .project-stats dd {
    font-size: 14px;
  }

  .ornate-button {
    height: 50px;
    font-size: 20px;
  }

  .assurance-grid {
    margin-top: 28px;
  }

  .assurance-card {
    height: 180px;
  }

  .assurance-card h3 {
    font-size: 25px;
  }

  .assurance-card p {
    font-size: 14px;
    letter-spacing: .4px;
  }
}
</style>
