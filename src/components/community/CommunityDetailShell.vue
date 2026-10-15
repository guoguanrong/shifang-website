<template>
  <!-- 社区详情页外壳：统一提供导航、面包屑、标题与返回顶部，正文由默认插槽填充。 -->
  <div class="community-detail-shell">
    <HomeHeader @select-locale="setLocale" />
    <main class="community-detail-main">
      <PageHeroBackground />
      <!-- 面包屑：首页 / 所属栏目（可点击返回） / 当前标题。 -->
      <nav class="community-detail-breadcrumb" :aria-label="t('portal.common.home')">
        <RouterLink to="/">{{ t('portal.common.home') }}</RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink :to="sectionTo">{{ section }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ title }}</span>
      </nav>

      <!-- 标题区；meta 插槽可选，用于放置日期、阅读量等元信息。 -->
      <header class="community-detail-heading">
        <p>{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <div v-if="$slots.meta" class="community-detail-meta"><slot name="meta" /></div>
      </header>

      <div class="community-detail-content"><slot /></div>
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { setAppLocale } from '@/i18n'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'

// section / sectionTo 是面包屑里的上级栏目，eyebrow / title 构成标题区。
defineProps({
  section: { type: String, required: true },
  sectionTo: { type: [String, Object], required: true },
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
})

const { t } = useI18n()
// 顶部的语言切换统一交给 i18n 入口处理。
const setLocale = (locale) => setAppLocale(locale)
</script>

<style scoped>
/* 页面底色与最小宽度；横向溢出直接裁掉，避免出现横向滚动条。 */
.community-detail-shell {
  min-width: 320px;
  overflow-x: clip;
  color: #302d29;
  background: #f8f4ec;
}

.community-detail-shell :deep(.site-header) {
  background-image: linear-gradient(rgba(29, 78, 110, .94), rgba(29, 78, 110, .94)), url('@/assets/blessings/header-texture.webp');
  background-position: center;
  background-size: cover;
}

/* 主区左右自适应留白，内容区最大 1440px。 */
.community-detail-main {
  isolation: isolate;
  position: relative;
  padding: 24px max(24px, calc((100vw - 1440px) / 2)) 60px;
  background: #f8f5ed;
}

.community-detail-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  width: min(100%, 1440px);
  margin: 0 auto 68px;
  color: #9d7a55;
  font-size: 13px;
}

.community-detail-breadcrumb a { transition: color .2s ease; }
.community-detail-breadcrumb a:hover,
.community-detail-breadcrumb a:focus-visible { color: #c73412; }

.community-detail-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 960px;
  margin: 0 auto 40px;
  text-align: center;
}

.community-detail-heading > p {
  margin: 0 0 8px;
  color: #d0a06d;
  font-family: var(--font-serif-cn);
  font-size: 20px;
}

.community-detail-heading h1 {
  margin: 0;
  color: #1d4e6e;
  font-family: var(--font-calligraphy);
  font-size: clamp(30px, 2.5vw, 40px);
  font-weight: 400;
  line-height: 1.25;
}

.community-detail-meta {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-top: 9px;
  color: #77716a;
  font-size: 12px;
  letter-spacing: .3px;
}

.community-detail-content {
  width: min(100%, 1440px);
  margin-inline: auto;
}

.community-detail-content :deep(.detail-surface) {
  overflow: hidden;
  background: rgba(255, 252, 248, .86);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 8px 30px rgba(72, 48, 26, .035);
}

.community-detail-content :deep(.detail-media) {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 1440 / 500;
  background: #d6b58f;
}

.community-detail-content :deep(.detail-surface--video .detail-media) { aspect-ratio: 16 / 9; }

.community-detail-content :deep(.detail-media > img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.community-detail-content :deep(.detail-body) {
  padding: 32px 40px 60px;
  background: rgba(255, 253, 250, .72);
}

.community-detail-content :deep(.detail-identity) {
  margin: 0 0 20px;
  color: #312e2a;
  font-family: var(--font-calligraphy);
  font-size: 16px;
}

.community-detail-content :deep(.detail-copy) {
  margin: 0 0 9px;
  color: #37332e;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  line-height: 1.9;
  text-align: justify;
}

.community-detail-content :deep(.detail-copy:last-child) { margin-bottom: 0; }

/* 引文块：左侧竖排标签 + 右侧内容。以下 :deep() 规则用于统一插槽内容的排版。 */
.community-detail-content :deep(.detail-quote) {
  display: grid;
  grid-template-columns: 34px 1fr;
  min-height: 68px;
  margin: 22px 0 28px;
  overflow: hidden;
  color: #3f3933;
  background: rgba(255, 255, 255, .76);
  border-radius: 11px;
}

.community-detail-content :deep(.detail-quote__label) {
  display: grid;
  place-items: center;
  color: #8a5422;
  font-family: var(--font-calligraphy);
  font-size: 12px;
  line-height: 1.15;
  background: linear-gradient(180deg, #f8e8ce, #f4d8ad);
  border: 1px solid #d8ac72;
  border-radius: 999px;
}

.community-detail-content :deep(.detail-quote p) {
  align-self: center;
  margin: 0;
  padding: 12px 18px;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  line-height: 1.65;
}

.community-detail-content :deep(.detail-label) {
  display: inline-flex;
  min-width: 136px;
  align-items: center;
  margin: 0 0 22px;
  padding: 4px 12px;
  color: #5e4e3e;
  font-family: var(--font-calligraphy);
  font-size: 14px;
  background: linear-gradient(90deg, rgba(218, 190, 154, .78), rgba(244, 231, 213, .58) 65%, transparent);
  border-radius: 999px;
}

.community-detail-content :deep(.detail-play) {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  display: grid;
  width: 62px;
  height: 62px;
  place-items: center;
  padding: 0 0 0 4px;
  color: #1f2932;
  font-size: 25px;
  cursor: pointer;
  background: rgba(255, 255, 255, .8);
  border: 1px solid rgba(255, 255, 255, .92);
  border-radius: 50%;
  box-shadow: 0 5px 20px rgba(0, 0, 0, .16);
  transform: translate(-50%, -50%);
  transition: transform .2s ease, background-color .2s ease;
}

.community-detail-content :deep(.detail-play:hover),
.community-detail-content :deep(.detail-play:focus-visible) {
  background: #fff;
  transform: translate(-50%, -50%) scale(1.08);
}

/* 平板：收窄内边距与标题区留白。 */
@media (max-width: 900px) {
  .community-detail-main { padding: 20px 20px 48px; background-size: auto 900px; }
  .community-detail-breadcrumb { margin-bottom: 48px; }
  .community-detail-heading { margin-bottom: 30px; }
  .community-detail-content :deep(.detail-body) { padding: 26px 28px 42px; }
}

@media (max-width: 600px) {
  .community-detail-main { padding: 18px 16px 38px; }
  .community-detail-breadcrumb { margin-bottom: 38px; font-size: 12px; }
  .community-detail-heading { margin-bottom: 24px; }
  .community-detail-heading > p { font-size: 16px; }
  .community-detail-heading h1 { font-size: 28px; }
  .community-detail-meta { gap: 18px; font-size: 11px; }
  .community-detail-content :deep(.detail-surface) { border-radius: 9px 9px 0 0; }
  .community-detail-content :deep(.detail-media),
  .community-detail-content :deep(.detail-surface--video .detail-media) { aspect-ratio: 4 / 3; }
  .community-detail-content :deep(.detail-body) { padding: 22px 18px 32px; }
  .community-detail-content :deep(.detail-identity) { margin-bottom: 16px; font-size: 15px; }
  .community-detail-content :deep(.detail-copy) { font-size: 13px; line-height: 1.8; text-align: left; }
  .community-detail-content :deep(.detail-quote) { grid-template-columns: 31px 1fr; margin: 18px 0 24px; }
  .community-detail-content :deep(.detail-quote p) { padding: 11px 13px; font-size: 13px; }
  .community-detail-content :deep(.detail-label) { margin-bottom: 16px; }
  .community-detail-content :deep(.detail-play) { width: 52px; height: 52px; font-size: 21px; }
}

/* 系统开启「减少动态效果」时去掉播放按钮的过渡。 */
@media (prefers-reduced-motion: reduce) {
  .community-detail-content :deep(.detail-play) { transition: none; }
}
</style>
