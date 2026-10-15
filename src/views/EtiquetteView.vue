<template>
  <div class="etiquette-page">
    <!-- 复用全站导航和页脚，页面主体按仪轨流程拆分为三个独立组件。 -->
    <HomeHeader @select-locale="setLocale" />
    <main>
      <EtiquetteHero />
      <EtiquetteIncense />
      <EtiquetteWorship />
      <EtiquetteTaboos />
    </main>
    <HomeFooter />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '@/i18n'
import EtiquetteHero from '@/components/etiquette/EtiquetteHero.vue'
import EtiquetteIncense from '@/components/etiquette/EtiquetteIncense.vue'
import EtiquetteWorship from '@/components/etiquette/EtiquetteWorship.vue'
import EtiquetteTaboos from '@/components/etiquette/EtiquetteTaboos.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'

const { t } = useI18n()

async function setLocale(nextLocale) {
  await setAppLocale(nextLocale)
}
</script>

<style scoped>
.etiquette-page {
  min-width: 320px;
  overflow-x: clip;
  color: #222;
  background: #f8f5ed;
}

</style>
