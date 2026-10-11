<template>
  <!-- 社区列表页外壳：导航、面包屑与栏目标题统一在此，列表内容由默认插槽提供。 -->
  <div class="community-page-shell">
    <HomeHeader @select-locale="setLocale" />
    <main class="community-page-shell__main">
      <PageHeroBackground />
      <!-- 面包屑：首页 / 当前栏目。 -->
      <nav class="community-breadcrumb" :aria-label="t('portal.common.home')">
        <RouterLink to="/">{{ t('portal.common.home') }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ breadcrumb }}</span>
      </nav>

      <HomeSectionHeading :eyebrow="eyebrow" :title="title" :description="subtitle" />
      <div class="community-page-shell__content">
        <slot />
      </div>
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
import HomeSectionHeading from '@/components/home/HomeSectionHeading.vue'

// 面包屑、栏目小标题、主标题与副标题均由使用方传入。
defineProps({
  breadcrumb: { type: String, required: true },
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
})

const { t } = useI18n()
const setLocale = (locale) => setAppLocale(locale)
</script>

<style scoped>
.community-page-shell {
  min-width: 320px;
  overflow-x: clip;
  color: #333;
  background: #f8f4ec;
}

.community-page-shell :deep(.site-header) {
  background-image: linear-gradient(rgba(29, 78, 110, .93), rgba(29, 78, 110, .93)), url('@/assets/blessings/header-texture.webp');
  background-position: center;
  background-size: cover;
}

.community-page-shell__main {
  isolation: isolate;
  position: relative;
  min-height: 1120px;
  padding: 24px max(24px, calc((100vw - 1440px) / 2)) 96px;
  background: #f3f0e9;
}

.community-breadcrumb {
  display: flex;
  gap: 8px;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto 66px;
  color: #9d7a55;
  font-size: 13px;
}

.community-breadcrumb a {
  transition: color .2s ease;
}

.community-breadcrumb a:hover,
.community-breadcrumb a:focus-visible {
  color: #c73412;
}

.community-page-shell__main :deep(.section-heading) {
  margin-bottom: 54px;
}

.community-page-shell__main :deep(.section-heading p) {
  font-size: 18px;
}

.community-page-shell__main :deep(.section-heading h2) {
  font-size: 38px;
}

/* 内容容器统一最大宽度 1440px 并居中。 */
.community-page-shell__content {
  width: min(100%, 1440px);
  margin-inline: auto;
}

@media (max-width: 900px) {
  .community-page-shell__main {
    min-height: 0;
    padding: 20px 20px 72px;
    background-size: auto 900px;
  }

  .community-breadcrumb {
    margin-bottom: 48px;
  }
}

@media (max-width: 600px) {
  .community-page-shell__main {
    padding: 18px 16px 56px;
  }

  .community-breadcrumb {
    margin-bottom: 36px;
    font-size: 12px;
  }

  .community-page-shell__main :deep(.section-heading) {
    margin-bottom: 34px;
  }

  .community-page-shell__main :deep(.section-heading h2) {
    font-size: 30px;
  }
}
</style>
