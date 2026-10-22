<template>
  <div class="co-build-page">
    <!-- 沿用全站导航、页脚、语言切换与返回顶部交互。 -->
    <HomeHeader @select-locale="setLocale" />
    <main>
      <CoBuildHero />
      <!-- <CoBuildRewards /> -->
      <CoBuildMerits />
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
.co-build-page { min-width: 320px; overflow-x: clip; color: #333; background: #f8f5ed; }
</style>
