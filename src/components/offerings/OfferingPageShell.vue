<template>
  <!-- 供奉类页面外壳：统一提供导航、面包屑与标题，正文由默认插槽提供。 -->
  <div class="offering-page">
    <HomeHeader @select-locale="setAppLocale" />
    <main class="offering-main">
      <PageHeroBackground />
      <div class="offering-container">
        <nav class="offering-breadcrumb" :aria-label="t('deityDetail.breadcrumb')">
          <RouterLink to="/">{{ t('portal.common.home') }}</RouterLink><span aria-hidden="true">〉</span>
          <RouterLink :to="sectionTo">{{ section }}</RouterLink><span aria-hidden="true">〉</span>
          <span aria-current="page">{{ title }}</span>
        </nav>
        <header class="offering-heading">
          <p>{{ eyebrow }}</p>
          <h1>{{ title }}</h1>
          <p>{{ subtitle }}</p>
        </header>
        <slot />
      </div>
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
import '@/styles/offerings.css'

// section / sectionTo 是面包屑里的上级栏目，其余为标题区文案。
defineProps({ title: String, eyebrow: String, subtitle: String, section: String, sectionTo: String })
const { t } = useI18n()
</script>
