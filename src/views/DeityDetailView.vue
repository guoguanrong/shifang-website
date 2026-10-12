<template>
  <div class="deity-detail-page" :class="{ 'is-standard-detail': deityId !== 'doumu' }">
    <HomeHeader @select-locale="setAppLocale" />
    <main class="deity-detail-main">
      <PageHeroBackground />
      <div class="deity-detail-container">
        <nav class="detail-breadcrumb" :aria-label="t('deityDetail.breadcrumb')">
          <RouterLink to="/">{{ t('portal.common.home') }}</RouterLink>
          <span aria-hidden="true">〉</span>
          <RouterLink :to="{ name: 'deities' }">{{ t('deityDetail.section') }}</RouterLink>
          <span aria-hidden="true">〉</span>
          <span aria-current="page">{{ deity.title }}</span>
        </nav>

        <header class="detail-heading">
          <p>{{ detail.eyebrow }}</p>
          <h1>{{ deity.title }}</h1>
          <span>{{ detail.subtitle || deity.subtitle }}</span>
        </header>

        <article class="detail-profile detail-paper">
          <div class="detail-portrait">
            <img :src="portrait" :alt="deity.title" width="500" height="500" />
            <img class="detail-portrait-border" :src="featuredBorder" alt="" aria-hidden="true" />
          </div>
          <div class="detail-profile-content">
            <h2>{{ deity.title }}</h2>
            <p class="detail-summary">{{ deity.description }}</p>
            <dl class="detail-facts">
              <div v-for="(fact, index) in detail.meta" :key="index">
                <dt>{{ fact.label }}</dt>
                <dd>{{ fact.value }}</dd>
              </div>
            </dl>
            <DeityMerit class="detail-merit" :label="t('deities.meritLabel')" :title="deity.meritTitle"
              :description="deity.meritDescription" />
            <DeityActionButtons class="detail-actions" :deity-id="deityId" large />
          </div>
        </article>

        <article class="detail-article detail-paper">
          <section>
            <OrnateSectionHeading :title="detail.introductionTitle" />
            <p class="detail-copy">{{ detail.introduction }}</p>
            <div class="detail-guides">
              <section v-for="(guide, index) in detail.guides" :key="index">
                <h3>{{ guide.title }}</h3>
                <p class="detail-copy">{{ guide.text }}</p>
              </section>
            </div>
          </section>
          <section v-if="detail.hierarchy" class="detail-role">
            <OrnateSectionHeading :title="detail.roleTitle" />
            <p class="detail-copy detail-role-description">{{ detail.roleDescription }}</p>
            <DeityHierarchy :hierarchy="detail.hierarchy" />
          </section>
          <section v-if="detail.story.length" class="detail-story">
            <OrnateSectionHeading :title="detail.storyTitle" />
            <p v-for="(paragraph, index) in detail.story" :key="index" class="detail-copy">{{ paragraph }}</p>
          </section>
          <div class="detail-audience" :class="{ 'has-single-audience': detail.audiences.length === 1 }">
            <h3>{{ detail.audienceTitle }}</h3>
            <ul>
              <li v-for="(audience, index) in detail.audiences" :key="index">{{ audience }}</li>
            </ul>
          </div>
        </article>
      </div>
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import OrnateSectionHeading from '@/components/common/OrnateSectionHeading.vue'
import DeityActionButtons from '@/components/deities/DeityActionButtons.vue'
import DeityMerit from '@/components/deities/DeityMerit.vue'
import DeityHierarchy from '@/components/deities/DeityHierarchy.vue'
import featuredDeity from '@/assets/deities/featured-deity.svg'
import featuredBorder from '@/assets/deities/featured-deity.svg'
import leizunPortrait from '@/assets/deities/detail/leizun.webp'
import { deityImages } from '@/components/deities/deityImages'

const props = defineProps({ deityId: { type: String, default: 'doumu' } })
const { t, tm } = useI18n()
const deity = computed(() => props.deityId === 'doumu'
  ? tm('deities.featured')
  : tm('deities.cards').find((item) => item.id === props.deityId))
const portrait = computed(() => {
  if (props.deityId === 'doumu') return featuredDeity
  if (props.deityId === 'leizun') return leizunPortrait
  return deityImages[props.deityId]
})
const detail = computed(() => {
  const base = tm('deityDetail')
  if (props.deityId === 'doumu') return base

  const profile = base.profiles[props.deityId]
  if (profile) return { ...base, ...profile, hierarchy: null, story: [] }

  // 未提供独立长文的神祇只展示已有资料，不套用雷祖的经典及供奉说明。
  const common = base.profiles.common
  const current = deity.value
  return {
    ...base,
    eyebrow: common.eyebrow,
    meta: [
      { label: common.identity, value: current.subtitle },
      { label: common.notes, value: current.meta.join(' · ') },
    ],
    introduction: current.description,
    guides: [
      { title: common.backgroundTitle, text: current.meta.join(' · ') },
      { title: common.worshipTitle, text: `${current.meritTitle} · ${current.meritDescription}` },
    ],
    hierarchy: null,
    story: [],
    audiences: [current.meritDescription],
  }
})
</script>

<style scoped>
.deity-detail-page {
  min-width: 320px;
  color: #333;
  background: #f3f0e9;
}

/* 书法体只作用于正文区域：写在页面根节点上会级联进公共页头，导致导航字体随页面变化。 */
.deity-detail-main {
  isolation: isolate;
  position: relative;
  padding: 30px 24px 60px;
  font-family: var(--font-calligraphy);
}

.deity-detail-container {
  position: relative;
  width: min(100%, 1440px);
  margin: 0 auto;
}

.detail-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: center;
  color: #c29f79;
  font-size: 16px;
  line-height: 20px;
}

.detail-breadcrumb [aria-current] {
  color: #333;
}

.detail-breadcrumb a:hover {
  color: #a51c1c;
}

.detail-breadcrumb a:focus-visible {
  outline: 2px solid #c29f79;
  outline-offset: 4px;
}

.detail-heading {
  margin: 65px auto 40px;
  text-align: center;
}

.detail-heading p {
  color: #d0a06d;
  font-size: 24px;
  line-height: 1.2;
}

.detail-heading h1 {
  margin: 8px 0 10px;
  color: #1d4e6e;
  font-size: 42px;
  font-weight: 400;
  line-height: 1.2;
}

.detail-heading>span {
  font-size: 16px;
}

.detail-paper {
  position: relative;
  border: 1px solid #f2d2af;
  border-radius: 26px;
  background: #fff;
}

.detail-paper::before {
  position: absolute;
  inset: 9px;
  content: '';
  pointer-events: none;
  border: 1px solid #f2d2af;
  border-radius: 20px;
}

.detail-profile {
  display: grid;
  grid-template-columns: minmax(0, 512px) minmax(0, 640px);
  justify-content: space-between;
  gap: 40px;
  min-height: 590px;
  padding: 40px 9% 40px 34px;
  background: linear-gradient(#fff, #f3f0e9);
}

.detail-portrait {
  position: relative;
  align-self: center;
  width: 100%;
  padding: 6px;
  aspect-ratio: 1;
}

.detail-portrait>img:first-child {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 43%;
}

.detail-portrait-border {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.detail-profile-content {
  min-width: 0;
  align-self: center;
}

.detail-profile-content>h2 {
  margin-bottom: 20px;
  font-size: 32px;
  line-height: 1.2;
  font-weight: 400;
}

.detail-summary {
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 1.6px;
  text-align: justify;
}

.detail-facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 28px;
  margin: 28px 0 36px;
}

.detail-facts>div {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}

.detail-facts dt {
  padding: 5px;
  text-align: center;
  background: url('@/assets/deities/card-tag.svg') center / 100% 100% no-repeat;
}

.detail-facts dd {
  font-size: 16px;
  line-height: 1.5;
}

.detail-actions {
  margin-top: 30px;
}

.detail-actions.is-large {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px;
}

.detail-merit {
  height: auto;
  min-height: 100px;
}

.detail-merit :deep(> div) {
  height: auto;
  min-height: 94px;
}

.detail-article {
  margin-top: 40px;
  padding: 30px 69px 60px;
}

.detail-article :deep(.ornate-heading h2) {
  padding-left: .5em;
  letter-spacing: .5em;
}

.detail-copy {
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 1.6px;
  text-align: justify;
}

.detail-guides {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 54px;
  margin-top: 30px;
}

.detail-guides>section {
  padding: 30px 38px;
  border-radius: 20px;
  background: linear-gradient(#f3f0e9, transparent);
}

.detail-guides h3 {
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 400;
}

.detail-role,
.detail-story {
  margin-top: 40px;
}

.detail-role-description {
  text-align: center;
}

.detail-story>p {
  margin-bottom: 12px;
  text-indent: 2em;
}

.detail-audience {
  display: grid;
  grid-template-columns: 37px minmax(0, 1fr);
  margin-top: 30px;
  min-height: 100px;
}

.detail-audience h3 {
  display: grid;
  place-items: center;
  background: url('@/assets/deities/merit-label-bg.svg') center / 100% 100% no-repeat;
  font-size: 18px;
  font-weight: 400;
  writing-mode: vertical-rl;
}

.detail-audience ul {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: center;
  margin-block: 3px;
  padding: 16px 8px;
  border-radius: 0 18px 18px 0;
  background: #f3f0e9;
}

.detail-audience li {
  padding: 0 18px;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
}

.detail-audience li+li {
  border-left: 1px solid #c29f79;
}

.detail-audience.has-single-audience ul {
  grid-template-columns: 1fr;
}

.is-standard-detail .detail-article {
  min-height: 690px;
}

.is-standard-detail .detail-guides>section {
  min-height: 220px;
}

.is-standard-detail .detail-portrait>img:first-child {
  object-position: center 60%;
}

@media (max-width: 1439px) {
  .detail-profile {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
    padding: 34px;
  }

  .detail-article {
    padding-inline: 40px;
  }

  .detail-facts {
    gap: 16px;
  }

  .detail-facts>div {
    grid-template-columns: 70px minmax(0, 1fr);
    gap: 10px;
  }
}

@media (min-width: 1181px) and (max-width: 1280px) {

  /* 该尺寸下公共页头原本隐藏语言选择，详情页仍需随时切换语言。 */
  .deity-detail-page :deep(.site-header) {
    gap: 12px;
    padding-inline: 24px;
  }

  .deity-detail-page :deep(.desktop-nav) {
    gap: 12px;
    margin-left: 0;
    font-size: 14px;
  }

  .deity-detail-page :deep(.header-actions) {
    display: flex;
    gap: 8px;
    margin-left: 0;
  }
}

@media (max-width: 1000px) {
  .is-standard-detail .detail-article {
    min-height: 0;
  }

  .detail-profile {
    grid-template-columns: 1fr;
  }

  .detail-portrait {
    max-width: 512px;
    margin: 0 auto;
  }

  .detail-profile-content {
    width: min(100%, 680px);
    margin: 0 auto;
  }

  .detail-guides {
    gap: 24px;
  }

  .detail-guides>section {
    padding: 24px;
  }

  .detail-audience ul {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .detail-audience li+li {
    border: 0;
  }
}

@media (max-width: 600px) {
  .deity-detail-main {
    padding: 22px 14px 36px;
  }

  .detail-breadcrumb {
    font-size: 13px;
  }

  .detail-heading {
    margin: 40px auto 28px;
  }

  .detail-heading h1 {
    font-size: 34px;
  }

  .detail-heading p {
    font-size: 20px;
  }

  .detail-heading>span {
    font-size: 14px;
  }

  .detail-profile {
    gap: 24px;
    padding: 22px;
  }

  .detail-profile-content>h2 {
    font-size: 28px;
  }

  .detail-summary,
  .detail-copy {
    font-size: 14px;
    line-height: 1.8;
    letter-spacing: .5px;
  }

  .detail-facts {
    grid-template-columns: 1fr;
    margin-block: 24px;
  }

  .detail-facts dd {
    font-size: 14px;
  }

  .detail-actions.is-large {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .detail-article {
    margin-top: 28px;
    padding: 20px 20px 30px;
  }

  .detail-guides {
    grid-template-columns: 1fr;
    margin-top: 24px;
    gap: 10px;
  }

  .detail-guides>section {
    padding: 20px;
  }

  .detail-guides h3 {
    font-size: 24px;
  }

  .detail-role,
  .detail-story {
    margin-top: 24px;
  }

  .detail-audience li {
    font-size: 14px;
  }
}

:global(html[data-locale-layout='international'] .deity-detail-main) {
  font-family: var(--font-serif-cn);
}

:global(html[data-locale-layout='international'] .detail-summary),
:global(html[data-locale-layout='international'] .detail-copy) {
  letter-spacing: 0;
  line-height: 1.75;
  text-align: left;
}

:global(html[data-locale-layout='international'] .detail-facts dt) {
  font-size: 12px;
}

:global(html[data-locale-layout='international'] .detail-facts dd) {
  font-size: 14px;
}

:global(html[data-locale-layout='international'] .detail-audience h3) {
  font-size: 13px;
}

:global(html[data-locale-layout='international'] .detail-article .ornate-heading h2) {
  padding-left: 0;
  letter-spacing: 0;
  white-space: normal;
}
</style>
