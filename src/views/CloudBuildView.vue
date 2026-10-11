<template>
  <div class="cloud-build-page">
    <HomeHeader @select-locale="setLocale" />
    <main class="cloud-build-main">
      <CloudBuildHero />
      <CloudBuildTransparency />
      <CloudBuildCameras />
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import CloudBuildCameras from '@/components/cloud-build/CloudBuildCameras.vue'
import CloudBuildHero from '@/components/cloud-build/CloudBuildHero.vue'
import CloudBuildTransparency from '@/components/cloud-build/CloudBuildTransparency.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'

const { t } = useI18n()

async function setLocale(nextLocale) {
  await setAppLocale(nextLocale)
}
</script>

<style scoped>
.cloud-build-page {
  min-width: 320px;
  overflow-x: clip;
  color: #333;
  background: #f3f0e9;
}

.cloud-build-main {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
}

/* 设计稿头部叠有一层极浅的宣纸纹理，仅在本页补齐，不改变其他已完成页面。 */
.cloud-build-page :deep(.site-header) {
  background-color: rgba(29, 78, 110, .97);
  background-image: linear-gradient(rgba(29, 78, 110, .9), rgba(29, 78, 110, .9)), url('@/assets/cloud-build/header-texture.png');
  background-position: center;
  background-size: cover;
}

@media (min-width: 1281px) {
  .cloud-build-page :deep(.site-header) {
    /* padding-inline: max(100px, calc((100vw - 1440px) / 2)); */
  }




}
</style>
