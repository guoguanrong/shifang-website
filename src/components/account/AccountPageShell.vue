<template>
  <!-- 个人中心页外壳：页头、页脚、返回顶部都是公共组件，页面正文由默认插槽填充。 -->
  <div class="offering-page account-page">
    <HomeHeader @select-locale="setAppLocale" />
    <main class="offering-main">
      <PageHeroBackground />
      <div class="offering-container">
        <!-- 面包屑：首页 / 当前页标题；分隔符对读屏隐藏，末项用 aria-current="page" 标记当前位置。 -->
        <nav v-if="breadcrumb" class="offering-breadcrumb" :aria-label="t('deityDetail.breadcrumb')">
          <RouterLink to="/">{{ t('portal.common.home') }}</RouterLink><span aria-hidden="true">〉</span>
          <template v-if="accountTrail"><span>{{ t('portal.account.title') }}</span><span aria-hidden="true">〉</span></template>
          <template v-if="parentLink"><RouterLink :to="parentLink.to">{{ parentLink.label }}</RouterLink><span aria-hidden="true">〉</span></template>
          <span aria-current="page">{{ title }}</span>
        </nav>
        <!-- 标题区：小标题（eyebrow）/ 主标题 / 副标题，均为纯展示文案。 -->
        <header class="offering-heading"><p>{{ eyebrow }}</p><h1>{{ title }}</h1><p>{{ subtitle }}</p></header>
        <!-- 页面主体内容由使用方通过默认插槽提供。 -->
        <slot />
      </div>
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import PageHeroBackground from '@/components/common/PageHeroBackground.vue'
// 复用供养页的整体版式，再叠加个人中心专属样式。
import '@/styles/offerings.css'
import '@/styles/account-pages.css'

// 三个文案字段均为可选，使用方按需传入。
defineProps({
  title: String,
  eyebrow: String,
  subtitle: String,
  breadcrumb: { type: Boolean, default: true },
  accountTrail: Boolean,
  parentLink: Object,
})
const { t } = useI18n()
</script>
