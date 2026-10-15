<template>
  <div class="wellness-page">
    <!-- 复用全站导航和页脚，主体按设计稿章节拆分为可维护的独立组件。 -->
    <HomeHeader @select-locale="setLocale" />
    <main>
      <WellnessHero />
      <WellnessPrinciples />
      <WellnessMethods />
      <WellnessRhythm />
      <WellnessPractice />
      <WellnessKnowledge />
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import WellnessHero from '@/components/wellness/WellnessHero.vue'
import WellnessKnowledge from '@/components/wellness/WellnessKnowledge.vue'
import WellnessMethods from '@/components/wellness/WellnessMethods.vue'
import WellnessPractice from '@/components/wellness/WellnessPractice.vue'
import WellnessPrinciples from '@/components/wellness/WellnessPrinciples.vue'
import WellnessRhythm from '@/components/wellness/WellnessRhythm.vue'

const { t } = useI18n()

// 语言切换统一走全局异步加载流程，避免路由跳转后出现旧语言布局残留。
async function setLocale(nextLocale) {
  await setAppLocale(nextLocale)
}
</script>

<style scoped>
.wellness-page { min-width: 320px; overflow-x: clip; color: #222; background: #f8f5ed; }
</style>
