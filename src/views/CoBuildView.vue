<template>
  <div class="co-build-page">
    <!-- 沿用全站导航、页脚、语言切换与返回顶部交互。 -->
    <HomeHeader @select-locale="setLocale" />
    <main>
      <CoBuildHero />
      <!-- <CoBuildRewards /> -->
      <div class="hero-copy">
        <p>{{ t('blessings.hero.eyebrow') }}</p>
        <h1>{{ t('blessings.hero.title') }}</h1>
        <small>{{ t('blessings.hero.subtitle') }}</small>
      </div>
      <BlessingsServices />

      <CoBuildMerits style="margin: 50px auto 0;" />
      <!-- <CoBuildReasons /> -->
      <!-- <CoBuildProcess /> -->
      <CloudBuildCameras />
      <CoBuildHonorRoll />
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import CoBuildHero from '@/components/co-build/CoBuildHero.vue'
import CoBuildHonorRoll from '@/components/co-build/CoBuildHonorRoll.vue'
import CloudBuildCameras from '@/components/cloud-build/CloudBuildCameras.vue'
import CoBuildMerits from '@/components/co-build/CoBuildMerits.vue'
import BlessingsServices from '@/components/blessings/BlessingsServices.vue'
// import CoBuildProcess from '@/components/co-build/CoBuildProcess.vue'
// import CoBuildReasons from '@/components/co-build/CoBuildReasons.vue'
// import CoBuildRewards from '@/components/co-build/CoBuildRewards.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'

const { t } = useI18n()

async function setLocale(nextLocale) {
  await setAppLocale(nextLocale)
}
</script>

<style scoped>
.co-build-page {
  min-width: 320px;
  overflow-x: clip;
  color: #333;
  background: #f8f5ed;
}

/* BlessingsServices 在祈福页是按 Figma 画布绝对定位的（top: 254px），
   复用到本页会脱离文档流、导致后面的章节错位叠在一起；
   这里只在本页把它改回正常文档流，不影响祈福页。 */
.co-build-page :deep(.services) {
  position: relative;
  top: auto;
  left: auto;
  z-index: auto;
  width: min(1240px, 100%);
  margin: 28px auto 0;
  transform: none;
}

/* 共建页不展示「电子祈福卡」这张服务卡（祈福页仍保持四张）。
   卡片顺序与语言包 blessings.services 一致：线上点灯 / 神像供奉 / 电子祈福卡 / 节气提醒。 */
.co-build-page :deep(.service-card:nth-child(3)) {
  display: none;
}

/* 只有 3 张卡，宽屏下整卡等比放大到 400px，铺满与祈福页一致的 1240px 版心：
   3×400 + 2×20 = 1240。卡片底图是 295×518 整图、内部元素全部按这个尺寸绝对定位，
   所以用 zoom 等比放大，不能只改 width（否则底图横向拉伸、元素错位）。
   窄屏仍沿用组件自身的 2 列 / 1 列降级规则。 */
@media (min-width: 1240px) {
  .co-build-page :deep(.services) {
    grid-template-columns: repeat(3, 400px);
  }

  .co-build-page :deep(.service-card) {
    zoom: 1.3559;
  }
}

/* 同样取自祈福页横幅的 .hero-copy，在那边是绝对定位在 567px 横幅里的；
   本页没有那条横幅（定位基准会退到页面顶部，压在 CoBuildHero 上），
   改成正常文档流的章节标题，排在服务卡片上方。 */
.hero-copy {
  width: min(92%, 520px);
  margin: 0px auto 0;
  text-align: center;
  font-family: var(--font-calligraphy);
}

.hero-copy p {
  margin: 0 0 3px;
  color: #d0a06d;
  font-size: 24px;
  line-height: 30px;
}

.hero-copy h1 {
  margin: 0;
  color: #1d4e6e;
  font-size: 42px;
  font-weight: 400;
  line-height: 52px;
  letter-spacing: 2px;
}

.hero-copy small {
  display: block;
  color: #333;
  font-size: 16px;
  line-height: 20px;
}

@media (max-width:900px) {
  .hero-copy {
    margin-top: 50px;
  }

  .hero-copy p {
    font-size: 18px;
  }

  .hero-copy h1 {
    font-size: 34px;
  }

  .hero-copy small {
    font-size: 14px;
  }
}
</style>
