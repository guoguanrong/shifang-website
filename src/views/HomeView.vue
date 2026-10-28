<template>
  <main class="home-page">
    <!-- 首页顶部导航和首屏视觉区。 -->
    <HomeHeader @select-locale="setLocale" @navigate="scrollToSection" />
    <HomeHero @primary-action="scrollToSection('temple-plan')" />

    <!-- 首页主体内容按设计稿顺序组合，各组件内部维护自己的展示数据。 -->
    <HomeAboutMission />
    <!-- 首页玄门理念区与社区内容共用一张连续的舞台背景。 -->
    <div class="governance-community-stage">
      <img
        class="governance-community-stage__background"
        :src="supervisionStageBackground"
        alt=""
      />
      <div id="governance"><HomeGovernance /></div>
      <div id="community"><HomeCommunity /></div>
    </div>

    <!-- 页脚导航复用本页的平滑滚动方法。 -->
    <HomeFooter @navigate="scrollToSection" />
  </main>

</template>

<script setup>
import { setAppLocale } from '@/i18n'
import HomeAboutMission from '@/components/home/HomeAboutMission.vue'
import HomeCommunity from '@/components/home/HomeCommunity.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeGovernance from '@/components/home/HomeGovernance.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import supervisionStageBackground from '@/assets/cuts/supervision-stage-bg.webp'


// 将头部语言选择转交给全局国际化模块处理。
function setLocale(locale) {
  setAppLocale(locale)
}

// 滚动到首页中与菜单 target 对应的内容模块。
function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}

// 暴露给可能通过模板 ref 调用首页滚动能力的父级组件。
defineExpose({ scrollToModule: scrollToSection })
</script>

<style scoped>
.home-page {
  overflow-x: clip;
  color: #1d4e6e;
  background: #f9f5ed;
}

/*
 * 背景从新版玄门理念区之后开始，连续铺到首页社区内容。
 * 使用独立图片层可以在不改变子组件布局的前提下保持纹理连续。
 */
.governance-community-stage {
  position: relative;
  isolation: isolate;
}

.governance-community-stage__background {
  position: absolute;
  z-index: 0;
  top: 1090px;
  left: 50%;
  width: 100%;
  min-width: 1440px;
  height: 1000px;
  max-width: none;
  object-fit: fill;
  pointer-events: none;
  transform: translateX(-50%);
}

.governance-community-stage > #governance,
.governance-community-stage > #community {
  position: relative;
  z-index: 1;
}


@media (max-width: 900px) {
  /* 移动端模块高度随内容变化，由各模块自身使用同一背景图适配。 */
  .governance-community-stage__background {
    display: none;
  }
}
</style>
